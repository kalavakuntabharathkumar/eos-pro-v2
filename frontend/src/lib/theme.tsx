import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeSetting = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeSetting;
  effectiveTheme: "light" | "dark";
  setTheme: (t: ThemeSetting) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(effective: "light" | "dark") {
  const root = document.documentElement;
  if (effective === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSetting>(() => {
    const stored = localStorage.getItem("eos_theme") as ThemeSetting | null;
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
    // Migrate old "light"/"dark" values
    return "system";
  });

  const effectiveTheme: "light" | "dark" =
    theme === "system" ? getSystemTheme() : theme;

  useEffect(() => {
    applyTheme(effectiveTheme);
    localStorage.setItem("eos_theme", theme);
  }, [theme, effectiveTheme]);

  // React to OS preference changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: ThemeSetting) => setThemeState(t);

  const toggleTheme = () =>
    setThemeState(prev => {
      const eff = prev === "system" ? getSystemTheme() : prev;
      return eff === "dark" ? "light" : "dark";
    });

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
