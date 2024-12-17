import { createContext, useContext, useEffect, useState } from "react";

const Theme = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const ThemeContext = createContext({
  theme: Theme.LIGHT,
  setTheme: () => {},
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({
  children,
  defaultTheme = Theme.LIGHT,
  storageKey = "vite-ui-theme",
}) {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(storageKey);
    return storedTheme || defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.DARK
      : Theme.LIGHT;

    // Limpiar clases antiguas
    root.classList.remove(Theme.LIGHT, Theme.DARK);

    // Añadir clase según el tema
    if (theme === Theme.SYSTEM) {
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
