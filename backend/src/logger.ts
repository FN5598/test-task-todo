import pino from "pino";

const defaultLogLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? defaultLogLevel,
  base: {
    service: "todo-backend"
  },
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    remove: true
  }
});
