import type { CookieOptions, Response } from 'express';

const ACCESS_TOKEN_COOKIE = 'pl_access_token';
const REFRESH_TOKEN_COOKIE = 'pl_refresh_token';

const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'acceptance';

const baseOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
};

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export function setAuthCookies(res: Response, accessToken: string, refreshToken?: string | null) {
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  if (refreshToken) {
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...baseOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, baseOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE, baseOptions);
}

export const AUTH_COOKIE_NAMES = {
  access: ACCESS_TOKEN_COOKIE,
  refresh: REFRESH_TOKEN_COOKIE,
};
