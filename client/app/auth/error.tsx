"use client";

type AuthErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AuthErrorPage({ error, reset }: AuthErrorPageProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
      <section className="w-full max-w-lg border p-7 sm:p-10">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Authentication unavailable
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] sm:text-5xl">
          We couldn&apos;t load authentication.
        </h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          Please try again in a moment.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Error reference: {error.digest}
          </p>
        ) : null}
        <button
          className="mt-8 h-12 w-full cursor-pointer bg-primary px-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-85"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
