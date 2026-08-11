import { jwtVerify, SignJWT } from "jose";
import {
  ACCESS_TOKEN_TTL,
  getAuthConfig,
  JWT_AUDIENCE,
  JWT_ISSUER,
  REFRESH_TOKEN_TTL,
} from "@config/auth-config.js";
import { InvalidRefreshTokenError, UnauthorizedError } from "@errors/errors.js";
import type { RefreshTokenClaims } from "@users/types/auth-types.js";

export class AuthTokenService {
  async createAccessToken(userId: string) {
    const { accessSecret } = getAuthConfig();

    return new SignJWT()
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_TTL)
      .sign(accessSecret);
  }

  async createRefreshToken(userId: string, sessionId: string) {
    const { refreshSecret } = getAuthConfig();

    return new SignJWT({ sid: sessionId })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(REFRESH_TOKEN_TTL)
      .sign(refreshSecret);
  }

  async verifyAccessToken(token: string) {
    try {
      const { accessSecret } = getAuthConfig();
      const { payload } = await jwtVerify(token, accessSecret, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });

      if (!payload.sub) {
        throw new UnauthorizedError();
      }

      return payload.sub;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      throw new UnauthorizedError();
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenClaims> {
    try {
      const { refreshSecret } = getAuthConfig();
      const { payload } = await jwtVerify(token, refreshSecret, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
      const sessionId = payload.sid;

      if (!payload.sub || typeof sessionId !== "string") {
        throw new InvalidRefreshTokenError();
      }

      return { userId: payload.sub, sessionId };
    } catch (error) {
      if (error instanceof InvalidRefreshTokenError) {
        throw error;
      }

      throw new InvalidRefreshTokenError({ cause: error });
    }
  }
}
