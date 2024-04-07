import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { CONFIG } from './config';
import { getPiHoleStatus, enablePiHole, disablePiHole } from './client';

const app = new Elysia()
  .use(html())
  .get('/api/status', async () => {
    const status = await getPiHoleStatus();
    return { status };
  })
  .post('/api/enable', async () => {
    await enablePiHole();
    return { status: true };
  })
  .post('/api/disable', async () => {
    await disablePiHole();
    return { status: false };
  })
  .get('/', () => (
    <html lang="en">
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  ))
  .listen(CONFIG.port);

// eslint-disable-next-line no-console
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
