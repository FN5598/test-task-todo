import type { AuthSession, User } from "../entities/index.js";

export type CreateUserData = {
  username: string;
  email: string;
  hashedPassword: string;
};

export type CreateAuthSessionData = {
  id: string;
  userId: string;
  hashedRefreshToken: string;
  expiresAt: Date;
};

export type RotateAuthSessionData = {
  hashedRefreshToken: string;
  expiresAt: Date;
};

export interface AuthRepositoryInterface {
  createUser(data: CreateUserData): Promise<User>;

  findUserByEmailWithPassword(email: string): Promise<User | null>;

  createSession(data: CreateAuthSessionData): Promise<AuthSession>;

  findSessionById(sessionId: string): Promise<AuthSession | null>;

  rotateSession(
    sessionId: string,
    previousHashedRefreshToken: string,
    data: RotateAuthSessionData,
  ): Promise<number>;

  deleteSession(sessionId: string): Promise<number>;
}
