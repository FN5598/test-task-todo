import pino from "pino";

const defaultLogLevel = process.env.NODE_ENV === "production" ? "info" : "debug";
const usePrettyLogs = process.env.LOG_PRETTY === "true";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? defaultLogLevel,
  base: {
    service: "todo-backend"
  },
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    remove: true
  },
  ...(usePrettyLogs
    ? {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: process.stdout.isTTY,
          translateTime: "SYS:standard",
          ignore: "pid,hostname"
        }
      }
    }
    : {})
});
