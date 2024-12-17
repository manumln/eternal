import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineHeart, AiOutlineLogout, AiOutlineLogin } from "react-icons/ai";
import { FiMusic, FiUsers } from "react-icons/fi";
import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { ModeToggle } from "./mode-toggle";
import { useRecoilState, useRecoilValue } from "recoil";
import { isAuthenticatedState, userIdState, userProfileImageState, userRoleState } from "@/atoms/userData";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import axios from "axios";
import clsx from "clsx";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isAuthenticatedState);
  const role = useRecoilValue(userRoleState);
  const userId = useRecoilValue(userIdState);
  const [user, setUser] = useState(null);
  const profileImage = useRecoilValue(userProfileImageState);

  useEffect(() => {
    if (isLoggedIn && userId) {
      // Asegúrate de que el token esté siendo pasado correctamente en los headers
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          console.log("User data fetched:", response.data); // Asegúrate de que esta respuesta tiene la propiedad profileImage
          setUser(response.data); // Aquí seteamos el estado con toda la información de usuario
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data.");
        });
    }
  }, [isLoggedIn, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navLinkClasses = (isActive) =>
    twMerge(
      "p-3 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
      isActive
        ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md"
        : "text-gray-300 hover:text-white hover:bg-blue-100 dark:hover:bg-zinc-700 dark:text-zinc-400"
    );

  console.log("Token:", localStorage.getItem("token"));
  console.log("User profile image:", user?.profileImage); // Verifica si realmente tienes la propiedad profileImage

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-500 to-teal-500 dark:from-zinc-900 dark:to-zinc-800 shadow-lg backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* User Avatar and Logo */}
        <div className="flex items-center gap-3">
          <NavLink to={`users/${userId}`} className="pb-0">
            <Avatar
              className={clsx(
                "w-12 h-12 mx-auto rounded-full shadow-lg",
                "border-2",
                "border-gray-200 dark:border-zinc-700"
              )}
              src={profileImage} // Usar el estado global
              alt="user avatar"
            />
          </NavLink>
          <motion.div
            className="flex items-center gap-3 text-2xl font-bold text-white hover:text-teal-300 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <span className="font-nimbus tracking-wide">eternal.</span>
            </Link>
          </motion.div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Tooltip content="Home">
            <NavLink to="/" className={({ isActive }) => navLinkClasses(isActive)}>
              <AiOutlineHome className="text-2xl" />
            </NavLink>
          </Tooltip>
          <Tooltip content="Favorites">
            <NavLink to="/favourites" className={({ isActive }) => navLinkClasses(isActive)}>
              <AiOutlineHeart className="text-2xl" />
            </NavLink>
          </Tooltip>
          <Tooltip content="Songs">
            <NavLink to="/songs" className={({ isActive }) => navLinkClasses(isActive)}>
              <FiMusic className="text-2xl" />
            </NavLink>
          </Tooltip>
          {role === "admin" && (
            <Tooltip content="Users">
              <NavLink to="/users" className={({ isActive }) => navLinkClasses(isActive)}>
                <FiUsers className="text-2xl" />
              </NavLink>
            </Tooltip>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Tooltip content="Log Out">
              <Button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                <AiOutlineLogout className="text-lg" />
                Logout
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="Log In">
              <Button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all"
              >
                <AiOutlineLogin className="text-lg" />
                Login
              </Button>
            </Tooltip>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
