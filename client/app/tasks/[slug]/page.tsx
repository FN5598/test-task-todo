import { notFound, redirect } from "next/navigation";
import TaskDetailPage from "@/UI/TaskDetailPage";
import { getTaskBySlug } from "@/app/tasks/task-api";
import { deleteTaskAction } from "../actions";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const result = await getTaskBySlug(slug);

  if ("unauthorized" in result) {
    redirect("/auth?tab=login");
  }

  if ("notFound" in result) {
    notFound();
  }

  if ("error" in result) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-14 text-red-600 sm:px-8">
        {result.error}
      </main>
    );
  }

  return (
    <TaskDetailPage
      deleteAction={deleteTaskAction.bind(null, result.task.id)}
      task={result.task}
    />
  );
}
