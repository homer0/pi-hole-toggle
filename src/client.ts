import { CONFIG } from './config.js';

export type PiHoleBlockingResponse = {
  blocking: boolean;
};

type PiHoleAuthResponse = {
  session: {
    sid: string;
    valid: boolean;
  };
};

type PiHoleRequestOptions = {
  body?: string;
  method?: string;
};

const UNAUTHORIZED_STATUS = 401;

let sessionId: string | undefined;

const getApiUrl = (path: string): URL => new URL(`/api${path}`, CONFIG.apiUrl);

/** Parses a JSON response as the caller's expected Pi-hole API shape. */
const getResponseJson = async <T = unknown>(response: Response): Promise<T> =>
  response.json();

const throwForErrorResponse = (response: Response): void => {
  if (response.ok) return;

  throw new Error(
    `Pi-hole API request failed: ${response.status} ${response.statusText}`,
  );
};

const authenticate = async (): Promise<string> => {
  const response = await fetch(getApiUrl('/auth'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: CONFIG.apiAppPassword }),
  });

  throwForErrorResponse(response);

  const data = await getResponseJson<PiHoleAuthResponse>(response);
  if (!data.session.valid || !data.session.sid) {
    throw new Error('Pi-hole API authentication did not return a valid session');
  }

  sessionId = data.session.sid;
  return sessionId;
};

const sendAuthenticatedRequest = async (
  path: string,
  options: PiHoleRequestOptions = {},
): Promise<Response> => {
  const sid = sessionId || (await authenticate());
  return fetch(getApiUrl(path), {
    ...options,
    headers: {
      'X-FTL-SID': sid,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
};

// Retry the original request once after re-authenticating an expired session.
const sendRequest = async (
  path: string,
  options: PiHoleRequestOptions = {},
): Promise<Response> => {
  const response = await sendAuthenticatedRequest(path, options);
  if (response.status !== UNAUTHORIZED_STATUS) {
    throwForErrorResponse(response);
    return response;
  }

  sessionId = undefined;
  const retriedResponse = await sendAuthenticatedRequest(path, options);
  throwForErrorResponse(retriedResponse);
  return retriedResponse;
};

export const getPiHoleStatus = async (): Promise<boolean> => {
  const response = await sendRequest('/dns/blocking');
  const data = await getResponseJson<PiHoleBlockingResponse>(response);
  return data.blocking;
};

const setPiHoleBlocking = async (blocking: boolean): Promise<void> => {
  await sendRequest('/dns/blocking', {
    method: 'POST',
    body: JSON.stringify({ blocking, timer: null }),
  });
};

export const enablePiHole = (): Promise<void> => setPiHoleBlocking(true);

export const disablePiHole = (): Promise<void> => setPiHoleBlocking(false);
