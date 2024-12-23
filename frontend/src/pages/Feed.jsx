import { Button, Card, Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import logo from "../images/logo.png";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState, userRoleState } from "@/atoms/userData";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import FollowedReviewList from "@/components/FollowedReviewList";
import RecentReviewsCarousel from "@/components/RecentReviewsCarousel";
import { toast } from "react-toastify";

const Feed = () => {
  const role = useRecoilValue(userRoleState);
  const isLoggedIn = useRecoilValue(isAuthenticatedState);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start ">

      {/* Content Sections */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-full max-w-6xl flex flex-col items-center space-y-8"
      >
        {/* Recent Reviews Carousel */}
        <div className="w-full">
          <RecentReviewsCarousel />
        </div>

        {/* Followed Reviews List */}
        <div className="w-full">
          <FollowedReviewList />
        </div>
      </motion.div>

    </div>
  );
};

export default Feed;
