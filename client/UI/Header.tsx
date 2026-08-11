import Link from "next/link";
import { ThemeToggleButton } from "./ThemeToggleButton";
import HeaderLinks from "./HeaderLinks";

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-5 sm:px-8">
      <HeaderLinks href="/tasks" name="TODO" />
      <nav className="flex gap-5">
        <HeaderLinks href="/tasks" name="TASKS" />
        <HeaderLinks href="/tasks/new" name="NEW TASKS" />
      </nav>
      <ThemeToggleButton />
    </header>
  );
}
