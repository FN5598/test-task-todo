import Link from "next/link";

type CreateTodoFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
};

export default function CreateTodoForm({ action, error }: CreateTodoFormProps) {
  return (
    <form action={action} className="mt-10 grid gap-6">
      <label
        className="grid gap-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.13em] text-muted-foreground"
        htmlFor="title"
      >
        Title
        <input
          className="h-12 border bg-card px-3 text-base normal-case tracking-normal text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          id="title"
          name="title"
          placeholder="What needs to be done?"
          required
        />
      </label>

      <label
        className="grid gap-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.13em] text-muted-foreground"
        htmlFor="description"
      >
        Description{" "}
        <span className="normal-case tracking-normal">(optional)</span>
        <textarea
          className="min-h-36 resize-y border bg-card px-3 py-3 text-base normal-case tracking-normal text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          id="description"
          name="description"
          placeholder="Add more detail..."
        />
      </label>

      <label
        className="grid gap-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.13em] text-muted-foreground"
        htmlFor="status"
      >
        Status
        <select
          className="h-12 border bg-card px-3 text-base normal-case tracking-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue="todo"
          id="status"
          name="status"
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </label>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="h-12 flex-1 cursor-pointer bg-primary px-4 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          type="submit"
        >
          Create todo →
        </button>
        <Link
          className="flex h-12 items-center justify-center border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-muted"
          href="/tasks"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
