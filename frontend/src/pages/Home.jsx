import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "@/atoms/userData";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import AlbumStack from "@/components/AlbumStack";

const IntroductionPage = () => {
  const isLoggedIn = useRecoilValue(isAuthenticatedState);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFollowedReviews();
    }
  }, [isLoggedIn]);

  const fetchFollowedReviews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/followed-reviews`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load followed reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden items-center justify-center px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="flex flex-col justify-center text-center md:text-left md:flex-1"
      >
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Welcome to{" "}
          <motion.span
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
            className="animate-wave font-nimbus"
            
          >
            eternal
          </motion.span>
        </h1>
        <p className="text-lg leading-relaxed mb-6 max-w-lg">
          Discover and share your love for music with a vibrant community of enthusiasts.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
          <Button
            className="px-6 py-3 text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-xl rounded-full hover:scale-105 hover:shadow-2xl transition-transform"
            onClick={() => navigate("/songs")}
          >
            Explore Songs
          </Button>
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl rounded-full hover:scale-105 hover:shadow-2xl transition-transform"
            >
              <AiOutlineLogout className="text-lg" /> Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl rounded-full hover:scale-105 hover:shadow-2xl transition-transform"
            >
              Login
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="hidden md:flex md:w-1/2 items-center justify-center max-h-screen"
      >
        <AlbumStack />
      </motion.div>
    </div>
  );
};

export default IntroductionPage;
