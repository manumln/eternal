import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, Button, Card, Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FiHeart, FiMoreVertical, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";

const UserCard = ({ user, loggedInUserId, handleReload }) => {
  const [isFollowing, setIsFollowing] = useState(user.followers.includes(loggedInUserId));
  const [isLoading, setIsLoading] = useState(false);

  if (!user || !user._id) return null;

  const toggleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user._id}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success(response.data.message);
      setIsFollowing(!isFollowing);

      // Actualiza la lista de usuarios si handleReload está definido
      if (handleReload) handleReload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error toggling follow status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link to={`/users/${user._id}`}>
        <Card hoverable className="p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 p-2">
            {/* User avatar */}
            <Avatar
              className="w-20 h-20 rounded-full shadow-lg border-4"
              src={user.profileImage}
              alt={`${user.firstName}'s Avatar`}
            />
            <div>
              <p className="text-xl font-nimbus">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Stats section */}
          <motion.div
            className="mt-6 grid grid-cols-2 gap-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard
              icon={<FiHeart size={20} />}
              label="Followers"
              count={user.followers.length}
            />
            <StatCard
              icon={<FiStar size={20} />}
              label="Following"
              count={user.following.length}
            />
          </motion.div>

          {/* Follow/Unfollow button */}
          <div className="mt-4 flex justify-center">
            <Button
              onClick={toggleFollow}
              className={`px-4 py-2 rounded-lg shadow-md text-white transition-all duration-200 ${
                isFollowing
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>

          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-opacity-50 flex justify-center items-center rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Spinner className="animate-spin text-blue-600 h-8 w-8" />
            </motion.div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
};

// StatCard component
const StatCard = ({ icon, label, count }) => (
  <motion.div
    className="flex flex-col items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
      {icon} {count}
    </span>
    <p className="text-sm text-gray-500">{label}</p>
  </motion.div>
);

export default UserCard;
