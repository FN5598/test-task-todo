import type { Metadata } from "next";
import TasksList from "@ui/TasksList";
import { getTaskCounts, listTasks } from "./task-api";
import Unauthorized from "@ui/Unauthorized";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My tasks",
  description: "View and manage your Todo App tasks.",
};

enum TaskFilter {
  ALL = "all",
  ACTIVE = "active",
  DONE = "done",
}

function getFilter(value: string | string[] | undefined): TaskFilter {
  return value === "active"
    ? TaskFilter.ACTIVE
    : value === "done"
      ? TaskFilter.DONE
      : TaskFilter.ALL;
}

function getPage(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return 1;
  }

  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function taskListHref(filter: TaskFilter, page: number) {
  const query = new URLSearchParams();

  if (filter !== TaskFilter.ALL) {
    query.set("filter", filter);
  }

  if (page > 1) {
    query.set("page", String(page));
  }

  const queryString = query.toString();
  return queryString ? `/tasks?${queryString}` : "/tasks";
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string | string[];
    filter?: string | string[];
    page?: string | string[];
  }>;
}) {
  const { error, filter, page } = await searchParams;
  const activeFilter = getFilter(filter);
  const requestedPage = getPage(page);
  const [listResult, countsResult] = await Promise.all([
    listTasks({
      page: requestedPage,
      status: activeFilter === TaskFilter.ALL ? undefined : activeFilter,
    }),
    getTaskCounts(),
  ]);

  if ("unauthorized" in listResult || "unauthorized" in countsResult) {
    return <Unauthorized />;
  }

  if ("error" in listResult || "error" in countsResult) {
    throw new Error(
      "error" in listResult ? listResult.error : countsResult.error,
    );
  }

  const { pagination, tasks } = listResult.result;
  const { counts } = countsResult;

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Your workspace
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.07em] sm:text-5xl">
            My tasks
          </h1>
          <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            {counts.active} active · {counts.done} done · {counts.total} total
          </p>
        </div>
        <Link
          className="shrink-0 border bg-primary px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-85"
          href="/tasks/new"
        >
          + New todo
        </Link>
      </div>
      <nav
        className="mt-10 flex gap-6 border-b font-mono text-[0.6875rem] uppercase tracking-[0.12em]"
        aria-label="Task filters"
      >
        {Object.values(TaskFilter).map((item) => (
          <Link
            className={`border-b-2 pb-3 ${filter === item ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            href={taskListHref(item, 1)}
            key={item}
          >
            {item}
          </Link>
        ))}
      </nav>

      {typeof error === "string" ? (
        <p className="mt-5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <TasksList visibleTasks={tasks} />

      <nav
        className="mt-8 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground"
        aria-label="Pagination"
      >
        {pagination.page > 1 ? (
          <Link
            className="underline underline-offset-4 hover:text-foreground"
            href={taskListHref(activeFilter, pagination.page - 1)}
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        {pagination.page < pagination.totalPages ? (
          <Link
            className="underline underline-offset-4 hover:text-foreground"
            href={taskListHref(activeFilter, pagination.page + 1)}
          >
            Next →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
