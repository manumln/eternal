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
  
    // Determinar el tema actual
    const appliedTheme = theme === Theme.SYSTEM ? systemTheme : theme;
  
    // Limpiar y aplicar la clase correspondiente
    root.classList.remove(Theme.LIGHT, Theme.DARK);
    root.classList.add(appliedTheme);
  }, [theme]);  

  const changeTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    if (theme !== Theme.SYSTEM) return;
  
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  
    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? Theme.DARK : Theme.LIGHT;
      document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK);
      document.documentElement.classList.add(systemTheme);
    };
  
    mediaQuery.addEventListener("change", handleChange);
  
    // Limpieza del evento al desmontar el componente
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);
  

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
