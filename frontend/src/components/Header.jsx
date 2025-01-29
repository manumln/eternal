import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineHeart,
  AiOutlineLogout,
  AiOutlineLogin,
} from "react-icons/ai";
import { FiMusic, FiUsers } from "react-icons/fi";
import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isAuthenticatedState,
  userIdState,
  userProfileImageState,
  userRoleState,
} from "@/atoms/userData";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isAuthenticatedState);
  const role = useRecoilValue(userRoleState);
  const userId = useRecoilValue(userIdState);
  const profileImage = useRecoilValue(userProfileImageState);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navLinkClasses = (isActive) =>
    `p-3 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md"
        : "text-gray-500 hover:text-white hover:bg-gray-700"
    }`;

  return (
    <header className="sticky top-0 z-30 bg-transparent backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* User Avatar and Logo */}
        <div className="flex items-center gap-3">
          <NavLink to={`/users/${userId}`} className="pb-0">
            <Avatar
              className="w-12 h-12 mx-auto rounded-full shadow-lg border-2 border-gray-200"
              src={profileImage}
              alt="user avatar"
            />
          </NavLink>
          <motion.div
            className="flex items-center gap-3 text-2xl font-bold text-sky-500 hover:text-sky-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <span className="font-nimbus tracking-wide">eternal.</span>
            </Link>
          </motion.div>
        </div>

        {/* Navigation Links */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
          <Tooltip content="Home">
            <NavLink
              to="/"
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              <AiOutlineHome className="text-2xl" />
            </NavLink>
          </Tooltip>
          <Tooltip content="Favorites">
            <NavLink
              to="/favourites"
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              <AiOutlineHeart className="text-2xl" />
            </NavLink>
          </Tooltip>
          <Tooltip content="Songs">
            <NavLink
              to="/songs"
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              <FiMusic className="text-2xl" />
            </NavLink>
          </Tooltip>

          {role === "admin" && (
            <Tooltip content="Users">
              <NavLink
                to="/users"
                className={({ isActive }) => navLinkClasses(isActive)}
              >
                <FiUsers className="text-2xl" />
              </NavLink>
            </Tooltip>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />
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
        </div>
      </div>
    </header>
  );
};

export default Header;