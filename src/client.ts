import { CONFIG } from './config';

export type PiHoleStatus = 'enabled' | 'disabled';

export type PiHoleResponse = {
  status: PiHoleStatus;
};

const API_PATH = '/admin/api.php';

const getUrl = (params: Record<string, unknown>): string => {
  const url = new URL(API_PATH, CONFIG.apiUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  url.searchParams.append('auth', CONFIG.apiToken);
  return url.toString().replace(/=&/g, '&');
};

export const getPiHoleStatus = async (): Promise<boolean> => {
  const url = getUrl({ summaryRaw: '' });
  const response = await fetch(url);
  const data: PiHoleResponse = await response.json();
  return data.status === 'enabled';
};

export const enablePiHole = async (): Promise<void> => {
  const url = getUrl({ enable: '' });
  await fetch(url);
};

export const disablePiHole = async (): Promise<void> => {
  const url = getUrl({ disable: '' });
  await fetch(url);
};
