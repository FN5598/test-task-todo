"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggleButton() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") {
      setTheme("dark");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }

  return (
    <button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="grid size-9 place-items-center border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "light" ? (
        <Moon aria-hidden="true" size={16} />
      ) : (
        <Sun aria-hidden="true" size={16} />
      )}
    </button>
  );
}
