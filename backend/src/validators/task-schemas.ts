import { z } from "zod";
import { TaskStatus } from "../entities/index.js";

const titleSchema = z
  .string()
  .trim()
  .min(1, "title must be a non-empty string");
const descriptionSchema = z.string().trim();

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  status: z.enum(TaskStatus).optional(),
});

export const updateTaskSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    status: z.enum(TaskStatus).optional(),
  })
  .refine(
    (input) => Object.values(input).some((value) => value !== undefined),
    {
      message: "Provide title, description, or status to update a task",
    },
  );
