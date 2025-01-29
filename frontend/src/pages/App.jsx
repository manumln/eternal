import Header from "@/components/Header";
import useUserData from "@/hooks/useUserData";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "@/ErrorBundary";
import {NextUIProvider} from "@nextui-org/react";

function App() {
  useUserData();

  return (
    <ErrorBoundary>
        <Header />
        <ErrorBoundary>
          <NextUIProvider>
              <Outlet />
          </NextUIProvider>
        </ErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;
