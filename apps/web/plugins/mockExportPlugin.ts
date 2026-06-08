import * as fs from 'fs';
import * as path from 'path';
import type { Plugin } from 'vite';

/**
 * Vite dev-server plugin that exposes a `POST /__save-mock` endpoint.
 *
 * When `VITE_EXPORT_MOCKS=true` the browser-side `exportMock` helper POSTs
 * each piece of data here. The plugin writes it straight to
 * `public/mockdata/<key>.json` (dots in the key become directory separators).
 *
 * Example: key `auth.session` → `public/mockdata/auth/session.json`
 */
export function mockExportPlugin(): Plugin {
  let publicDir: string;

  return {
    name: 'mock-export',
    apply: 'serve', // dev only

    configResolved(config) {
      publicDir = config.publicDir; // resolves to <root>/public
    },

    configureServer(server) {
      server.middlewares.use('/__save-mock', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');

          return;
        }

        let body = '';

        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            const { key, data } = JSON.parse(body) as { key: string; data: unknown };

            // key like "auth.session" → "auth/session"
            const relativePath = key.replace(/\./g, '/');
            const filePath = path.join(publicDir, 'mockdata', `${relativePath}.json`);

            // Ensure parent directories exist
            fs.mkdirSync(path.dirname(filePath), { recursive: true });

            const json = JSON.stringify(data, null, 2);

            fs.writeFileSync(filePath, json, 'utf-8');

            const shortPath = path.relative(process.cwd(), filePath);

            // eslint-disable-next-line no-console
            console.log(`\x1b[36m[mock-export]\x1b[0m saved ${shortPath}`);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, path: shortPath }));
          } catch (err) {
            console.error('[mock-export] failed to write mock', err);
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
        });
      });
    },
  };
}
