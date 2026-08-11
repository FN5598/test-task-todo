import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import EditTaskForm from "@ui/forms/EditTaskForm";
import { getTaskBySlug } from "@app/tasks/task-api";
import { updateTaskAction } from "../../actions";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Edit task",
  description: "Edit your Todo App task.",
};

export default async function EditTaskPage({ params, searchParams }: Props) {
  const [{ slug }, { error }] = await Promise.all([params, searchParams]);
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
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
        href={`/tasks/${encodeURIComponent(result.task.slug)}`}
      >
        ← Back to task
      </Link>
      <p className="mt-10 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Edit task
      </p>
      <h1 className="mt-2 wrap-break-word text-4xl font-black tracking-[-0.07em] sm:text-5xl">
        {result.task.title}
      </h1>
      <EditTaskForm
        action={updateTaskAction.bind(null, result.task.id, result.task.slug)}
        error={typeof error === "string" ? error : undefined}
        task={result.task}
      />
    </main>
  );
}
