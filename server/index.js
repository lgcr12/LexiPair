import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { fetch as undiciFetch, ProxyAgent } from 'undici';

const app = express();
const port = Number(process.env.PORT || 8787);
const baseURL = process.env.OPENAI_BASE_URL || process.env.AI_BASE_URL;
const provider = process.env.AI_PROVIDER || (baseURL?.includes('mimo') ? 'mimo' : 'openai');
const model = process.env.AI_MODEL || process.env.MIMO_MODEL || process.env.OPENAI_MODEL || (provider === 'mimo' ? 'mimo-v2-flash' : 'gpt-4.1-mini');
const requestTimeoutMs = Number(process.env.OPENAI_TIMEOUT_MS || 30000);
const proxyURL = process.env.OPENAI_PROXY || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY;
const apiKey = provider === 'mimo' ? process.env.MIMO_API_KEY : process.env.OPENAI_API_KEY;
const dataDir = path.resolve(process.cwd(), process.env.SYNC_DATA_DIR || 'server-data/accounts');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  : null;

app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

function accountFile(email) {
  const normalized = String(email || '').trim().toLowerCase();
  const hash = crypto.createHash('sha256').update(normalized).digest('hex');
  return path.join(dataDir, `${hash}.json`);
}

async function readSyncedAccount(email) {
  try {
    const raw = await fs.readFile(accountFile(email), 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeSyncedAccount(email, data) {
  await ensureDataDir();
  const payload = {
    ...data,
    email: String(email || '').trim().toLowerCase(),
    syncedAt: new Date().toISOString()
  };
  await fs.writeFile(accountFile(email), JSON.stringify(payload, null, 2));
  return payload;
}

async function getAuthedUser(req) {
  if (!supabase) return null;
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    const authError = new Error('登录已过期，请重新通过邮箱验证登录');
    authError.status = 401;
    throw authError;
  }
  return data.user;
}

async function readSupabaseSnapshot(user) {
  const { data, error } = await supabase
    .from('account_snapshots')
    .select('data, synced_at, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;
  return data ? {
    ...(data.data || {}),
    email: user.email,
    syncedAt: data.synced_at || data.updated_at
  } : null;
}

async function writeSupabaseSnapshot(user, data) {
  const payload = {
    ...data,
    email: user.email,
    syncedAt: new Date().toISOString()
  };
  const { error } = await supabase
    .from('account_snapshots')
    .upsert({
      user_id: user.id,
      email: user.email,
      data: payload,
      synced_at: payload.syncedAt
    }, { onConflict: 'user_id' });
  if (error) throw error;
  return payload;
}

function fallbackInsight(group) {
  const words = group.words?.map((item) => item.word) || [];
  const meanings = group.words?.map((item) => `${item.word}: ${item.meaning}`).join('；') || '';
  return {
    summary: `${words.join(' / ')} 的重点是区分词形、词义和固定搭配。`,
    mnemonic: group.words?.map((item) => `${item.word}: ${item.hint || item.meaning}`).join('；') || '',
    contrast: meanings,
    shapeDiff: `观察 ${words.join(' / ')} 的首尾字母和中间差异。`,
    rootTip: '先用核心义建立记忆，再补充派生义。',
    collocations: group.words?.map((item) => item.collocation).filter(Boolean) || [],
    trap: '常见错误是只看拼写相似，忽略词性、搭配和语境。',
    quiz: `先回忆核心释义，再判断词性和搭配。`,
    examples: group.words?.map((item) => item.sentence).filter(Boolean) || [],
    generatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    provider: 'local-fallback'
  };
}

const insightSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    mnemonic: { type: 'string' },
    contrast: { type: 'string' },
    shapeDiff: { type: 'string' },
    rootTip: { type: 'string' },
    collocations: {
      type: 'array',
      items: { type: 'string' }
    },
    trap: { type: 'string' },
    quiz: { type: 'string' },
    examples: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['summary', 'mnemonic', 'contrast', 'shapeDiff', 'rootTip', 'collocations', 'trap', 'quiz', 'examples']
};

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    provider,
    model,
    aiConfigured: Boolean(apiKey),
    timeoutMs: requestTimeoutMs,
    baseURL: baseURL || (provider === 'mimo' ? 'https://api.mimo-v2.com/v1' : 'https://api.openai.com/v1'),
    proxyConfigured: Boolean(proxyURL),
    syncProvider: supabase ? 'supabase' : 'file'
  });
});

