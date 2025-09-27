import React from "react";
import { Sun, Moon, Palette, Heart } from "lucide-react";

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5 text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
      onClick={() => {
        const themes = ["default", "light", "dark", "pink"];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "default" ? <Palette className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : theme === "dark" ? <Moon className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
      <span className="hidden sm:inline capitalize">{theme}</span>
    </button>
  );
}
