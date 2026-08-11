import { notFound, redirect } from "next/navigation";
import EditTaskForm from "@/UI/EditTaskForm";
import { getTaskBySlug } from "@/app/tasks/task-api";
import { updateTaskAction } from "../../actions";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Edit",
  description: "Edit your existing tasks",
};

export default async function Page({ params, searchParams }: Props) {
  const [{ slug }, { error }] = await Promise.all([params, searchParams]);
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