app.get('/api/sync/:email', async (req, res) => {
  try {
    const user = await getAuthedUser(req);
    const data = user ? await readSupabaseSnapshot(user) : await readSyncedAccount(req.params.email);
    res.json({ ok: true, provider: user ? 'supabase' : 'file', data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ ok: false, error: error.message });
  }
});

app.post('/api/sync/:email', async (req, res) => {
  try {
    const user = await getAuthedUser(req);
    const data = user
      ? await writeSupabaseSnapshot(user, req.body?.data || {})
      : await writeSyncedAccount(req.params.email, req.body?.data || {});
    res.json({ ok: true, provider: user ? 'supabase' : 'file', data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ ok: false, error: error.message });
  }
});

app.post('/api/study-events', async (req, res) => {
  try {
    const user = await getAuthedUser(req);
    if (!user) return res.json({ ok: true, provider: 'file', skipped: true });
    const event = req.body?.event || {};
    const { error } = await supabase.from('study_events').insert({
      user_id: user.id,
      group_id: event.groupId,
      result: event.result,
      word: event.word,
      stage: event.stage,
      level: event.level,
      created_at: event.createdAt || new Date().toISOString()
    });
    if (error) throw error;
    return res.json({ ok: true, provider: 'supabase' });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ ok: false, error: error.message });
  }
});

function publicErrorMessage(error) {
  const status = error?.status || error?.code;
  const message = error?.message || 'AI request failed';
  if (String(message).toLowerCase().includes('timed out')) {
    return `AI request timed out after ${Math.round(requestTimeoutMs / 1000)}s. Try OPENAI_MODEL=gpt-4.1-mini or check network/proxy.`;
  }
  if (message === 'Connection error.' || error?.code === 'ECONNRESET' || error?.code === 'ENOTFOUND') {
    return '服务端无法连接 AI 接口。请检查网络、代理，或在 .env 配置可访问的 OPENAI_BASE_URL/AI_BASE_URL。';
  }
  if (status === 401) return 'API Key 无效或没有权限，请检查 .env 里的 MIMO_API_KEY 或 OPENAI_API_KEY。';
  if (status === 403) return '当前 Key 没有访问该模型的权限，请换成 OPENAI_MODEL=gpt-4.1-mini。';
  if (status === 404) return `模型 ${model} 不存在或当前账号不可用，请修改 OPENAI_MODEL。`;
  if (status === 429 && error?.code === 'insufficient_quota') {
    return 'OpenAI Key 额度不足或未开通计费，请检查 Billing/余额，或更换有额度的 API Key。';
  }
  if (status === 429) return 'OpenAI 配额或频率限制，请检查余额、限额或稍后再试。';
  return message;
}

function buildInsightPayload(group, mode) {
  return {
    mode,
    title: group.title,
    type: group.type,
    level: group.level,
    source: group.source,
    words: group.words.map((word) => ({
      word: word.word,
      pos: word.pos,
      meaning: word.meaning,
      hint: word.hint,
      collocation: word.collocation,
      sentence: word.sentence,
      misuse: word.misuse
    })),
    compareWords: (group.compareWords || []).map((word) => ({
      word: word.word,
      pos: word.pos,
      meaning: word.meaning,
      hint: word.hint,
      collocation: word.collocation,
      sentence: word.sentence,
      misuse: word.misuse
    }))
  };
}

function buildSystemPrompt() {
  return [
    '你是考研英语词汇老师，专门讲易混词和记忆法。',
    '输出必须是中文，简洁但具体。',
    '不要泛泛而谈，不要重复模板。',
    'summary 说明这组词或这个单词最容易错在哪里。',
    'mnemonic 给一个可记忆的口诀或联想。',
    'contrast 对比词义、词性、搭配；如果只有一个词，就解释核心义和派生义。',
    'shapeDiff 专门说明拼写形近点：不同字母、前后缀、词形结构。',
    'rootTip 说明词根词缀或最短记忆抓手。',
    'collocations 给 2-5 个高频搭配，数组。',
    'trap 给一个考试中最容易踩的误区。',
    '如果输入里有 compareWords，contrast 必须逐个对比目标词与这些相近词，说明哪里像、哪里不同、考试怎么区分。',
    'quiz 给一个自测提示。',
    'examples 给 1-3 个短例句或填空提示。',
    '只返回 JSON，不要 Markdown，不要代码块。JSON 字段必须是 summary, mnemonic, contrast, shapeDiff, rootTip, collocations, trap, quiz, examples。'
  ].join('\n');
}

