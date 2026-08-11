import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError, NotFoundError } from "@errors/errors.js";

type JsonParseError = SyntaxError & {
  status?: number;
  type?: string;
};

function isMalformedJsonError(error: unknown): error is JsonParseError {
  return (
    error instanceof SyntaxError &&
    (error as JsonParseError).status === 400 &&
    (error as JsonParseError).type === "entity.parse.failed"
  );
}

export const notFoundMiddleware: RequestHandler = (request, _response, next) => {
  next(new NotFoundError(`Route ${request.method} ${request.originalUrl} was not found`));
};

export const errorMiddleware: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (isMalformedJsonError(error)) {
    request.log.warn({ err: error }, "Malformed JSON request body");
    response.status(400).json({ error: "Request body must contain valid JSON" });
    return;
  }

  if (error instanceof AppError) {
    const log = error.statusCode >= 500 ? request.log.error.bind(request.log) : request.log.warn.bind(request.log);

    log({ err: error, statusCode: error.statusCode }, "Request failed");
    response.status(error.statusCode).json({
      error: error.message,
      ...(error.metadata === undefined ? {} : { details: error.metadata }),
    });
    return;
  }

  request.log.error({ err: error }, "Unhandled request error");
  response.status(500).json({ error: "Internal server error" });
};
