import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import {
  isAuthenticatedState,
  isUserLoadingState,
  userRoleState,
} from "./atoms/userData";
import UserDetailsPage from "./pages/User/UserDetails";
import { Toaster } from "sonner";
import { Spinner } from "@nextui-org/react";
import Feed from "./pages/Feed";
import { ThemeProvider } from "./components/theme-provider";
import LatestReviews from "./pages/LatestReviews";

const AddSongPage = lazy(() => import("./pages/Song/AddSong"));
const HomePage = lazy(() => import("./pages/Home"));
const SongListPage = lazy(() => import("./pages/Song/Songs"));
const SongDetailPage = lazy(() => import("./pages/Song/SongDetails"));
const EditSongPage = lazy(() => import("./pages/Song/EditSong"));
const LoginPage = lazy(() => import("./pages/auth/Login"));
const EditProfilePage = lazy(() => import("./pages/User/EditProfile"));
const SignupPage = lazy(() => import("./pages/auth/Signup"));
const NotFoundPage = lazy(() => import("./pages/Error404"));
const FavouriteSongsPage = lazy(() => import("./pages/Song/FavouriteSongs"));
const UsersPage = lazy(() => import("./pages/User/UsersPage"));

// Loading Spinner Component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center w-full h-screen">
    <Spinner className="animate-spin" />
  </div>
);

const RouteWrapper = ({ page }) => (
  <Suspense fallback={<LoadingIndicator />}>{page}</Suspense>
);

const RouteGuard = ({ children, allowedRoles }) => {
  const currentUserRole = useRecoilValue(userRoleState);
  const isUserLoading = useRecoilValue(isUserLoadingState);
  const isUserAuthenticated = useRecoilValue(isAuthenticatedState);

  if (isUserLoading) return <LoadingIndicator />;
  if (!isUserAuthenticated || !allowedRoles.includes(currentUserRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const appRouter = createBrowserRouter([
  {
    path: "/signup",
    element: <RouteWrapper page={<SignupPage />} />,
  },
  {
    path: "/login",
    element: <RouteWrapper page={<LoginPage />} />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <RouteWrapper page={<HomePage />} /> },
      { path: "/songs", element: <RouteWrapper page={<SongListPage />} /> },
      {
        path: "/songs/add",
        element: (
          <RouteGuard allowedRoles={["admin"]}>
            <RouteWrapper page={<AddSongPage />} />
          </RouteGuard>
        ),
      },
      {
        path: "/favourites",
        element: (
          <RouteGuard allowedRoles={["user", "admin"]}>
            <RouteWrapper page={<FavouriteSongsPage />} />
          </RouteGuard>
        ),
      },
      {
        path: "/feed",
        element: (
          <RouteGuard allowedRoles={["user", "admin"]}>
            <RouteWrapper page={<Feed />} />
          </RouteGuard>
        ),
      },
      {
        path: "/users",
        element: (
          <RouteGuard allowedRoles={["admin"]}>
            <RouteWrapper page={<UsersPage />} />
          </RouteGuard>
        ),
      },
      {
        path: "/users/:userId",
        element: <RouteWrapper page={<UserDetailsPage />} />,
      },
      {
        path: "/users/:userId/edit",
        element: (
          <RouteGuard allowedRoles={["user", "admin"]}>
            <RouteWrapper page={<EditProfilePage />} />
          </RouteGuard>
        ),
      },
      {
        path: "/songs/:id",
        element: <RouteWrapper page={<SongDetailPage />} />,
      },
      {
        path: "/songs/:id/edit",
        element: (
          <RouteGuard allowedRoles={["admin"]}>
            <RouteWrapper page={<EditSongPage />} />
          </RouteGuard>
        ),
      },
      {
        path: "/songs",
        element: <RouteWrapper page={<SongListPage />} />,
      },
      {
        path: "/latest-reviews",
        element: <RouteWrapper page={<LatestReviews />} />,
      },
    ],
  },
  {
    path: "*",
    element: <RouteWrapper page={<NotFoundPage />} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <RecoilRoot>
      <Toaster
        gap="8"
        offset="20px"
        position="top-center"
        theme={"light"}
        richColors
      />
      <RouterProvider router={appRouter} />
    </RecoilRoot>
  </ThemeProvider>
);
