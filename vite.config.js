import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const ipaFileName = 'LexiPair-unsigned.ipa';
const ipaPath = path.resolve(process.cwd(), 'build/ipa', ipaFileName);

function sendIpa(res) {
  if (!fs.existsSync(ipaPath)) {
    res.statusCode = 404;
    res.end('IPA has not been built yet.');
    return;
  }
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${ipaFileName}"`);
  res.setHeader('Content-Length', fs.statSync(ipaPath).size);
  fs.createReadStream(ipaPath).pipe(res);
}

function ipaDownloadPlugin() {
  return {
    name: 'lexipair-ipa-download',
    configureServer(server) {
      server.middlewares.use('/ipa/LexiPair-unsigned.ipa', (_req, res) => sendIpa(res));
    },
    configurePreviewServer(server) {
      server.middlewares.use('/ipa/LexiPair-unsigned.ipa', (_req, res) => sendIpa(res));
    }
  };
}

export default defineConfig({
  plugins: [react(), ipaDownloadPlugin()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787'
    }
  }
});
