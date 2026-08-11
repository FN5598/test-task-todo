import { z } from "zod";
import {
  RequestValidationError,
  type ValidationIssueMetadata,
} from "../errors/index.js";
import { logger } from "../logger.js";

function issueMetadata(error: z.ZodError): ValidationIssueMetadata[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    code: issue.code,
    message: issue.message,
  }));
}

export function validateInput<TSchema extends z.ZodType>(schema: TSchema, input: unknown): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  const issues = issueMetadata(result.error);
  logger.warn({ issues }, "Input validation failed");
  throw new RequestValidationError(issues);
}
