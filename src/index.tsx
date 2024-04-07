import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { CONFIG } from './config';
import { getPiHoleStatus, enablePiHole, disablePiHole } from './client';
import { renderDocument, renderApp } from './ui';

const app = new Elysia()
  .use(html())
  .get('/api/status', async () => {
    const enabled = await getPiHoleStatus();
    return renderApp({ enabled });
  })
  .post('/api/enable', async () => {
    await enablePiHole();
    return renderApp({ enabled: true });
  })
  .post('/api/disable', async () => {
    await disablePiHole();
    return renderApp({ enabled: false });
  })
  .get('/', async () => {
    const enabled = await getPiHoleStatus();
    return renderDocument({ children: renderApp({ enabled }) });
  })
  .listen(CONFIG.port);

// eslint-disable-next-line no-console
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
