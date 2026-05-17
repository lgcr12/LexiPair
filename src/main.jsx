import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Apple,
  ArrowDownToLine,
  BarChart3,
  BookOpen,
  Check,
  ChevronLeft,
  Cloud,
  CloudOff,
  Download,
  Headphones,
  Home,
  Laptop,
  Library,
  Loader2,
  Mail,
  Mic2,
  Moon,
  NotebookPen,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Smartphone,
  Sparkles,
  Star,
  Upload,
  Volume2,
  WifiOff,
  X
} from 'lucide-react';
import { hongbaoshuGroups } from './data/hongbaoshu.js';
import { hongbaoshuWordGroups } from './data/hongbaoshu-words.js';
import './styles.css';

const starterGroups = [
  {
    id: 'g1',
    title: 'adapt / adopt / adept',
    type: '拼写形近',
    level: '高频易混',
    source: '考研核心',
    tags: ['考研', '形近词'],
    words: [
      {
        word: 'adapt',
        phonetic: '/əˈdæpt/',
        pos: 'v.',
        meaning: '适应；改编',
        hint: 'adapt 里有 a，记作 adjust，强调调整自己去适应。',
        collocation: 'adapt to a new environment',
        sentence: 'Students need time to adapt to a new learning system.',
        misuse: '不要把 adapt 写成 adopt。adapt 强调“适应/改编”。'
      },
      {
        word: 'adopt',
        phonetic: '/əˈdɑːpt/',
        pos: 'v.',
        meaning: '采用；收养',
        hint: 'adopt 里有 o，联想 open arms，张开双臂接纳。',
        collocation: 'adopt a method / adopt a child',
        sentence: 'The team decided to adopt a stricter review process.',
        misuse: 'adopt 不表示适应环境，而是“采用/收养”。'
      },
      {
        word: 'adept',
        phonetic: '/əˈdept/',
        pos: 'adj.',
        meaning: '熟练的；擅长的',
        hint: 'adept 里的 e 像 expert，强调能力熟练。',
        collocation: 'be adept at solving problems',
        sentence: 'She is adept at explaining complex ideas clearly.',
        misuse: 'adept 是形容词，常和 at 搭配。'
      }
    ]
  },
  {
    id: 'g2',
    title: 'affect / effect',
    type: '词性易混',
    level: '考研高频',
    source: '写作高频',
    tags: ['考研', '写作'],
    words: [
      {
        word: 'affect',
        phonetic: '/əˈfekt/',
        pos: 'v.',
        meaning: '影响',
        hint: 'affect starts an action，通常作动词。',
        collocation: 'affect the result',
        sentence: 'Sleep quality can affect memory performance.',
        misuse: 'affect 多作动词，不要误当名词“影响”。'
      },
      {
        word: 'effect',
        phonetic: '/ɪˈfekt/',
        pos: 'n.',
        meaning: '影响；效果',
        hint: 'effect is the end result，通常作名词。',
        collocation: 'have an effect on',
        sentence: 'The new policy had a positive effect on students.',
        misuse: 'effect 多作名词，固定搭配是 have an effect on。'
      }
    ]
  },
  {
    id: 'g3',
    title: 'principal / principle',
    type: '拼写形近',
    level: '写作易错',
    source: '同音异义',
    tags: ['写作', '同音词'],
    words: [
      {
        word: 'principal',
        phonetic: '/ˈprɪnsəpəl/',
        pos: 'n./adj.',
        meaning: '校长；主要的',
        hint: 'principal 里有 pal，校长也可以是 school pal。',
        collocation: 'principal reason / school principal',
        sentence: 'The principal reason is the lack of evidence.',
        misuse: 'principal 可指人或“主要的”。'
      },
      {
        word: 'principle',
        phonetic: '/ˈprɪnsəpəl/',
        pos: 'n.',
        meaning: '原则；原理',
        hint: 'principle 结尾 le，像 law，强调规则和原则。',
        collocation: 'basic principle',
        sentence: 'Honesty is a basic principle of academic research.',
        misuse: 'principle 只作名词，表示原则或原理。'
      }
    ]
  },
  {
    id: 'g4',
    title: 'complement / compliment',
    type: '拼写形近',
    level: '表达易错',
    source: '写作高频',
    tags: ['写作', '形近词'],
    words: [
      {
        word: 'complement',
        phonetic: '/ˈkɑːmplɪment/',
        pos: 'v./n.',
        meaning: '补充；使完善',
        hint: 'complement 里有 complete 的 e，表示补足完整。',
        collocation: 'complement each other',
        sentence: 'Reading and writing practice complement each other.',
        misuse: 'complement 强调补足，不是称赞。'
      },
      {
        word: 'compliment',
        phonetic: '/ˈkɑːmplɪment/',
        pos: 'v./n.',
        meaning: '称赞；赞美',
        hint: 'compliment 里有 i，联想 I praise you。',
        collocation: 'pay someone a compliment',
        sentence: 'The teacher complimented her on the clear presentation.',
        misuse: 'compliment 强调表扬，不表示补充完善。'
      }
    ]
  },
  {
    id: 'g5',
    title: 'moral / morale',
    type: '词义易混',
    level: '阅读高频',
    source: '阅读词汇',
    tags: ['阅读', '形近词'],
    words: [
      {
        word: 'moral',
        phonetic: '/ˈmɔːrəl/',
        pos: 'adj./n.',
        meaning: '道德的；寓意',
        hint: 'moral 少一个 e，短而抽象，指道德原则。',
        collocation: 'moral responsibility',
        sentence: 'Scientists have a moral responsibility to report facts.',
        misuse: 'moral 是道德层面的词。'
      },
      {
        word: 'morale',
        phonetic: '/məˈræl/',
        pos: 'n.',
        meaning: '士气；精神面貌',
        hint: 'morale 末尾 e 像 energy，表示团队精神状态。',
        collocation: 'boost morale',
        sentence: 'A small success can greatly boost team morale.',
        misuse: 'morale 不表示道德，而是士气。'
      }
    ]
  }
];

const bookOnlyGroups = [
  {
    id: 'cet6-1',
    title: 'economic / economical',
    type: '词义易混',
    level: '六级高频',
    source: '六级易混词',
    tags: ['六级', '阅读'],
    words: [
      {
        word: 'economic',
        phonetic: '/ˌiːkəˈnɑːmɪk/',
        pos: 'adj.',
        meaning: '经济的；经济学的',
        hint: 'economic 指宏观经济、经济学、经济形势。',
        collocation: 'economic growth',
        sentence: 'The report focuses on economic growth in Asia.',
        misuse: 'economic 不强调省钱。'
      },
      {
        word: 'economical',
        phonetic: '/ˌiːkəˈnɑːmɪkl/',
        pos: 'adj.',
        meaning: '节约的；实惠的',
        hint: 'economical 多了 al，联想 all money saved，强调省钱。',
        collocation: 'an economical car',
        sentence: 'This small car is economical to run.',
        misuse: 'economical 强调节省成本。'
      }
    ]
  },
  {
    id: 'ielts-1',
    title: 'urban / urbane',
    type: '拼写形近',
    level: '雅思阅读',
    source: '雅思易混词',
    tags: ['雅思', '阅读'],
    words: [
      {
        word: 'urban',
        phonetic: '/ˈɜːrbən/',
        pos: 'adj.',
        meaning: '城市的',
        hint: 'urban 和 city 相关，urban area 是城市地区。',
        collocation: 'urban planning',
        sentence: 'Urban planning affects public transport efficiency.',
        misuse: 'urban 不表示举止文雅。'
      },
      {
        word: 'urbane',
        phonetic: '/ɜːrˈbeɪn/',
        pos: 'adj.',
        meaning: '温文尔雅的；彬彬有礼的',
        hint: 'urbane 末尾 e 像 elegance，指人的风度。',
        collocation: 'an urbane host',
        sentence: 'He was known as an urbane and witty speaker.',
        misuse: 'urbane 描述人，不描述城市。'
      }
    ]
  },
  {
    id: 'gre-1',
    title: 'elicit / illicit',
    type: '发音形近',
    level: 'GRE 高频',
    source: 'GRE 易混词',
    tags: ['GRE', '形近词'],
    words: [
      {
        word: 'elicit',
        phonetic: '/ɪˈlɪsɪt/',
        pos: 'v.',
        meaning: '引出；诱出',
        hint: 'elicit 以 e 开头，像 extract，把信息引出来。',
        collocation: 'elicit a response',
        sentence: 'The question was designed to elicit detailed answers.',
        misuse: 'elicit 是动词，不是违法。'
      },
      {
        word: 'illicit',
        phonetic: '/ɪˈlɪsɪt/',
        pos: 'adj.',
        meaning: '非法的；违禁的',
        hint: 'illicit 里的 ill 暗示 bad/illegal。',
        collocation: 'illicit trade',
        sentence: 'The agency investigated illicit online transactions.',
        misuse: 'illicit 是形容词，表示非法。'
      }
    ]
  }
];

