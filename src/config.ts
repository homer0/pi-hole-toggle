/* eslint-disable no-process-env */

const DEFAULT_PORT = 3000;

const apiToken = process.env.PIHOLE_API_TOKEN;
if (!apiToken) {
  throw new Error('API token is required');
}

const apiUrl = (process.env.PIHOLE_API_URL || '').replace(/\/+$/, '');

if (!apiUrl) {
  throw new Error('API URL is required');
}

export const CONFIG = {
  title: 'Pi-hole Toggle',
  port: Number(process.env.PORT) || DEFAULT_PORT,
  apiToken,
  apiUrl,
  stylesheet: './style.css',
  compressCSS: process.env.COMPRESS_CSS !== 'false',
} as const;
