import Link from "next/link";

export default function Unauthorized() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
      <section className="w-full max-w-lg p-7 sm:p-10">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Tasks unavailable
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] sm:text-5xl">
          Please Login to View your tasks.
        </h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
          repellat, assumenda sit laborum tempora in nisi amet neque hic maxime
          corrupti magnam similique ab nobis distinctio, nihil veritatis dicta.
          Quia?
        </p>
        <div className="mt-8">
          <Link
            className="flex h-12 w-full items-center justify-center bg-primary px-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-85"
            href="/auth?tab=login"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
