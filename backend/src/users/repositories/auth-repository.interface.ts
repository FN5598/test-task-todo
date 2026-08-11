import type { AuthSession } from "@users/entities/auth-session.js";
import type { User } from "@users/entities/user.js";
import type {
  CreateAuthSessionData,
  CreateUserData,
  RotateAuthSessionData,
} from "@users/types/auth-types.js";

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
