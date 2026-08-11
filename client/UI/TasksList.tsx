"use client";

import Link from "next/link";
import type { Task } from "@/app/tasks/task-api";
import { formatRelativeTime } from "@/lib/format-relative-time";

type TasksPageProps = {
  visibleTasks: Task[];
};

export default function TasksList({ visibleTasks }: TasksPageProps) {
  if (visibleTasks.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold">No tasks here yet.</p>
        <Link
          className="mt-3 inline-block text-sm text-muted-foreground underline underline-offset-4"
          href="/tasks/new"
        >
          Create your first todo
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y">
        {visibleTasks.map((task) => (
          <li className="flex items-start gap-4 py-5" key={task.id}>
            <span
              className={`mt-0.5 grid size-5 shrink-0 place-items-center border text-xs ${task.status === "done" ? "bg-primary text-primary-foreground" : ""}`}
              aria-hidden="true"
            >
              {task.status === "done" ? "✓" : ""}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Link
                  className={`font-medium hover:underline hover:underline-offset-4 ${task.status === "done" ? "text-muted-foreground line-through" : ""}`}
                  href={`/tasks/${encodeURIComponent(task.slug)}`}
                >
                  {task.title}
                </Link>
                <Link
                  className="border px-2 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-muted"
                  href={`/tasks/${encodeURIComponent(task.slug)}/edit`}
                >
                  Edit
                </Link>
              </div>
              {task.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {task.description}
                </p>
              ) : null}
            </div>
            <div className="shrink-0 text-right font-mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
              <p>{task.status}</p>
              <p className="mt-1 normal-case tracking-normal">
                Created {formatRelativeTime(task.createdAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
