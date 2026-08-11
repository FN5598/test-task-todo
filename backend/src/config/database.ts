import { Sequelize } from "sequelize";
import { logger } from "@shared/logger.js";

export type DatabaseEnvironment = Record<string, string | undefined>;

export function createSequelize(environment: DatabaseEnvironment = process.env) {
  const logging = environment.DB_LOGGING === "true" ? (sql: string) => logger.debug({ sql }, "SQL query") : false;
  const databaseUrl = environment.NODE_ENV === "test"
    ? environment.TEST_DATABASE_URL
    : environment.DATABASE_URL;

  if (databaseUrl) {
    return new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging
    });
  }

  return new Sequelize({
    dialect: "postgres",
    host: environment.DB_HOST ?? "localhost",
    port: Number(environment.DB_PORT ?? 5432),
    database: environment.NODE_ENV === "test" ? environment.TEST_DB_NAME ?? "todo_test" : environment.DB_NAME ?? "todo",
    username: environment.DB_USER ?? "todo",
    password: environment.DB_PASSWORD ?? "todo",
    logging
  });
}

export const sequelize = createSequelize();
