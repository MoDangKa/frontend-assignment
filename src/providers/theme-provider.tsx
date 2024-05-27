"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Themes = "dark" | "light";
type ThemeState = {
  theme: Themes;
  toggleTheme: () => void;
};

const themeKey = "color-theme";

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider(props: PropsWithChildren) {
  const [theme, setTheme] = useState<Themes>("light");

  function set(newTheme: Themes) {
    localStorage.setItem(themeKey, newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem(themeKey);
    const systemPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (storedTheme) {
      set(storedTheme as Themes);
    } else {
      set(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  function toggleTheme() {
    set(theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
