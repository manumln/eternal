import { Button, Card, Spinner } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import logo from "../images/logo.png";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState, userRoleState } from "@/atoms/userData";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import ReviewsFeed from "@/components/ReviewsFeed";

const IntroductionPage = () => {
  const role = useRecoilValue(userRoleState);
  const isLoggedIn = useRecoilValue(isAuthenticatedState);
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <Card className="p-10 max-w-lg">
          <motion.h1
            className="text-5xl font-extrabold tracking-tight mb-4"
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
        <ReviewsFeed />
      </motion.div>
    </div>
  );
};

export default IntroductionPage;
