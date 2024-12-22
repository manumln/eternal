import { Button, Card, Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import logo from "../images/logo.png";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState, userRoleState } from "@/atoms/userData";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import FollowedReviewList from "@/components/FollowedReviewList";
import RecentReviewsCarousel from "@/components/RecentReviewsCarousel";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="flex flex-col items-center w-full"
      >
        <div className="w-full overflow-auto">
          <RecentReviewsCarousel />
          <FollowedReviewList />
        </div>
      </motion.div>
    </div>
  );
};

export default IntroductionPage;
