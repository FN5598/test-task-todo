"use server";

import { redirect } from "next/navigation";
import { createTaskSchema, updateTaskSchema } from "@lib/validators/task";
import { validateForm } from "@lib/validators/validate-form";
import { createTask, deleteTask, updateTask } from "./task-api";

export async function createTaskAction(formData: FormData) {
  const result = validateForm(createTaskSchema, formData);

  if (!result.success) {
    redirect("/tasks/new?error=Please%20complete%20the%20required%20fields.");
  }

  const taskResult = await createTask(result.data);

  if ("unauthorized" in taskResult) {
    redirect("/auth?tab=login");
  }

  if ("error" in taskResult) {
    redirect(`/tasks/new?error=${encodeURIComponent(taskResult.error ?? "Unable to create the task.")}`);
  }

  redirect("/tasks");
}

export async function updateTaskAction(
  taskId: string,
  currentSlug: string,
  formData: FormData,
) {
  const result = validateForm(updateTaskSchema, formData);

  if (!result.success) {
    redirect(`/tasks/${currentSlug}?error=Please%20complete%20the%20required%20fields.`);
  }

  const taskResult = await updateTask(taskId, result.data);

  if ("unauthorized" in taskResult) {
    redirect("/auth?tab=login");
  }

  if ("error" in taskResult) {
    redirect(`/tasks/${currentSlug}?error=${encodeURIComponent(taskResult.error ?? "Unable to update the task.")}`);
  }

  redirect(`/tasks/${taskResult.task.slug}`);
}

export async function deleteTaskAction(taskId: string) {
  const taskResult = await deleteTask(taskId);

  if ("unauthorized" in taskResult) {
    redirect("/auth?tab=login");
  }

  if ("error" in taskResult) {
    redirect(`/tasks?error=${encodeURIComponent(taskResult.error ?? "Unable to delete the task.")}`);
  }

  redirect("/tasks");
}
