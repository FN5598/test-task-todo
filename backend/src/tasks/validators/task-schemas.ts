import { z } from "zod";
import { TaskStatus } from "@tasks/entities/task.js";

const titleSchema = z
  .string()
  .trim()
  .min(1, "title must be a non-empty string");
const descriptionSchema = z.string().trim();

export const DEFAULT_TASK_PAGE_LIMIT = 20;

const taskStatusFilterSchema = z.enum([
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
  "active",
]);

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  status: z.enum(TaskStatus).optional(),
}).strict();

export const updateTaskSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    status: z.enum(TaskStatus).optional(),
  })
  .strict()
  .refine(
    (input) => Object.values(input).some((value) => value !== undefined),
    {
      message: "Provide title, description, or status to update a task",
    },
  );

export const listTasksQuerySchema = z.object({
  status: taskStatusFilterSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(DEFAULT_TASK_PAGE_LIMIT).default(DEFAULT_TASK_PAGE_LIMIT),
}).strict();