const extraBookGroups = [
  {
    id: 'cet6-2',
    title: 'historic / historical',
    type: '词义易混',
    level: '六级高频',
    source: '六级易混词',
    tags: ['六级', '写作'],
    words: [
      { word: 'historic', phonetic: '/hɪˈstɔːrɪk/', pos: 'adj.', meaning: '有历史意义的', hint: 'historic 强调重要、值得被历史记住。', collocation: 'a historic decision', sentence: 'The agreement was a historic step toward peace.', misuse: 'historic 不等于“历史上的普通事件”。' },
      { word: 'historical', phonetic: '/hɪˈstɔːrɪkl/', pos: 'adj.', meaning: '历史的；有关历史的', hint: 'historical 更中性，指和历史相关。', collocation: 'historical records', sentence: 'The museum preserves historical documents.', misuse: 'historical 不一定重要。' }
    ]
  },
  {
    id: 'cet6-3',
    title: 'sensible / sensitive',
    type: '形近义混',
    level: '六级高频',
    source: '六级易混词',
    tags: ['六级', '阅读'],
    words: [
      { word: 'sensible', phonetic: '/ˈsensəbl/', pos: 'adj.', meaning: '明智的；合理的', hint: 'sensible 里有 sense，强调有理性。', collocation: 'a sensible choice', sentence: 'It is sensible to review mistakes regularly.', misuse: 'sensible 不表示敏感。' },
      { word: 'sensitive', phonetic: '/ˈsensətɪv/', pos: 'adj.', meaning: '敏感的；体贴的', hint: 'sensitive 结尾 tive，像 reactive，容易有反应。', collocation: 'be sensitive to criticism', sentence: 'Some students are sensitive to criticism.', misuse: 'sensitive 不表示明智。' }
    ]
  },
  {
    id: 'cet6-4',
    title: 'considerable / considerate',
    type: '形近义混',
    level: '六级高频',
    source: '六级易混词',
    tags: ['六级', '写作'],
    words: [
      { word: 'considerable', phonetic: '/kənˈsɪdərəbl/', pos: 'adj.', meaning: '相当大的；可观的', hint: 'considerable 强调数量或程度大。', collocation: 'considerable progress', sentence: 'She made considerable progress in vocabulary.', misuse: 'considerable 不表示体贴。' },
      { word: 'considerate', phonetic: '/kənˈsɪdərət/', pos: 'adj.', meaning: '体贴的；考虑周到的', hint: 'considerate 像 considerate person，形容人。', collocation: 'be considerate of others', sentence: 'A considerate teacher gives clear feedback.', misuse: 'considerate 不表示数量大。' }
    ]
  },
  {
    id: 'ielts-2',
    title: 'proceed / precede',
    type: '拼写形近',
    level: '雅思阅读',
    source: '雅思易混词',
    tags: ['雅思', '阅读'],
    words: [
      { word: 'proceed', phonetic: '/prəˈsiːd/', pos: 'v.', meaning: '继续进行', hint: 'proceed 的 pro 像 progress，继续向前。', collocation: 'proceed with the plan', sentence: 'The researchers proceeded with the experiment.', misuse: 'proceed 不表示位于之前。' },
      { word: 'precede', phonetic: '/prɪˈsiːd/', pos: 'v.', meaning: '先于；在……之前', hint: 'precede 里的 pre 表示 before。', collocation: 'precede the main event', sentence: 'A short introduction preceded the lecture.', misuse: 'precede 不表示继续。' }
    ]
  },
  {
    id: 'ielts-3',
    title: 'stationary / stationery',
    type: '同音形近',
    level: '雅思写作',
    source: '雅思易混词',
    tags: ['雅思', '写作'],
    words: [
      { word: 'stationary', phonetic: '/ˈsteɪʃəneri/', pos: 'adj.', meaning: '静止的；固定的', hint: 'stationary 有 station，像站着不动。', collocation: 'remain stationary', sentence: 'The vehicle remained stationary for several minutes.', misuse: 'stationary 不表示文具。' },
      { word: 'stationery', phonetic: '/ˈsteɪʃəneri/', pos: 'n.', meaning: '文具', hint: 'stationery 的 e 联想 envelope。', collocation: 'office stationery', sentence: 'The school bought new stationery for students.', misuse: 'stationery 是名词。' }
    ]
  },
  {
    id: 'gre-2',
    title: 'eminent / imminent',
    type: '发音形近',
    level: 'GRE 高频',
    source: 'GRE 易混词',
    tags: ['GRE', '阅读'],
    words: [
      { word: 'eminent', phonetic: '/ˈemɪnənt/', pos: 'adj.', meaning: '著名的；杰出的', hint: 'eminent 里的 e 像 excellent。', collocation: 'an eminent scholar', sentence: 'The lecture was given by an eminent historian.', misuse: 'eminent 不表示即将发生。' },
      { word: 'imminent', phonetic: '/ˈɪmɪnənt/', pos: 'adj.', meaning: '即将发生的；迫近的', hint: 'imminent 里的 im 像 immediate。', collocation: 'imminent danger', sentence: 'The village faced imminent flooding.', misuse: 'imminent 不表示著名。' }
    ]
  },
  {
    id: 'gre-3',
    title: 'ingenious / ingenuous',
    type: '拼写形近',
    level: 'GRE 高频',
    source: 'GRE 易混词',
    tags: ['GRE', '写作'],
    words: [
      { word: 'ingenious', phonetic: '/ɪnˈdʒiːniəs/', pos: 'adj.', meaning: '有独创性的；巧妙的', hint: 'ingenious 里有 genius，强调聪明巧妙。', collocation: 'an ingenious solution', sentence: 'The engineer proposed an ingenious solution.', misuse: 'ingenious 不表示天真。' },
      { word: 'ingenuous', phonetic: '/ɪnˈdʒenjuəs/', pos: 'adj.', meaning: '天真的；坦率的', hint: 'ingenuous 接近 genuine，强调单纯坦率。', collocation: 'an ingenuous remark', sentence: 'His ingenuous question surprised the audience.', misuse: 'ingenuous 不表示聪明巧妙。' }
    ]
  }
];

const wordBooks = [
  {
    id: 'kaoyan',
    name: '考研易混核心',
    subtitle: '适合考研英语一/二',
    count: 5,
    groupIds: ['g1', 'g2', 'g3', 'g4', 'g5']
  },
  {
    id: 'hongbaoshu',
    name: '考研英语红宝书',
    subtitle: '6550 词条 + 形近词复习',
    count: hongbaoshuWordGroups.length,
    groupIds: hongbaoshuWordGroups.map((group) => group.id),
    confusionGroupIds: hongbaoshuGroups.map((group) => group.id)
  },
  {
    id: 'cet6',
    name: '四六级高频易混',
    subtitle: '阅读与写作常见混淆',
    count: 4,
    groupIds: ['cet6-1', 'cet6-2', 'cet6-3', 'cet6-4']
  },
  {
    id: 'ielts',
    name: '雅思阅读易混',
    subtitle: '学术阅读形近词',
    count: 3,
    groupIds: ['ielts-1', 'ielts-2', 'ielts-3']
  },
  {
    id: 'gre',
    name: 'GRE 形近词',
    subtitle: '高阶词汇辨析',
    count: 3,
    groupIds: ['gre-1', 'gre-2', 'gre-3']
  }
];

const allBookGroups = [...starterGroups, ...hongbaoshuWordGroups, ...hongbaoshuGroups, ...bookOnlyGroups, ...extraBookGroups];
const builtInGroupIds = new Set(allBookGroups.map((group) => group.id));

const navItems = [
  { id: 'today', label: '今日', icon: Home },
  { id: 'library', label: '词库', icon: Library },
  { id: 'review', label: '复习', icon: RotateCcw },
  { id: 'stats', label: '统计', icon: BarChart3 },
  { id: 'settings', label: '我的', icon: Settings }
];

const defaultProfile = {
  name: 'Guest Learner',
  email: 'guest@lexipair.local',
  plan: 'Local First',
  sync: 'synced',
  lastSync: '刚刚',
  streak: 12,
  devices: [
    { id: 'iphone', name: 'iPhone 26.1', iconKey: 'phone', status: '当前设备' },
    { id: 'web', name: 'Mac Web', iconKey: 'laptop', status: '已同步' }
  ]
};

