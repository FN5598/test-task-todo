import type { RequestHandler } from "express";
import { UnauthorizedError } from "@errors/errors.js";
import { AuthTokenService } from "@users/services/auth-token-service.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
    }
  }
}

const authTokenService = new AuthTokenService();

function accessToken(request: Parameters<RequestHandler>[0]) {
  const token = request.cookies?.access_token;

  if (typeof token !== "string" || !token) {
    throw new UnauthorizedError();
  }

  return token;
}

export const requireAccessToken: RequestHandler = async (request, _response, next) => {
  const userId = await authTokenService.verifyAccessToken(accessToken(request));

  request.auth = { userId };
  next();
};