function normalizeInsight(parsed, group) {
  const fallback = fallbackInsight(group);
  return {
    ...fallback,
    ...parsed,
    collocations: Array.isArray(parsed.collocations) ? parsed.collocations : fallback.collocations,
    examples: Array.isArray(parsed.examples) ? parsed.examples : fallback.examples
  };
}

function parseJsonText(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI did not return JSON');
    return JSON.parse(match[0]);
  }
}

async function createMimoInsight(group, mode) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  const endpoint = `${baseURL || 'https://api.mimo-v2.com/v1'}/chat/completions`;
  try {
    const response = await undiciFetch(endpoint, {
      method: 'POST',
      dispatcher: proxyURL ? new ProxyAgent(proxyURL) : undefined,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'api-key': apiKey
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: JSON.stringify(buildInsightPayload(group, mode)) }
        ],
        max_completion_tokens: 2048,
        temperature: 0.4,
        top_p: 0.9,
        stream: false
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data?.error?.message || data?.message || `Mimo request failed with ${response.status}`);
      error.status = response.status;
      error.code = data?.error?.code;
      throw error;
    }
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Mimo response is empty');
    return parseJsonText(content);
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`AI request timed out after ${Math.round(requestTimeoutMs / 1000)}s.`);
      timeoutError.code = 'timeout';
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

app.post('/api/ai/insight', async (req, res) => {
  const { group, mode = 'study' } = req.body || {};
  if (!group?.words?.length) {
    return res.status(400).json({ error: 'Missing group.words' });
  }

  if (!apiKey) {
    return res.status(503).json({
      error: 'AI API key is not configured',
      insight: fallbackInsight(group)
    });
  }

  try {
    if (provider === 'mimo') {
      const parsed = await createMimoInsight(group, mode);
      return res.json({
        insight: {
          ...normalizeInsight(parsed, group),
          generatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          provider: 'mimo',
          model
        }
      });
    }

    const fetchOptions = proxyURL ? { dispatcher: new ProxyAgent(proxyURL) } : undefined;
    const client = new OpenAI({
      apiKey,
      baseURL,
      timeout: requestTimeoutMs,
      maxRetries: 0,
      fetchOptions
    });
    const response = await client.responses.create({
      model,
      store: false,
      max_output_tokens: 520,
      instructions: buildSystemPrompt(),
      input: JSON.stringify(buildInsightPayload(group, mode)),
      text: {
        format: {
          type: 'json_schema',
          name: 'lexipair_ai_insight',
          strict: true,
          schema: insightSchema
        }
      }
    });

    const parsed = JSON.parse(response.output_text);
    res.json({
      insight: {
        ...normalizeInsight(parsed, group),
        generatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        provider: 'openai',
        model
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: publicErrorMessage(error),
      insight: fallbackInsight(group)
    });
  }
});

app.post('/api/ai/batch-insights', async (req, res) => {
  const groups = Array.isArray(req.body?.groups) ? req.body.groups.slice(0, 20) : [];
  const mode = req.body?.mode || 'prefetch';
  if (!groups.length) return res.status(400).json({ error: 'Missing groups' });
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI API key is not configured',
      insights: Object.fromEntries(groups.map((group) => [group.id, fallbackInsight(group)]))
    });
  }
  const insights = {};
  const errors = {};
  for (const group of groups) {
    try {
      const parsed = provider === 'mimo'
        ? await createMimoInsight(group, mode)
        : await (async () => {
          const client = new OpenAI({
            apiKey,
            baseURL,
            timeout: requestTimeoutMs,
            fetchOptions: proxyURL ? { dispatcher: new ProxyAgent(proxyURL) } : undefined
          });
          const response = await client.responses.create({
            model,
            input: [
              { role: 'system', content: buildSystemPrompt() },
              { role: 'user', content: JSON.stringify(buildInsightPayload(group, mode)) }
            ]
          });
          return parseJsonText(response.output_text);
        })();
      insights[group.id] = {
        ...normalizeInsight(parsed, group),
        generatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        provider,
        model
      };
    } catch (error) {
      errors[group.id] = publicErrorMessage(error);
      insights[group.id] = {
        ...fallbackInsight(group),
        provider: 'local-fallback',
        error: errors[group.id]
      };
    }
  }
  return res.json({ insights, errors });
});

app.listen(port, () => {
  console.log(`LexiPair API listening on http://localhost:${port}`);
});
