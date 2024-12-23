import { Button, Card, Spinner } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import logo from "../images/logo.png";
import { useRecoilState, useRecoilValue } from "recoil";
import { isAuthenticatedState, userRoleState } from "@/atoms/userData";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const IntroductionPage = () => {
  const role = useRecoilValue(userRoleState);
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
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="flex flex-col items-center justify-center"
      >
        <Card className="p-10 max-w-lg ">
          <motion.h1
            className="text-5xl font-extrabold tracking-tight mb-4 font-nimbus"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          >
            Welcome to
          </motion.h1>
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Image
              src={logo}
              width={{ base: "160px", md: "200px" }}
              height="auto"
              alt="Logo"
              style={{
                transition: "transform 0.5s ease, opacity 0.3s ease",
              }}
              className="hover:scale-110 hover:opacity-90"
            />
          </motion.div>
          <motion.p
            className="text-lg mt-4 leading-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Immerse yourself in the world of music. Share your thoughts, relive
            your favorite tunes, and connect with a passionate community of
            music lovers.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <Button
              className="w-full sm:w-auto px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/songs")}
            >
              Explore Songs
            </Button>
          </motion.div>
          <motion.div
            className="flex justify-center items-center mt-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                <AiOutlineLogout className="text-lg" />
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg text-lg font-semibold"
              >
                Login
              </Button>
            )}
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <Card className="p-6 mb-4 shadow-md">
    <div className="flex items-start gap-4">
      <img
        src={
          review.userId.profileImage ||
          `https://api.multiavatar.com/${review.userId._id}.svg`
        }
        alt={`${review.userId.firstName}'s avatar`}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h3 className="font-bold">
          {review.userId.firstName} {review.userId.lastName}
        </h3>
        <p className="text-gray-500 text-sm">
          {new Date(review.createdAt).toLocaleString()}
        </p>
        <p className="mt-2">{review.content}</p>
        <p className="text-yellow-500">Rating: {review.rating}/5</p>
      </div>
    </div>
  </Card>
);

export default IntroductionPage;