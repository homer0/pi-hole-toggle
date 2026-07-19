/* eslint-disable n/no-process-env -- Configuration reads environment variables at startup. */

const DEFAULT_PORT = 3000;

const apiAppPassword = process.env['PIHOLE_API_APP_PWD'];
if (!apiAppPassword) {
  throw new Error('Pi-hole API application password is required');
}

const apiUrl = (process.env['PIHOLE_API_URL'] || '').replace(/\/+$/, '');

if (!apiUrl) {
  throw new Error('API URL is required');
}

export const CONFIG = {
  title: 'Pi-hole Toggle',
  port: Number(process.env['PORT']) || DEFAULT_PORT,
  apiAppPassword,
  apiUrl,
  stylesheet: './style.css',
  compressCSS: process.env['COMPRESS_CSS'] !== 'false',
} as const;
