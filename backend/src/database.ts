import { Sequelize } from "sequelize";
import { logger } from "./logger.js";

export type DatabaseEnvironment = Record<string, string | undefined>;

export function createSequelize(environment: DatabaseEnvironment = process.env) {
  const logging = environment.DB_LOGGING === "true" ? (sql: string) => logger.debug({ sql }, "SQL query") : false;

  if (environment.DATABASE_URL) {
    return new Sequelize(environment.DATABASE_URL, {
      dialect: "postgres",
      logging
    });
  }

  return new Sequelize({
    dialect: "postgres",
    host: environment.DB_HOST ?? "localhost",
    port: Number(environment.DB_PORT ?? 5432),
    database: environment.DB_NAME ?? "todo",
    username: environment.DB_USER ?? "todo",
    password: environment.DB_PASSWORD ?? "todo",
    logging
  });
}

export const sequelize = createSequelize();