const deviceIcons = {
  phone: Smartphone,
  laptop: Laptop
};

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createProfile({ email, plan }) {
  const normalized = normalizeEmail(email);
  return {
    ...defaultProfile,
    id: normalized.replace(/[^a-z0-9]/g, '-'),
    name: normalized.split('@')[0] || 'Lexi Learner',
    email: normalized,
    plan
  };
}

function accountStorageKey(email) {
  return `lexipair-account:${normalizeEmail(email)}`;
}

function readAccountData(email) {
  try {
    const stored = localStorage.getItem(accountStorageKey(email));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function writeAccountData(email, data) {
  localStorage.setItem(accountStorageKey(email), JSON.stringify(data));
}

function buildAccountSnapshot({ groups, progress, installedBooks, aiInsights, offlineEnabled, todayBook, dailyLimit }) {
  return {
    customGroups: groups.filter((group) => !builtInGroupIds.has(group.id)),
    progress,
    installedBooks,
    aiInsights,
    offlineEnabled,
    todayBook,
    dailyLimit,
    updatedAt: new Date().toISOString()
  };
}

async function pullAccountData(email) {
  const response = await fetch(`/api/sync/${encodeURIComponent(normalizeEmail(email))}`);
  if (!response.ok) throw new Error('同步拉取失败');
  const payload = await response.json();
  return payload.data || null;
}

async function pushAccountData(email, data) {
  const response = await fetch(`/api/sync/${encodeURIComponent(normalizeEmail(email))}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  });
  if (!response.ok) throw new Error('同步上传失败');
  return response.json();
}

function shouldUseRemoteAccount(remote, local) {
  if (!remote) return false;
  if (!local) return true;
  return new Date(remote.syncedAt || remote.updatedAt || 0) > new Date(local.updatedAt || 0);
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function dateKey(date) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  return value.toISOString().slice(0, 10);
}

function calculateStreak(progress) {
  const activeDays = new Set(
    Object.values(progress)
      .map((item) => item.updatedAt || item.lastReviewedAt)
      .filter(Boolean)
      .map(dateKey)
      .filter(Boolean)
  );
  let cursor = startOfToday();
  let streak = 0;
  while (activeDays.has(dateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
  }
  return streak;
}

function getWeeklyActivity(progress) {
  const today = startOfToday();
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today.getTime() - (6 - index) * 24 * 60 * 60 * 1000);
    const key = dateKey(day);
    const count = Object.values(progress).filter((item) => dateKey(item.updatedAt || item.lastReviewedAt) === key).length;
    return { key, count };
  });
}

function isDue(item) {
  if (!item?.nextDueAt) return true;
  return new Date(item.nextDueAt) <= new Date();
}

function nextSchedule(result, previous = {}) {
  const now = new Date();
  const level = previous.level || 0;
  const lapses = previous.lapses || 0;
  const intervals = [1, 2, 4, 7, 15, 30, 60];
  let nextLevel = level;
  let nextLapses = lapses;
  let minutes = 10;
  let stage = '重新巩固';

  if (result === 'forgot') {
    nextLevel = 0;
    nextLapses += 1;
    minutes = 10;
    stage = '短间隔复习';
  } else if (result === 'blurry') {
    nextLevel = Math.max(1, level);
    minutes = level <= 1 ? 60 : 24 * 60;
    stage = '明日回看';
  } else {
    nextLevel = Math.min(level + 1, intervals.length - 1);
    minutes = intervals[nextLevel] * 24 * 60;
    stage = nextLevel >= 4 ? '长期记忆' : '间隔复习';
  }

  return {
    level: nextLevel,
    lapses: nextLapses,
    stage,
    nextDueAt: new Date(now.getTime() + minutes * 60 * 1000).toISOString()
  };
}

function getBookGroups(groups, bookId) {
  if (bookId === 'all') return groups;
  const book = wordBooks.find((item) => item.id === bookId);
  if (!book) return groups;
  const ids = new Set(book.groupIds);
  return groups.filter((group) => ids.has(group.id));
}

function buildStudyQueue(groups, progress, bookId, dailyLimit = 20) {
  const bookGroups = getBookGroups(groups, bookId);
  const due = bookGroups
    .filter((group) => isDue(progress[group.id]))
    .sort((a, b) => {
      const pa = progress[a.id] || {};
      const pb = progress[b.id] || {};
      return (pb.lapses || 0) - (pa.lapses || 0) || (pa.count || 0) - (pb.count || 0);
    });
  const newItems = bookGroups.filter((group) => !progress[group.id]);
  const mixed = [...due, ...newItems.filter((group) => !due.some((item) => item.id === group.id))];
  return mixed.slice(0, dailyLimit);
}

function findSimilarWords(group, word) {
  if (group.words.length > 1) {
    return group.words.filter((item) => item.word !== word.word).slice(0, 5);
  }
  const target = word.word.toLowerCase();
  const targetRoot = target.replace(/(?:ing|ed|tion|sion|ness|ment|ance|ence|ant|ent|al|ly|er|or|s)$/i, '');
  const editDistance = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
    for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
    for (let i = 1; i <= a.length; i += 1) {
      for (let j = 1; j <= b.length; j += 1) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return dp[a.length][b.length];
  };
  const commonPrefixLength = (a, b) => {
    let count = 0;
    while (count < Math.min(a.length, b.length) && a[count] === b[count]) count += 1;
    return count;
  };
  const seen = new Set([target]);
  return allBookGroups
    .filter((candidate) => candidate.id !== group.id && candidate.words?.[0])
    .map((candidate) => {
      const candidateWord = candidate.words[0].word.toLowerCase();
      const candidateRoot = candidateWord.replace(/(?:ing|ed|tion|sion|ness|ment|ance|ence|ant|ent|al|ly|er|or|s)$/i, '');
      const prefix = commonPrefixLength(target, candidateWord);
      const rootPrefix = commonPrefixLength(targetRoot, candidateRoot);
      const distance = editDistance(target, candidateWord);
      const normalizedDistance = distance / Math.max(target.length, candidateWord.length);
      const lengthGap = Math.abs(target.length - candidateWord.length);
      const sameFirst = target[0] === candidateWord[0];
      const score = prefix * 3 + rootPrefix * 2 - normalizedDistance * 10 - lengthGap * 0.4 + (sameFirst ? 1 : 0);
      return { candidate, candidateWord, prefix, rootPrefix, normalizedDistance, lengthGap, score };
    })
    .filter(({ candidateWord, prefix, rootPrefix, normalizedDistance, lengthGap }) => (
      candidateWord !== target
      && lengthGap <= 5
      && (
        normalizedDistance <= 0.42
        || prefix >= 4
        || rootPrefix >= 4
      )
    ))
    .sort((a, b) => b.score - a.score)
    .filter(({ candidateWord }) => {
      if (seen.has(candidateWord)) return false;
      seen.add(candidateWord);
      return true;
    })
    .slice(0, 5)
    .map(({ candidate }) => candidate.words[0]);
}

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to persist ${key}`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

function splitDiff(word, groupWords) {
  const max = Math.max(...groupWords.map((item) => item.length));
  return word.split('').map((letter, index) => {
    const variants = new Set(groupWords.map((item) => item[index] || ''));
    const isDifferent = variants.size > 1 && index < max;
    return { letter, isDifferent };
  });
}

function DifferenceWord({ word, peers, size = 'large' }) {
  return (
    <span className={`difference-word ${size}`}>
      {splitDiff(word, peers).map((part, index) => (
        <span className={part.isDifferent ? 'letter-highlight' : ''} key={`${part.letter}-${index}`}>
          {part.letter}
        </span>
      ))}
    </span>
  );
}

function createAiInsight(group) {
  const words = group.words.map((item) => item.word);
  const meanings = group.words.map((item) => `${item.word}: ${item.meaning}`).join('；');
  const comparisons = group.words.length === 1 ? findSimilarWords(group, group.words[0]) : [];
  const comparisonText = comparisons.map((item) => `${item.word}: ${item.meaning}`).join('；');
  const pairKey = words.join(' / ');
  const peers = words.join('、');
  const firstLetters = words.map((word) => word[0]).join('/');
  const endings = words.map((word) => word.slice(-3)).join('/');
  const isSingleWord = group.words.length === 1;
  const focus = group.type.includes('红宝书单词') ? '先回忆核心中文，再检查词性和派生义' : `优先区分 ${peers} 的词性、固定搭配和语义场景`;
  return {
    summary: isSingleWord
      ? `${pairKey} 的记忆重点是：${group.words[0].meaning}。建议先遮住释义主动回忆，再看词性和例句校准。${comparisonText ? `可顺手对比：${comparisonText}` : ''}`
      : `${pairKey} 的混淆点在于 ${group.type}。这一组的首字母/尾部特征是 ${firstLetters} / ${endings}，学习时要把拼写差异和使用场景绑定。`,
    mnemonic: isSingleWord
      ? `${group.words[0].word}：${group.words[0].hint || group.words[0].meaning}`
      : group.words.map((item) => `${item.word} -> ${item.hint}`).join('；'),
    contrast: isSingleWord ? `${group.words[0].word}: ${group.words[0].meaning}${comparisonText ? `；相近词：${comparisonText}` : ''}` : meanings,
    examples: group.words.map((item) => item.sentence),
    quiz: isSingleWord
      ? `看到 ${group.words[0].word} 时，先说出主要释义，再补充词性：${group.words[0].pos}。`
      : `做题时先判断词性和搭配：${focus}。如果出现 ${group.words[0].collocation}，优先联想 ${group.words[0].word}。`,
    generatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };
}

function resultLabel(result) {
  return result === 'know' ? '认识' : result === 'blurry' ? '模糊' : '不认识';
}

function SyncBadge({ status = 'synced', lastSync = '刚刚' }) {
  const Icon = status === 'offline' ? WifiOff : status === 'failed' ? CloudOff : status === 'syncing' ? Loader2 : Cloud;
  const label = status === 'offline' ? '离线' : status === 'failed' ? '同步失败' : status === 'syncing' ? '同步中' : '已同步';
  return (
    <div className={`sync-badge ${status}`}>
      <Icon size={15} className={status === 'syncing' ? 'spin' : ''} />
      <span>{label}</span>
      <small>{lastSync}</small>
      <i />
    </div>
  );
}

function ProgressRing({ remaining, total, label = '组待学' }) {
  const progress = total ? Math.round(((total - remaining) / total) * 100) : 0;
  return (
    <div className="progress-ring" aria-label="今日学习进度">
      <svg viewBox="0 0 120 120">
        <circle className="track" cx="60" cy="60" r="51" />
        <circle className="value" cx="60" cy="60" r="51" pathLength="100" style={{ strokeDasharray: `${Math.max(8, progress)} 100` }} />
      </svg>
      <div>
        <strong>{remaining}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (mode) => {
    const normalized = normalizeEmail(email);
    if (mode === 'email' && !isValidEmail(normalized)) {
      setError('请输入有效邮箱，例如 name@example.com');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 260));
      const loginEmail = mode === 'guest' ? 'guest@lexipair.local' : mode === 'apple' ? 'apple@lexipair.local' : normalized;
      const plan = mode === 'apple' ? 'Apple ID' : mode === 'email' ? 'Email Sync' : 'Local First';
      await onLogin(createProfile({ email: loginEmail, plan }));
    } catch (loginError) {
      setError(loginError.message || '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand-mark">LP</div>
        <p className="eyebrow">LexiPair</p>
        <h1>在对比中记住易混词</h1>
        <p>登录后同步学习进度、错题、收藏、AI 结果和个人词库。Web 与 iOS 使用同一套后端账号数据。</p>
        <div className="login-actions">
          <button className="apple-button" onClick={() => submit('apple')} disabled={loading}>
            <Apple size={19} /> 使用 Apple 登录
          </button>
          <label className="email-field">
            <Mail size={18} />
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="邮箱地址" type="email" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" onClick={() => submit('email')} disabled={loading}>
            {loading ? '正在进入...' : '邮箱登录'}
          </button>
          <button className="ghost-button" onClick={() => submit('guest')} disabled={loading}>
            游客体验
          </button>
        </div>
      </section>
    </main>
  );
}

function GroupCard({ group, onOpen, meta }) {
  return (
    <button className="group-card" onClick={() => onOpen(group)}>
      <div className="card-topline">
        <span>{group.type}</span>
        {meta?.favorite && <Star size={16} fill="currentColor" />}
      </div>
      <strong>{group.title}</strong>
      <p>{group.words[0].misuse}</p>
      <div className="tag-row">
        {group.tags.map((tag) => <em key={tag}>{tag}</em>)}
      </div>
    </button>
  );
}

function TodayView({ groups, profile, progress, todayBook, setTodayBook, dailyLimit, setDailyLimit, onStartQueue, onOpenGroup }) {
  const todayQueue = buildStudyQueue(groups, progress, todayBook, dailyLimit);
  const bookGroups = getBookGroups(groups, todayBook);
  const dueCount = bookGroups.filter((group) => isDue(progress[group.id])).length;
  const newCount = bookGroups.filter((group) => !progress[group.id]).length;
  const masteredCount = bookGroups.filter((group) => (progress[group.id]?.level || 0) >= 4).length;
  const previewGroups = todayQueue.length ? todayQueue.slice(0, 12) : groups
    .filter((group) => progress[group.id]?.lastResult === 'forgot' || progress[group.id]?.favorite || group.source !== '考研英语红宝书')
    .slice(0, 12);
  const remaining = Math.max(1, todayQueue.length);
  const reviewed = Object.values(progress).reduce((sum, item) => sum + item.count, 0);
  const currentBook = wordBooks.find((book) => book.id === todayBook);

  return (
    <section className="page today-page">
      <header className="mobile-header">
        <div>
          <p className="eyebrow">LexiPair</p>
          <h1>Today</h1>
        </div>
        <SyncBadge status={profile.sync} lastSync={profile.lastSync} />
      </header>

      <div className="hero-panel">
        <ProgressRing remaining={remaining} total={dailyLimit} />
        <div className="hero-copy">
          <p>今日专注 · {currentBook?.name || '全部词组'}</p>
          <h2>按间隔记忆法安排今天要背的词</h2>
          <span>今日 {todayQueue.length} 张卡片 · 到期 {dueCount} · 新词 {newCount} · 长期记忆 {masteredCount}</span>
        </div>
        <button className="primary-button" onClick={() => onStartQueue(todayQueue)}>
          开始今日学习
        </button>
      </div>

      <div className="study-plan-panel">
        <div className="section-title compact">
          <h3>选择词书</h3>
          <button>{bookGroups.length} 张卡片</button>
        </div>
        <div className="book-select-row">
          {wordBooks.map((book) => (
            <button className={todayBook === book.id ? 'active' : ''} key={book.id} onClick={() => setTodayBook(book.id)}>
              <strong>{book.name}</strong>
              <span>{book.count} 词</span>
            </button>
          ))}
        </div>
        <div className="daily-limit-row">
          <span>每日新学/复习量</span>
          <div>
            {[10, 20, 50, 100].map((amount) => (
              <button className={dailyLimit === amount ? 'active' : ''} key={amount} onClick={() => setDailyLimit(amount)}>{amount}</button>
            ))}
          </div>
        </div>
        <div className="memory-method">
          <article><strong>不认识</strong><span>10 分钟后回炉</span></article>
          <article><strong>模糊</strong><span>1 小时或明日复习</span></article>
          <article><strong>认识</strong><span>1/2/4/7/15/30 天递增</span></article>
        </div>
      </div>

      <div className="section-title">
        <h3>今日队列</h3>
        <button onClick={() => onOpenGroup(groups[0])}>查看详情</button>
      </div>
      <div className="group-list">
        {previewGroups.map((group) => (
          <GroupCard key={group.id} group={group} onOpen={onOpenGroup} meta={progress[group.id]} />
        ))}
      </div>
    </section>
  );
}

function StudyCard({ group, currentWord, flipped, setFlipped, onResult }) {
  const peers = group.words.map((item) => item.word);
  const [dragLabel, setDragLabel] = useState('');

  const handleDrag = (_, info) => {
    const { x, y } = info.offset;
    if (x > 80) setDragLabel('认识');
    else if (x < -80) setDragLabel('不认识');
    else if (y > 80) setDragLabel('模糊');
    else setDragLabel('');
  };

  const handleDragEnd = (_, info) => {
    const { x, y } = info.offset;
    setDragLabel('');
    if (x > 110) onResult('know');
    else if (x < -110) onResult('forgot');
    else if (y > 110) onResult('blurry');
  };

  return (
    <div className="study-card-shell">
      <AnimatePresence>
        {dragLabel && (
          <motion.div className="drag-label" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {dragLabel}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="study-card"
        onClick={() => setFlipped(!flipped)}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.16}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.985 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 22 }}
      >
        <div className="card-face card-front">
          <span className="group-pill">{group.level}</span>
          <DifferenceWord word={currentWord.word} peers={peers} />
          <p className="phonetic">{currentWord.phonetic}</p>
          <div className="audio-row">
            <span>{currentWord.pos}</span>
            <Volume2 size={19} />
          </div>
          <small>轻点翻面 · 左右滑动标记</small>
        </div>
        <div className="card-face card-back">
          <span className="group-pill">易混解释</span>
          <h2>{currentWord.meaning}</h2>
          <p>{currentWord.sentence}</p>
          <div className="ai-tip">
            <Sparkles size={17} />
            <span>{currentWord.hint}</span>
          </div>
          <small>{currentWord.collocation}</small>
        </div>
      </motion.button>
    </div>
  );
}

function StudyView({ group, queue = [], queueIndex = 0, meta, onBack, onOpenCompare, onMark, onNextQueueItem, onToggleFavorite, onSaveNote }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [note, setNote] = useState(meta?.note || '');
  const currentWord = group.words[index % group.words.length];
  const progress = queue.length > 1 ? ((queueIndex + 1) / queue.length) * 100 : ((index + 1) / group.words.length) * 100;
  const feedbackComparisons = feedback ? findSimilarWords(group, feedback.word) : [];

  useEffect(() => {
    const handler = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setFlipped((value) => !value);
      }
      if (event.key === '1') choose('forgot');
      if (event.key === '2') choose('blurry');
      if (event.key === '3') choose('know');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const choose = (result) => {
    onMark(group.id, result, currentWord.word);
    setFlipped(true);
    setFeedback({ result, word: currentWord });
  };

  const continueNext = () => {
    setFlipped(false);
    setFeedback(null);
    if (index + 1 < group.words.length) {
      setIndex((value) => value + 1);
    } else if (queue.length > 1) {
      setIndex(0);
      onNextQueueItem();
    } else {
      setIndex(0);
    }
  };

  return (
    <section className="study-page">
      <div className="study-progress">
        <span style={{ width: `${progress}%` }} />
      </div>
      <header className="study-header">
        <button className="icon-button" onClick={onBack} aria-label="返回">
          <X size={20} />
        </button>
        <button className="group-title" onClick={onOpenCompare}>
          {queue.length > 1 ? `${queueIndex + 1}/${queue.length} · ` : ''}{group.title}
        </button>
        <button className={`icon-button ${meta?.favorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(group.id)} aria-label="收藏">
          <Star size={19} fill={meta?.favorite ? 'currentColor' : 'none'} />
        </button>
      </header>

      <StudyCard group={group} currentWord={currentWord} flipped={flipped} setFlipped={setFlipped} onResult={choose} />

      {feedback?.result === 'know' && (
        <div className="inline-answer">
          <strong>{feedback.word.word}</strong>
          <span>{feedback.word.meaning}</span>
          <button onClick={continueNext}>继续</button>
        </div>
      )}

      {feedback && feedback.result !== 'know' && (
        <div className={`feedback-card ${feedback.result}`}>
          <div className="section-title compact">
            <h3>{resultLabel(feedback.result)} · 正确答案</h3>
            <button onClick={continueNext}>继续</button>
          </div>
          <strong>{feedback.word.word}</strong>
          <p>{feedback.word.meaning}</p>
          <div className="mistake-box">
            <strong>记忆提示</strong>
            <span>{feedback.word.hint}</span>
          </div>
          {feedbackComparisons.length > 0 && (
            <div className="mini-compare">
              {feedbackComparisons.map((item) => (
                <article key={item.word}>
                  <strong>{item.word}</strong>
                  <span>{item.meaning}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="utility-row">
        <button><Headphones size={17} /> 发音</button>
        <button onClick={() => setShowNote(true)}><NotebookPen size={17} /> 笔记</button>
        <button onClick={onOpenCompare}><BookOpen size={17} /> 对比</button>
      </div>

      <div className="review-actions">
        <button className="danger" onClick={() => choose('forgot')} disabled={!!feedback}>不认识</button>
        <button className="warn" onClick={() => choose('blurry')} disabled={!!feedback}>模糊</button>
        <button className="success" onClick={() => choose('know')} disabled={!!feedback}>认识</button>
      </div>

      {showNote && (
        <div className="modal-backdrop">
          <div className="note-modal">
            <h2>学习笔记</h2>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="写下你自己的区分方法..." />
            <div>
              <button className="ghost-button" onClick={() => setShowNote(false)}>取消</button>
              <button className="primary-button" onClick={() => { onSaveNote(group.id, note); setShowNote(false); }}>保存</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CompareView({ group, aiInsight, aiLoading, onBack, onContinue, onStart, onGenerateAi }) {
  const peers = group.words.map((item) => item.word);
  const insight = aiInsight || createAiInsight(group);
  const aiConnected = ['openai', 'mimo'].includes(insight.provider);
  const comparisonWords = group.words.length === 1 ? findSimilarWords(group, group.words[0]) : [];
  const autoGenerateAttempted = useRef(false);

  useEffect(() => {
    autoGenerateAttempted.current = false;
  }, [group.id]);

  useEffect(() => {
    if (autoGenerateAttempted.current || aiLoading || aiConnected) return;
    autoGenerateAttempted.current = true;
    onGenerateAi(group);
  }, [aiConnected, aiLoading, group, onGenerateAi]);

  return (
    <section className="page compare-page">
      <header className="compare-header">
        <button className="icon-button" onClick={onBack} aria-label="返回">
          <ChevronLeft size={22} />
        </button>
        <div>
          <p className="eyebrow">{group.type}</p>
          <h1>{group.title}</h1>
        </div>
      </header>

      <div className="comparison-hero">
        {group.words.map((item) => (
          <DifferenceWord key={item.word} word={item.word} peers={peers} size="medium" />
        ))}
      </div>

      <div className="comparison-grid">
        {group.words.map((item) => (
          <article className="word-detail-card" key={item.word}>
            <div>
              <DifferenceWord word={item.word} peers={peers} size="small" />
              <span className="phonetic-inline">{item.phonetic}</span>
            </div>
            <h2>{item.meaning}</h2>
            <p>{item.sentence}</p>
            <div className="mistake-box">
              <strong>常见误用</strong>
              <span>{item.misuse}</span>
            </div>
          </article>
        ))}
      </div>

      {comparisonWords.length > 0 && (
        <section className="comparison-suggestions">
          <div className="section-title compact">
            <h3>形近 / 同页对比</h3>
            <span>自动从红宝书里找相近词</span>
          </div>
          <div className="mini-compare expanded">
            {comparisonWords.map((item) => (
              <article key={item.word}>
                <strong>{item.word}</strong>
                <span>{item.meaning}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="ai-panel ai-assistant-panel">
        <Sparkles size={18} />
        <div>
          <div className="section-title compact">
            <h3>{aiConnected ? 'AI 辅助记忆' : '辅助记忆'}</h3>
            <button onClick={() => onGenerateAi(group)} disabled={aiLoading}>
              {aiLoading ? '生成中...' : aiInsight ? '重新生成' : '生成辅助'}
            </button>
          </div>
          <div className={`local-ai-notice ${aiConnected ? 'connected' : ''}`}>
            <strong>{aiConnected ? `${insight.provider === 'mimo' ? 'Mimo' : 'OpenAI'} 已连接 · ${insight.model}` : 'AI 接口未返回真实结果'}</strong>
            <span>
              {aiConnected
                ? '当前内容由后端 /api/ai/insight 生成，密钥只保存在服务端。'
                : aiLoading
                  ? '正在生成对比、口诀和小测提示，完成后会自动缓存，下次打开直接显示。'
                  : '当前显示本地 fallback。配置 AI Key 并启动 API 服务后，会生成更具体的个性化解释。'}
            </span>
          </div>
          <p>{insight.summary}</p>
          <div className="ai-result-grid">
            <article>
              <strong>记忆口诀</strong>
              <span>{insight.mnemonic}</span>
            </article>
            <article>
              <strong>差异总结</strong>
              <span>{insight.contrast}</span>
            </article>
            <article>
              <strong>小测提示</strong>
              <span>{insight.quiz}</span>
            </article>
          </div>
          <small>生成时间：{insight.generatedAt} · {insight.provider || 'local'}</small>
          {insight.error && <small className="ai-error">接口提示：{insight.error}</small>}
        </div>
      </div>
      <div className="sticky-actions">
        <button className="ghost-button" onClick={() => onStart(group)}>加入今日复习</button>
        <button className="primary-button" onClick={onContinue}>继续学习</button>
      </div>
    </section>
  );
}

function LibraryView({ groups, progress, installedBooks, activeBook, setActiveBook, onInstallBook, onOpenGroup, onCreateGroup }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('全部');
  const tags = ['全部', '考研', '六级', '雅思', 'GRE', '写作', '阅读', '形近词', '收藏', '错题'];
  const filtered = groups.filter((group) => {
    const haystack = `${group.title} ${group.type} ${group.tags.join(' ')}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const matchesBook = activeBook === 'all' || wordBooks.find((book) => book.id === activeBook)?.groupIds.includes(group.id);
    const matchesFilter =
      filter === '全部' ||
      group.tags.includes(filter) ||
      (filter === '收藏' && progress[group.id]?.favorite) ||
      (filter === '错题' && progress[group.id]?.lastResult === 'forgot');
    return matchesQuery && matchesBook && matchesFilter;
  });

  return (
    <section className="page library-page">
      <header className="mobile-header">
        <div>
          <p className="eyebrow">Vocabulary</p>
          <h1>词库</h1>
        </div>
        <button className="icon-button" onClick={onCreateGroup}><Plus size={20} /></button>
      </header>
      <label className="search-box">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 adapt、形近词、考研..." />
      </label>
      <div className="book-shelf">
        <div className="section-title compact">
          <h3>词书</h3>
          <button onClick={() => setActiveBook('all')}>全部词组</button>
        </div>
        <div className="book-row">
          {wordBooks.map((book) => {
            const installed = installedBooks.includes(book.id);
            return (
              <article className={activeBook === book.id ? 'book-card active' : 'book-card'} key={book.id}>
                <button onClick={() => installed && setActiveBook(book.id)}>
                  <strong>{book.name}</strong>
                  <span>{book.subtitle}</span>
                  <em>{book.count} 组易混词</em>
                </button>
                <button className="book-action" onClick={() => installed ? setActiveBook(book.id) : onInstallBook(book)}>
                  {installed ? '学习' : '安装'}
                </button>
              </article>
            );
          })}
        </div>
      </div>
      <div className="filter-row">
        {tags.map((tag) => (
          <button className={filter === tag ? 'active' : ''} key={tag} onClick={() => setFilter(tag)}>{tag}</button>
        ))}
      </div>
      <div className="library-grid">
        {filtered.map((group) => <GroupCard key={group.id} group={group} onOpen={onOpenGroup} meta={progress[group.id]} />)}
      </div>
      {!filtered.length && <EmptyState title="没有找到词组" body="换个关键词，或者新建一组自己的易混词。" />}
    </section>
  );
}

function ReviewView({ groups, progress, onStart, onOpenGroup }) {
  const due = groups
    .filter((group) => progress[group.id]?.lastResult !== 'know')
    .sort((a, b) => (progress[b.id]?.count || 0) - (progress[a.id]?.count || 0));

  return (
    <section className="page review-page">
      <header className="mobile-header">
        <div>
          <p className="eyebrow">Review</p>
          <h1>复习计划</h1>
        </div>
        <ProgressRing remaining={due.length || 1} total={groups.length} label="组待复习" />
      </header>
      <div className="summary-grid">
        <div className="stat-card"><span>今日待复习</span><strong>{due.length}</strong></div>
        <div className="stat-card"><span>错题回流</span><strong>{groups.filter((group) => progress[group.id]?.lastResult === 'forgot').length}</strong></div>
      </div>
      <button className="primary-button wide" onClick={() => onStart(due[0] || groups[0])}>开始复习队列</button>
      <div className="group-list">
        {due.map((group) => (
          <button className="review-item" key={group.id} onClick={() => onOpenGroup(group)}>
            <div>
              <strong>{group.title}</strong>
              <span>上次：{progress[group.id]?.lastResult === 'forgot' ? '不认识' : '模糊'} · {progress[group.id]?.count || 0} 次记录</span>
            </div>
            <ChevronLeft size={18} />
          </button>
        ))}
      </div>
    </section>
  );
}

function StatsView({ groups, progress, profile }) {
  const totalMarks = Object.values(progress).reduce((sum, item) => sum + item.count, 0);
  const mastered = groups.filter((group) => progress[group.id]?.lastResult === 'know').length;
  const accuracy = groups.length ? Math.round((mastered / groups.length) * 100) : 0;
  const streak = calculateStreak(progress);
  const weekly = getWeeklyActivity(progress);
  const weeklyMax = Math.max(1, ...weekly.map((day) => day.count));
  const topConfused = groups
    .map((group) => ({ group, score: progress[group.id]?.forgot || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <section className="page stats-page">
      <header className="mobile-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>统计</h1>
        </div>
        <SyncBadge status={profile.sync} lastSync={profile.lastSync} />
      </header>
      <div className="summary-grid">
        <div className="stat-card"><span>掌握率</span><strong>{accuracy}%</strong></div>
        <div className="stat-card"><span>累计标记</span><strong>{totalMarks}</strong></div>
        <div className="stat-card"><span>连续学习</span><strong>{streak} 天</strong></div>
        <div className="stat-card"><span>已掌握</span><strong>{mastered}/{groups.length}</strong></div>
      </div>
      <div className="chart-card">
        <div className="section-title"><h3>近七日完成率</h3><button>周视图</button></div>
        <div className="bar-chart">
          {weekly.map((day) => <i key={day.key} title={`${day.key}: ${day.count}`} style={{ height: `${Math.max(8, Math.round((day.count / weeklyMax) * 100))}%` }} />)}
        </div>
      </div>
      <div className="chart-card">
        <div className="section-title"><h3>Top 易混词组</h3></div>
        {topConfused.map(({ group, score }) => (
          <div className="rank-row" key={group.id}>
            <span>{group.title}</span>
            <strong>{score || 1} 次</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function SettingsView({ profile, setProfile, groups, progress, installedBooks, aiInsights, offlineEnabled, setOfflineEnabled, onImportGroups, onLogout }) {
  const [dialog, setDialog] = useState(null);
  const [importText, setImportText] = useState('');
  const [importMessage, setImportMessage] = useState('');

  const cycleSync = () => {
    const next = profile.sync === 'synced' ? 'syncing' : profile.sync === 'syncing' ? 'offline' : profile.sync === 'offline' ? 'failed' : 'synced';
    setProfile({ ...profile, sync: next, lastSync: next === 'synced' ? '刚刚' : '待处理' });
  };

  const exportData = () => {
    const payload = {
      profile,
      groups,
      progress,
      installedBooks,
      aiInsights,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lexipair-${profile.email.replace(/[^a-z0-9]/gi, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setDialog('exported');
  };

  const parseImport = () => {
    try {
      const trimmed = importText.trim();
      if (!trimmed) {
        setImportMessage('请粘贴 JSON 或 CSV 内容。');
        return;
      }
      let imported;
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const parsed = JSON.parse(trimmed);
        imported = Array.isArray(parsed) ? parsed : parsed.groups;
      } else {
        imported = trimmed.split('\n').slice(1).map((line, index) => {
          const [title, type = '导入词组', hint = '导入的易混词组'] = line.split(',').map((item) => item?.trim());
          const words = title?.split('/').map((word) => word.trim()).filter(Boolean) || [];
          return {
            id: `import-${Date.now()}-${index}`,
            title,
            type,
            level: '导入词库',
            source: '用户导入',
            tags: ['导入', '形近词'],
            words: words.map((word) => ({
              word,
              phonetic: '/.../',
              pos: 'word',
              meaning: hint,
              hint,
              collocation: 'imported',
              sentence: `Add an example sentence for ${word}.`,
              misuse: hint
            }))
          };
        });
      }
      const valid = (imported || []).filter((group) => group?.title && Array.isArray(group.words) && group.words.length >= 2);
      if (!valid.length) {
        setImportMessage('没有识别到有效词组。JSON 需要包含 groups，CSV 表头建议为 title,type,hint。');
        return;
      }
      onImportGroups(valid);
      setImportMessage(`已导入 ${valid.length} 组词。`);
      setImportText('');
    } catch (error) {
      setImportMessage(`导入失败：${error.message}`);
    }
  };

  return (
    <section className="page settings-page">
      <header className="mobile-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>我的</h1>
        </div>
        <button className="icon-button"><Moon size={20} /></button>
      </header>
      <div className="profile-card">
        <div className="avatar">{profile.name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>
      </div>
      <div className="settings-list">
        <button onClick={cycleSync}>
          <div><Cloud size={18} /><span>云同步状态</span></div>
          <SyncBadge status={profile.sync} lastSync={profile.lastSync} />
        </button>
        <button onClick={() => setDialog('ai')}><div><Sparkles size={18} /><span>AI 辅助</span></div><small>本地生成 · 可接后端</small></button>
        <button onClick={() => setDialog('import')}><div><Upload size={18} /><span>导入词库</span></div><small>CSV / JSON</small></button>
        <button onClick={exportData}><div><Download size={18} /><span>导出数据</span></div><small>本地备份</small></button>
        <button onClick={() => setOfflineEnabled(!offlineEnabled)}>
          <div><ArrowDownToLine size={18} /><span>离线学习缓存</span></div>
          <small>{offlineEnabled ? '已开启' : '已关闭'}</small>
        </button>
      </div>
      <div className="chart-card">
        <div className="section-title"><h3>登录设备</h3></div>
        {(profile.devices || defaultProfile.devices).map((device) => {
          const Icon = deviceIcons[device.iconKey] || (device.id === 'web' ? Laptop : Smartphone);
          return (
            <div className="device-row" key={device.id}>
              <Icon size={19} />
              <span>{device.name}</span>
              <em>{device.status}</em>
            </div>
          );
        })}
      </div>
      <button className="ghost-button wide" onClick={onLogout}>退出登录</button>

      {dialog && (
        <div className="modal-backdrop">
          <div className="note-modal">
            {dialog === 'ai' && (
              <>
                <h2>AI 辅助</h2>
                <p>当前版本使用本地生成器，能在词组对比页生成记忆口诀、差异总结和小测提示。生产环境建议接 Supabase Edge Function 或自有后端，避免在前端暴露模型密钥。</p>
                <div className="modal-info-grid">
                  <span>状态</span><strong>本地可用</strong>
                  <span>后端</span><strong>预留接口</strong>
                  <span>已生成</span><strong>{Object.keys(aiInsights).length} 组</strong>
                </div>
              </>
            )}
            {dialog === 'import' && (
              <>
                <h2>导入词库</h2>
                <p>支持 JSON 或 CSV。CSV 格式：第一行 `title,type,hint`，后续如 `loose / lose,拼写形近,loose 是松的，lose 是失去`。</p>
                <textarea value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="title,type,hint&#10;loose / lose,拼写形近,loose 是松的，lose 是失去" />
                {importMessage && <p className="form-error neutral">{importMessage}</p>}
              </>
            )}
            {dialog === 'exported' && (
              <>
                <h2>已导出</h2>
                <p>当前账号的词库、学习记录、收藏、AI 结果已经导出为 JSON 文件。</p>
              </>
            )}
            <div>
              <button className="ghost-button" onClick={() => setDialog(null)}>关闭</button>
              {dialog === 'import' && <button className="primary-button" onClick={parseImport}>导入</button>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="empty-state">
      <Sparkles size={24} />
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function CreateGroupModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [meaning, setMeaning] = useState('');
  return (
    <div className="modal-backdrop">
      <div className="note-modal">
        <h2>新建易混词组</h2>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如: loose / lose" />
        <textarea value={meaning} onChange={(event) => setMeaning(event.target.value)} placeholder="写一句区分提示..." />
        <div>
          <button className="ghost-button" onClick={onClose}>取消</button>
          <button
            className="primary-button"
            onClick={() => {
              if (!title.trim()) return;
              const words = title.split('/').map((item) => item.trim()).filter(Boolean);
              onCreate({
                id: `custom-${Date.now()}`,
                title,
                type: '自建词组',
                level: '我的词库',
                source: '用户创建',
                tags: ['自建', '形近词'],
                words: words.map((word) => ({
                  word,
                  phonetic: '/.../',
                  pos: 'word',
                  meaning: meaning || '待补充释义',
                  hint: meaning || '添加你自己的记忆提示。',
                  collocation: 'custom note',
                  sentence: `Add an example sentence for ${word}.`,
                  misuse: meaning || '这是一组你自己添加的易混词。'
                }))
              });
            }}
          >
            创建
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div>LP</div>
        <strong>LexiPair</strong>
      </div>
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button className={active === item.id ? 'active' : ''} key={item.id} onClick={() => setActive(item.id)}>
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function RightPanel({ profile, groups, progress, onOpenGroup, onStartQueue, onSyncNow, onGoTab }) {
  const [query, setQuery] = useState('');
  const mastered = groups.filter((group) => progress[group.id]?.lastResult === 'know').length;
  const streak = calculateStreak(progress);
  const dueQueue = buildStudyQueue(groups, progress, 'hongbaoshu', 12);
  const dueCount = groups.filter((group) => isDue(progress[group.id])).length;
  const reviewed = Object.values(progress).reduce((sum, item) => sum + (item.count || 0), 0);
  const searchResults = query.trim()
    ? groups
      .filter((group) => {
        const text = `${group.title} ${group.type} ${group.words.map((word) => `${word.word} ${word.meaning}`).join(' ')}`.toLowerCase();
        return text.includes(query.trim().toLowerCase());
      })
      .slice(0, 5)
    : [];

  return (
    <aside className="right-panel">
      <button className="sync-action" onClick={onSyncNow}>
        <SyncBadge status={profile.sync} lastSync={profile.lastSync} />
      </button>
      <button className="stat-card interactive" onClick={() => onGoTab('stats')}>
        <span>连续学习</span><strong>{streak} 天</strong>
      </button>
      <button className="stat-card interactive" onClick={() => onGoTab('stats')}>
        <span>掌握率</span><strong>{Math.round((mastered / groups.length) * 100)}%</strong>
      </button>
      <button className="stat-card interactive" onClick={() => onStartQueue(dueQueue)}>
        <span>待复习</span><strong>{dueCount}</strong>
      </button>
      <label className="quick-search">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索易混词组" />
      </label>
      {searchResults.length > 0 && (
        <div className="right-search-results">
          {searchResults.map((group) => (
            <button key={group.id} onClick={() => onOpenGroup(group)}>
              <strong>{group.title}</strong>
              <span>{group.words[0]?.meaning}</span>
            </button>
          ))}
        </div>
      )}
      <div className="right-actions">
        <button onClick={() => onGoTab('library')}><Library size={17} /> 词库</button>
        <button onClick={() => onGoTab('review')}><RotateCcw size={17} /> 复习</button>
      </div>
      <div className="tip-card"><Mic2 size={18} /><p>已学习 {reviewed} 次。Web 端支持快捷键：Space 翻面，1/2/3 标记掌握程度。</p></div>
    </aside>
  );
}

function MobileTabBar({ active, setActive }) {
  return (
    <nav className="mobile-tabbar">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button className={active === item.id ? 'active' : ''} key={item.id} onClick={() => setActive(item.id)}>
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function App() {
  const [profile, setProfile] = useStoredState('lexipair-profile', null);
  const [groups, setGroups] = useState(allBookGroups);
  const [progress, setProgress] = useStoredState('lexipair-progress', {});
  const [installedBooks, setInstalledBooks] = useStoredState('lexipair-installed-books', ['kaoyan', 'hongbaoshu']);
  const [aiInsights, setAiInsights] = useStoredState('lexipair-ai-insights', {});
  const [offlineEnabled, setOfflineEnabled] = useStoredState('lexipair-offline-enabled', true);
  const [todayBook, setTodayBook] = useStoredState('lexipair-today-book', 'hongbaoshu');
  const [dailyLimit, setDailyLimit] = useStoredState('lexipair-daily-limit', 20);
  const [active, setActive] = useState('today');
  const [activeBook, setActiveBook] = useState('all');
  const [mode, setMode] = useState('home');
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [studyQueue, setStudyQueue] = useState([]);
  const [studyQueueIndex, setStudyQueueIndex] = useState(0);
  const [compareFromStudy, setCompareFromStudy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const syncTimer = useRef(null);
  const lastPushedSnapshot = useRef('');

  useEffect(() => {
    if (!profile?.email) return;
    const snapshot = buildAccountSnapshot({
      groups,
      progress,
      installedBooks,
      aiInsights,
      offlineEnabled,
      todayBook,
      dailyLimit
    });
    writeAccountData(profile.email, snapshot);
    if (profile.email.endsWith('@lexipair.local')) return;
    const serialized = JSON.stringify(snapshot);
    if (serialized === lastPushedSnapshot.current) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    setProfile((current) => current?.email === profile.email ? { ...current, sync: 'syncing', lastSync: '同步中' } : current);
    syncTimer.current = setTimeout(async () => {
      try {
        await pushAccountData(profile.email, snapshot);
        lastPushedSnapshot.current = serialized;
        setProfile((current) => current?.email === profile.email ? { ...current, sync: 'synced', lastSync: '刚刚' } : current);
      } catch {
        setProfile((current) => current?.email === profile.email ? { ...current, sync: 'failed', lastSync: '待重试' } : current);
      }
    }, 900);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [aiInsights, dailyLimit, groups, installedBooks, offlineEnabled, profile?.email, progress, todayBook]);

  const applyAccountData = (accountData, nextProfile) => {
    const customGroups = accountData?.customGroups || accountData?.groups?.filter((group) => !builtInGroupIds.has(group.id)) || [];
    const migratedGroups = [...allBookGroups, ...customGroups];
    setGroups(migratedGroups);
    setProgress(accountData?.progress || {});
    const nextBooks = accountData?.installedBooks || ['kaoyan', 'hongbaoshu'];
    setInstalledBooks(nextBooks.includes('hongbaoshu') ? nextBooks : [...nextBooks, 'hongbaoshu']);
    setAiInsights(accountData?.aiInsights || {});
    setOfflineEnabled(accountData?.offlineEnabled ?? true);
    setTodayBook(accountData?.todayBook || 'hongbaoshu');
    setDailyLimit(accountData?.dailyLimit || 20);
    setSelectedGroup(migratedGroups[0]);
    setActiveBook('all');
    setMode('home');
    setActive('today');
    setProfile(nextProfile);
  };

  const handleLogin = async (nextProfile) => {
    const localData = readAccountData(nextProfile.email);
    let accountData = localData;
    let syncState = { sync: nextProfile.email.endsWith('@lexipair.local') ? 'offline' : 'syncing', lastSync: nextProfile.email.endsWith('@lexipair.local') ? '仅本机' : '同步中' };
    if (!nextProfile.email.endsWith('@lexipair.local')) {
      try {
        const remoteData = await pullAccountData(nextProfile.email);
        accountData = shouldUseRemoteAccount(remoteData, localData) ? remoteData : localData;
        if (!remoteData && localData) await pushAccountData(nextProfile.email, localData);
        syncState = { sync: 'synced', lastSync: remoteData ? '云端已拉取' : '刚刚' };
      } catch {
        syncState = { sync: 'failed', lastSync: '离线本地' };
      }
    }
    applyAccountData(accountData, { ...nextProfile, ...syncState });
  };

  const syncNow = async () => {
    if (!profile?.email || profile.email.endsWith('@lexipair.local')) {
      setProfile((current) => current ? { ...current, sync: 'offline', lastSync: '仅本机' } : current);
      return;
    }
    const snapshot = buildAccountSnapshot({ groups, progress, installedBooks, aiInsights, offlineEnabled, todayBook, dailyLimit });
    setProfile((current) => current ? { ...current, sync: 'syncing', lastSync: '同步中' } : current);
    try {
      await pushAccountData(profile.email, snapshot);
      lastPushedSnapshot.current = JSON.stringify(snapshot);
      setProfile((current) => current ? { ...current, sync: 'synced', lastSync: '刚刚' } : current);
    } catch {
      setProfile((current) => current ? { ...current, sync: 'failed', lastSync: '待重试' } : current);
    }
  };

  const openStudy = (group) => {
    setCompareFromStudy(false);
    setStudyQueue([group]);
    setStudyQueueIndex(0);
    setSelectedGroup(group);
    setMode('study');
  };

  const openStudyQueue = (queue) => {
    const nextQueue = queue.length ? queue : buildStudyQueue(groups, progress, todayBook, dailyLimit);
    if (!nextQueue.length) return;
    setCompareFromStudy(false);
    setStudyQueue(nextQueue);
    setStudyQueueIndex(0);
    setSelectedGroup(nextQueue[0]);
    setMode('study');
  };

  const openCompare = (group) => {
    setCompareFromStudy(false);
    setSelectedGroup(group);
    setMode('compare');
  };

  const mark = (groupId, result, word) => {
    setProgress((current) => {
      const old = current[groupId] || { count: 0, forgot: 0, blurry: 0, know: 0, favorite: false, note: '' };
      const schedule = nextSchedule(result, old);
      return {
        ...current,
        [groupId]: {
          ...old,
          ...schedule,
          count: old.count + 1,
          [result]: (old[result] || 0) + 1,
          lastResult: result,
          lastWord: word,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const nextQueueItem = () => {
    setStudyQueueIndex((current) => {
      const next = current + 1;
      if (next >= studyQueue.length) {
        setMode('home');
        setStudyQueue([]);
        return 0;
      }
      setSelectedGroup(studyQueue[next]);
      return next;
    });
  };

  const toggleFavorite = (groupId) => {
    setProgress((current) => ({
      ...current,
      [groupId]: {
        ...(current[groupId] || { count: 0 }),
        favorite: !current[groupId]?.favorite
      }
    }));
  };

  const saveNote = (groupId, note) => {
    setProgress((current) => ({
      ...current,
      [groupId]: {
        ...(current[groupId] || { count: 0 }),
        note
      }
    }));
  };

  const goTab = (value) => {
    setActive(value);
    setMode('home');
  };

  const generateAi = async (group) => {
    setAiLoadingId(group.id);
    const compareWords = group.words.length === 1 ? findSimilarWords(group, group.words[0]) : [];
    try {
      const response = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group: {
            ...group,
            compareWords
          },
          mode: 'confusion-memory'
        })
      });
      const data = await response.json().catch(() => ({}));
      const fallback = createAiInsight(group);
      setAiInsights((current) => ({
        ...current,
        [group.id]: {
          ...fallback,
          ...(data.insight || {}),
          provider: data.insight?.provider || (response.ok ? 'api-fallback' : 'local-fallback'),
          error: data.error
        }
      }));
    } catch (error) {
      setAiInsights((current) => ({
        ...current,
        [group.id]: {
          ...createAiInsight(group),
          provider: 'network-fallback',
          error: error.message
        }
      }));
    } finally {
      setAiLoadingId(null);
    }
  };

  const installBook = (book) => {
    const bookGroups = allBookGroups.filter((group) => book.groupIds.includes(group.id));
    setGroups((current) => {
      const existing = new Set(current.map((group) => group.id));
      return [...current, ...bookGroups.filter((group) => !existing.has(group.id))];
    });
    setInstalledBooks((current) => current.includes(book.id) ? current : [...current, book.id]);
    setActiveBook(book.id);
  };

  const importGroups = (incomingGroups) => {
    setGroups((current) => {
      const existing = new Set(current.map((group) => group.id));
      return [...incomingGroups.filter((group) => !existing.has(group.id)), ...current];
    });
    setActive('library');
    setMode('home');
    setActiveBook('all');
  };

  const content = useMemo(() => {
    if (!profile) return <LoginView onLogin={handleLogin} />;
    if (mode === 'study') {
      return (
        <StudyView
          group={selectedGroup}
          queue={studyQueue}
          queueIndex={studyQueueIndex}
          meta={progress[selectedGroup.id]}
          onBack={() => setMode('home')}
          onOpenCompare={() => {
            setCompareFromStudy(true);
            setMode('compare');
          }}
          onMark={mark}
          onNextQueueItem={nextQueueItem}
          onToggleFavorite={toggleFavorite}
          onSaveNote={saveNote}
        />
      );
    }
    if (mode === 'compare') {
      return (
        <CompareView
          group={selectedGroup}
          aiInsight={aiInsights[selectedGroup.id]}
          aiLoading={aiLoadingId === selectedGroup.id}
          onBack={() => setMode(compareFromStudy ? 'study' : 'home')}
          onContinue={() => setMode(compareFromStudy ? 'study' : 'home')}
          onStart={openStudy}
          onGenerateAi={generateAi}
        />
      );
    }
    if (active === 'today') {
      return (
        <TodayView
          groups={groups}
          profile={profile}
          progress={progress}
          todayBook={todayBook}
          setTodayBook={setTodayBook}
          dailyLimit={dailyLimit}
          setDailyLimit={setDailyLimit}
          onStartQueue={openStudyQueue}
          onOpenGroup={openCompare}
        />
      );
    }
    if (active === 'library') {
      return (
        <LibraryView
          groups={groups}
          progress={progress}
          installedBooks={installedBooks}
          activeBook={activeBook}
          setActiveBook={setActiveBook}
          onInstallBook={installBook}
          onOpenGroup={openCompare}
          onCreateGroup={() => setCreating(true)}
        />
      );
    }
    if (active === 'review') return <ReviewView groups={groups} progress={progress} onStart={openStudy} onOpenGroup={openCompare} />;
    if (active === 'stats') return <StatsView groups={groups} progress={progress} profile={profile} />;
    return (
      <SettingsView
        profile={profile}
        setProfile={setProfile}
        groups={groups}
        progress={progress}
        installedBooks={installedBooks}
        aiInsights={aiInsights}
        offlineEnabled={offlineEnabled}
        setOfflineEnabled={setOfflineEnabled}
        onImportGroups={importGroups}
        onLogout={() => setProfile(null)}
      />
    );
  }, [active, activeBook, aiInsights, aiLoadingId, compareFromStudy, dailyLimit, groups, installedBooks, mode, offlineEnabled, profile, progress, selectedGroup, studyQueue, studyQueueIndex, todayBook]);

  if (!profile) return content;

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={goTab} />
      <main className="main-shell">{content}</main>
      <RightPanel
        profile={profile}
        groups={groups}
        progress={progress}
        onOpenGroup={openCompare}
        onStartQueue={openStudyQueue}
        onSyncNow={syncNow}
        onGoTab={goTab}
      />
      {mode === 'home' && <MobileTabBar active={active} setActive={goTab} />}
      {creating && (
        <CreateGroupModal
          onClose={() => setCreating(false)}
          onCreate={(group) => {
            setGroups((current) => [group, ...current]);
            setCreating(false);
            setActive('library');
          }}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
