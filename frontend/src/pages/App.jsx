import Header from "@/components/Header";
import useUserData from "@/hooks/useUserData";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "@/ErrorBundary";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

function App() {
  useUserData();

  return (
    <ErrorBoundary>
      <div className="font-sans flex min-h-dvh w-full flex-col dark:bg-zinc-950 dark:text-zinc-50">
        <Header />
        <ErrorBoundary>
          <NextUIProvider>
              <Outlet />
          </NextUIProvider>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

export default App;
