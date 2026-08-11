import { cookies } from "next/headers";
import { ThemeToggleButton } from "./ThemeToggleButton";
import HeaderLinks from "./HeaderLinks";
import { signOutAction } from "@app/auth/actions";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("access_token")?.value);

  return (
    <header className="flex h-14 items-center justify-between border-b px-5 sm:px-8">
      <HeaderLinks href="/tasks" name="TODO" />
      <nav className="flex gap-5">
        <HeaderLinks href="/tasks" name="TASKS" />
        <HeaderLinks href="/tasks/new" name="NEW TASKS" />
      </nav>
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <form action={signOutAction}>
            <button
              className="h-9 cursor-pointer bg-foreground px-3 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-85"
              type="submit"
            >
              Sign out
            </button>
          </form>
        ) : null}
        <ThemeToggleButton />
      </div>
    </header>
  );
}
