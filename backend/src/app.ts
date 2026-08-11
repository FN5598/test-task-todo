import { randomUUID } from "node:crypto";
import cors from "cors";
import express from "express";
import { pinoHttp } from "pino-http";
import { logger } from "./logger.js";

export const app = express();

app.use(cors());
app.use(
  pinoHttp({
    logger,
    genReqId(request, response) {
      const header = request.headers["x-request-id"];
      const requestId = Array.isArray(header) ? header[0] : header;
      const id = requestId || randomUUID();

      response.setHeader("x-request-id", id);
      return id;
    },
    customLogLevel(_request, response, error) {
      if (error || response.statusCode >= 500) {
        return "error";
      }

      if (response.statusCode >= 400) {
        return "warn";
      }

      return "info";
    }
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use((error: unknown, request: express.Request, response: express.Response, _next: express.NextFunction) => {
  request.log.error({ err: error }, "Unhandled request error");
  response.status(500).json({ error: "Internal server error" });
});
