import Link from "next/link";

export default function NotFoundTask() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
      <section className="w-full max-w-lg p-7 sm:p-10">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Task unavailable
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] sm:text-5xl">
          We couldn&apos;t find that task.
        </h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          It may have been deleted, renamed, or belong to another workspace.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="flex h-12 flex-1 items-center justify-center bg-primary px-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-85"
            href="/tasks"
          >
            View my tasks
          </Link>
          <Link
            className="flex h-12 items-center justify-center border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-muted"
            href="/tasks/new"
          >
            New todo
          </Link>
        </div>
      </section>
    </main>
  );
}
