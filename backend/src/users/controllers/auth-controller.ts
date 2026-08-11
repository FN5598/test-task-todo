import type { Request, Response } from "express";
import {
  ACCESS_TOKEN_COOKIE,
  accessTokenCookieOptions,
  clearAccessTokenCookieOptions,
  clearRefreshTokenCookieOptions,
  refreshTokenCookieOptions,
  REFRESH_TOKEN_COOKIE,
} from "@config/auth-cookie.js";
import { validateInput } from "@shared/validators/validate-input.js";
import { AuthService } from "@users/services/auth-service.js";
import type { LogInInput, SignInInput } from "@users/types/auth-types.js";
import { logInSchema, signInSchema } from "@users/validators/auth-schemas.js";

function signInInput(body: unknown): SignInInput {
  return validateInput(signInSchema, body);
}

function logInInput(body: unknown): LogInInput {
  return validateInput(logInSchema, body);
}

function refreshToken(request: Request) {
  const token = request.cookies?.[REFRESH_TOKEN_COOKIE];
  return typeof token === "string" ? token : undefined;
}

function setAuthenticationCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
) {
  return response
    .cookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions())
    .cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions());
}

function clearAuthenticationCookies(response: Response) {
  return response
    .clearCookie(ACCESS_TOKEN_COOKIE, clearAccessTokenCookieOptions())
    .clearCookie(REFRESH_TOKEN_COOKIE, clearRefreshTokenCookieOptions());
}

export class AuthController {
  private readonly authService = new AuthService();

  signIn = async (request: Request, response: Response) => {
    const result = await this.authService.signIn(signInInput(request.body));

    setAuthenticationCookies(response, result.accessToken, result.refreshToken)
      .status(201)
      .json({ user: result.user });
  };

  logIn = async (request: Request, response: Response) => {
    const result = await this.authService.logIn(logInInput(request.body));

    setAuthenticationCookies(response, result.accessToken, result.refreshToken)
      .status(200)
      .json({ user: result.user });
  };

  refreshToken = async (request: Request, response: Response) => {
    try {
      const result = await this.authService.refresh(refreshToken(request) ?? "");

      setAuthenticationCookies(response, result.accessToken, result.refreshToken)
        .status(200)
        .json({});
    } catch (error) {
      clearAuthenticationCookies(response);
      throw error;
    }
  };

  signOut = async (request: Request, response: Response) => {
    await this.authService.signOut(refreshToken(request));
    clearAuthenticationCookies(response).status(204).send();
  };
}
