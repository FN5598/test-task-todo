import Link from "next/link";
import type { Task } from "@app/tasks/task-api";

type TaskDetailPageProps = {
  deleteAction: () => void | Promise<void>;
  task: Task;
};

function statusLabel(status: Task["status"]) {
  return status === "in_progress"
    ? "In progress"
    : status === "todo"
      ? "To do"
      : "Done";
}

export default function TaskDetailPage({
  deleteAction,
  task,
}: TaskDetailPageProps) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
        href="/tasks"
      >
        ← Back to tasks
      </Link>

      <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Task
          </p>
          <h1 className="mt-2 wrap-break-word text-4xl font-black tracking-[-0.07em] sm:text-5xl">
            {task.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="border px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
            {statusLabel(task.status)}
          </span>
          <Link
            className="border px-3 py-2 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-muted"
            href={`/tasks/${encodeURIComponent(task.slug)}/edit`}
          >
            Edit task
          </Link>
        </div>
      </div>

      <section className="mt-12 border-y py-7">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.13em] text-muted-foreground">
          Description
        </p>
        <p className="mt-3 whitespace-pre-wrap leading-7 text-foreground">
          {task.description || "No description was added to this task."}
        </p>
      </section>

      <p className="mt-7 font-mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
        Created{" "}
        {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
          new Date(task.createdAt),
        )}
      </p>

      <form
        action={deleteAction}
        className="mt-10 border border-red-700 p-5 sm:p-7"
      >
        <p className="font-semibold">Delete this task</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
        <button
          className="mt-5 h-11 cursor-pointer border border-red-700 px-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-red-700 transition-colors hover:bg-red-700 hover:text-white"
          type="submit"
        >
          Delete task
        </button>
      </form>
    </main>
  );
}
