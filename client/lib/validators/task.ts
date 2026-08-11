import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Enter a task title."),
  description: z.string().trim(),
  status: z.enum(["todo", "in_progress", "done"]),
}).strict();

export const updateTaskSchema = createTaskSchema;
