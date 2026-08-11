import { randomUUID } from "node:crypto";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { pinoHttp } from "pino-http";
import { getClientOrigin } from "./auth-config.js";
import { errorMiddleware, notFoundMiddleware } from "./errors/index.js";
import { logger } from "./logger.js";
import { authRouter } from "./routes/auth-routes.js";
import { taskRouter } from "./routes/task-routes.js";

export const app = express();

app.use(
  cors({
    origin: getClientOrigin(),
    credentials: true,
  }),
);
app.use(
  pinoHttp({
    logger,
    quietReqLogger: true,
    customSuccessMessage(request, response) {
      return `${request.method} ${request.url} → ${response.statusCode}`;
    },
    customErrorMessage(request, response) {
      return `${request.method} ${request.url} → ${response.statusCode}`;
    },
    customSuccessObject(request, _response, value) {
      return {
        requestId: request.id,
        responseTime: value.responseTime,
      };
    },
    customErrorObject(request, response, error, value) {
      return {
        requestId: request.id,
        responseTime: value.responseTime,
        statusCode: response.statusCode,
        err: error,
      };
    },
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
    },
  }),
);
app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();

apiRouter.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
app.use("/api", apiRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
