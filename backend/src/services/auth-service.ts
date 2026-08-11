import { randomUUID } from "node:crypto";
import argon2 from "argon2";
import { REFRESH_TOKEN_TTL_MS } from "../auth-config.js";
import {
  AppError,
  ConflictError,
  InternalServerError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
} from "../errors/index.js";
import {
  AuthRepository,
  type AuthRepositoryInterface,
  type CreateAuthSessionData,
  type CreateUserData,
} from "../repositories/index.js";
import { AuthTokenService } from "./auth-token-service.js";

export type SignInInput = {
  username: string;
  email: string;
  password: string;
};

export type LogInInput = {
  email: string;
  password: string;
};

export type SafeUser = {
  id: string;
  username: string;
  email: string;
};

export type AuthenticationResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

export type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};

export class AuthService {
  private readonly authRepository: AuthRepositoryInterface = new AuthRepository();
  private readonly authTokenService = new AuthTokenService();

  async signIn(input: SignInInput): Promise<AuthenticationResult> {
    return this.execute("register user", async () => {
      const hashedPassword = await argon2.hash(input.password, { type: argon2.argon2id });
      const user = await this.authRepository.createUser(this.toCreateUserData(input, hashedPassword));

      return this.createAuthenticationResult(this.safeUser(user));
    });
  }

  async logIn(input: LogInInput): Promise<AuthenticationResult> {
    return this.execute("log in", async () => {
      const user = await this.authRepository.findUserByEmailWithPassword(input.email);

      if (!user || !(await this.passwordMatches(input.password, user.hashedPassword))) {
        throw new InvalidCredentialsError();
      }

      return this.createAuthenticationResult(this.safeUser(user));
    });
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    return this.execute("refresh session", async () => {
      const claims = await this.authTokenService.verifyRefreshToken(refreshToken);
      const session = await this.authRepository.findSessionById(claims.sessionId);

      if (!session || session.userId !== claims.userId || session.expiresAt <= new Date()) {
        throw new InvalidRefreshTokenError();
      }

      if (!(await this.refreshTokenMatches(refreshToken, session.hashedRefreshToken))) {
        await this.authRepository.deleteSession(session.id);
        throw new InvalidRefreshTokenError();
      }

      const nextRefreshToken = await this.authTokenService.createRefreshToken(session.userId, session.id);
      const nextHashedRefreshToken = await argon2.hash(nextRefreshToken, { type: argon2.argon2id });
      const updatedCount = await this.authRepository.rotateSession(
        session.id,
        session.hashedRefreshToken,
        {
          hashedRefreshToken: nextHashedRefreshToken,
          expiresAt: this.refreshTokenExpiry(),
        },
      );

      if (updatedCount === 0) {
        throw new InvalidRefreshTokenError();
      }

      return {
        accessToken: await this.authTokenService.createAccessToken(session.userId),
        refreshToken: nextRefreshToken,
      };
    });
  }

  async signOut(refreshToken: string | undefined) {
    if (!refreshToken) {
      return;
    }

    try {
      const { sessionId } = await this.authTokenService.verifyRefreshToken(refreshToken);
      await this.authRepository.deleteSession(sessionId);
    } catch (error) {
      if (!(error instanceof InvalidRefreshTokenError)) {
        throw error;
      }
    }
  }

  private async createAuthenticationResult(user: SafeUser): Promise<AuthenticationResult> {
    const sessionId = randomUUID();
    const refreshToken = await this.authTokenService.createRefreshToken(user.id, sessionId);
    const hashedRefreshToken = await argon2.hash(refreshToken, { type: argon2.argon2id });
    await this.authRepository.createSession(
      this.toCreateSessionData(sessionId, user.id, hashedRefreshToken),
    );

    return {
      user,
      accessToken: await this.authTokenService.createAccessToken(user.id),
      refreshToken,
    };
  }

  private async passwordMatches(password: string, hashedPassword: string) {
    try {
      return await argon2.verify(hashedPassword, password);
    } catch {
      return false;
    }
  }

  private async refreshTokenMatches(refreshToken: string, hashedRefreshToken: string) {
    try {
      return await argon2.verify(hashedRefreshToken, refreshToken);
    } catch {
      return false;
    }
  }

  private toCreateUserData(input: SignInInput, hashedPassword: string): CreateUserData {
    return {
      username: input.username,
      email: input.email,
      hashedPassword,
    };
  }

  private toCreateSessionData(
    id: string,
    userId: string,
    hashedRefreshToken: string,
  ): CreateAuthSessionData {
    return {
      id,
      userId,
      hashedRefreshToken,
      expiresAt: this.refreshTokenExpiry(),
    };
  }

  private refreshTokenExpiry() {
    return new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  }

  private safeUser(user: SafeUser): SafeUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  private async execute<T>(operation: string, callback: () => Promise<T>) {
    try {
      return await callback();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError(`Unable to ${operation}`, { cause: error });
    }
  }
}
