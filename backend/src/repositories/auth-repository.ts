import {
  ConnectionError,
  DatabaseError as SequelizeDatabaseError,
  TimeoutError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";
import {
  BadRequestError,
  EmailAlreadyRegisteredError,
  InternalServerError,
  ServiceUnavailableError,
} from "../errors/index.js";
import { AuthSession, User } from "../entities/index.js";
import type {
  AuthRepositoryInterface,
  CreateAuthSessionData,
  CreateUserData,
  RotateAuthSessionData,
} from "./auth-repository.interface.js";

export class AuthRepository implements AuthRepositoryInterface {
  async createUser(data: CreateUserData) {
    return this.execute("create user", () => User.create(data));
  }

  async findUserByEmailWithPassword(email: string) {
    return this.execute("find user", () => User.unscoped().findOne({ where: { email } }));
  }

  async createSession(data: CreateAuthSessionData) {
    return this.execute("create auth session", () => AuthSession.create(data));
  }

  async findSessionById(sessionId: string) {
    return this.execute("find auth session", () => AuthSession.findByPk(sessionId));
  }

  async rotateSession(sessionId: string, previousHashedRefreshToken: string, data: RotateAuthSessionData) {
    return this.execute("rotate auth session", async () => {
      const [updatedCount] = await AuthSession.update(data, {
        where: { id: sessionId, hashedRefreshToken: previousHashedRefreshToken },
      });
      return updatedCount;
    });
  }

  async deleteSession(sessionId: string) {
    return this.execute("delete auth session", () => AuthSession.destroy({ where: { id: sessionId } }));
  }

  private async execute<T>(operation: string, callback: () => Promise<T>) {
    try {
      return await callback();
    } catch (error) {
      throw this.toApplicationError(operation, error);
    }
  }

  private toApplicationError(operation: string, error: unknown) {
    const options = { cause: error };

    if (error instanceof UniqueConstraintError) {
      return new EmailAlreadyRegisteredError();
    }

    if (error instanceof ValidationError) {
      return new BadRequestError("User data is invalid", options);
    }

    if (error instanceof ConnectionError || error instanceof TimeoutError) {
      return new ServiceUnavailableError("Database is temporarily unavailable", options);
    }

    if (error instanceof SequelizeDatabaseError) {
      return new InternalServerError("Unable to complete the authentication operation", options);
    }

    return new InternalServerError(`Unable to ${operation}`, options);
  }
}
