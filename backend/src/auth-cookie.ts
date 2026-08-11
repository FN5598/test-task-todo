import type { CookieOptions } from "express";
import { REFRESH_TOKEN_TTL_MS } from "./auth-config.js";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

function cookieOptions(environment = process.env): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: environment.NODE_ENV === "production",
    path: "/api/auth",
  };
}

export function refreshTokenCookieOptions(environment = process.env): CookieOptions {
  return {
    ...cookieOptions(environment),
    maxAge: REFRESH_TOKEN_TTL_MS,
  };
}

export function accessTokenCookieOptions(environment = process.env): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: environment.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60 * 1000,
  };
}

export function clearAccessTokenCookieOptions(environment = process.env): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: environment.NODE_ENV === "production",
    path: "/",
  };
}

export function clearRefreshTokenCookieOptions(environment = process.env): CookieOptions {
  return cookieOptions(environment);
}
