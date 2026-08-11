import CreateTodoForm from "@ui/forms/CreateTodoForm";
import { createTaskAction } from "../actions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create task",
  description: "Create a new Todo App task.",
};

export default async function CreateTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
        href="/tasks"
      >
        ← Back to tasks
      </Link>
      <p className="mt-10 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        New todo
      </p>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.07em] sm:text-5xl">
        Create a todo
      </h1>
      <CreateTodoForm
        action={createTaskAction}
        error={typeof error === "string" ? error : undefined}
      />
    </main>
  );
}
