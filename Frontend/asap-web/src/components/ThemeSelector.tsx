"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes: Theme[] = ["system", "light", "dark"];

  const icons = {
    light: Sun,
    dark: Moon,
    system: Laptop,
  };

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme as Theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div className='flex items-center justify-between hover:bg-muted transition-colors px-2 py-1 rounded-md'>
      <span onClick={cycleTheme} className='flex-grow'>
        Theme
      </span>
      <div className='flex gap-2 items-center'>
        {themes.map((t) => {
          const Icon = icons[t as Theme];
          return (
            <div
              key={t}
              className={cn(
                "flex items-center gap-2 rounded-full p-1 transition-colors",
                t === theme
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
              onClick={() => setTheme(t as Theme)}>
              <Icon
                size={18}
                className='hover:scale-110 transition-transform'
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
