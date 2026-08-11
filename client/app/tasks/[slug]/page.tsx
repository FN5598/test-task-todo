import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import TaskDetailPage from "@ui/TaskDetailPage";
import { getTaskBySlug } from "@app/tasks/task-api";
import { deleteTaskAction } from "../actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Task details",
  description: "View a Todo App task.",
};

export default async function TaskDetailsPage({ params }: Props) {
  const { slug } = await params;
  const result = await getTaskBySlug(slug);

  if ("unauthorized" in result) {
    redirect("/auth?tab=login");
  }

  if ("notFound" in result) {
    notFound();
  }

  if ("error" in result) {
    throw new Error(result.error);
  }

  return (
    <TaskDetailPage
      deleteAction={deleteTaskAction.bind(null, result.task.id)}
      task={result.task}
    />
  );
}
