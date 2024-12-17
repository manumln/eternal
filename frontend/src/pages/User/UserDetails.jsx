import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userRoleState, isAuthenticatedState } from "../../atoms/userData";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiEdit2 } from "react-icons/fi";
import { Avatar, Button, Card, Spinner } from "@nextui-org/react";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const { userId } = useParams();
  const navigate = useNavigate();

  const role = useRecoilValue(userRoleState);
  const isLoggedIn = useRecoilValue(isAuthenticatedState);
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const [userResponse, reviewsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}/reviews`),
        ]);

        const fetchedUser = userResponse.data.user;
        setUser(fetchedUser);
        setReviews(reviewsResponse.data.reviews);
        setIsFollowing(fetchedUser.followers.includes(loggedInUserId));
      } catch (err) {
        toast.error(err.response?.data?.message || "Error loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, loggedInUserId]);

  const toggleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success(response.data.message);
      setIsFollowing(!isFollowing);
      setUser((prevUser) => ({
        ...prevUser,
        followers: isFollowing
          ? prevUser.followers.filter((id) => id !== loggedInUserId)
          : [...prevUser.followers, loggedInUserId],
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error toggling follow status");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <EmptyState message="User Not Found" />;
  }

  const canEdit = isLoggedIn && (loggedInUserId === userId || role === "admin");

  return (
    <div className="flex flex-col items-center p-6 space-y-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <CardContainer>
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar
            src={user.profileImage || `https://api.multiavatar.com/${user._id}.svg`}
            alt="Profile Image"
            className="w-24 h-24 mx-auto rounded-full shadow-lg border-4 border-gray-200 dark:border-zinc-700"
          />
          <h2 className="text-3xl font-semibold text-transparent bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-lg text-gray-500">{user.email}</p>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <StatCard label="Followers" count={user.followers.length} />
            <StatCard label="Following" count={user.following.length} />
          </div>
          {isLoggedIn && loggedInUserId !== userId && (
            <Button
              onClick={toggleFollow}
              className={`mt-4 px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                isFollowing
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </motion.div>
        {canEdit && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate(`/users/${userId}/edit`)}
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md hover:opacity-90 transition-all"
            >
              <FiEdit2 className="mr-2" />
              Edit Profile
            </Button>
          </div>
        )}
      </CardContainer>

      <h3 className="text-2xl font-semibold text-center">
        Reviews of {user.firstName} {user.lastName}
      </h3>
      <CardContainer>
        {reviews.length > 0 ? (
          <div className="space-y-6 mt-6">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState message="No reviews available." />
        )}
      </CardContainer>
    </div>
  );
};

const StatCard = ({ label, count }) => (
  <div className="flex flex-col items-center">
    <p className="text-2xl font-semibold">{count}</p>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

const CardContainer = ({ children }) => (
  <Card
    className="w-full max-w-lg p-6 shadow-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </Card>
);

const EmptyState = ({ message }) => (
  <div className="text-center text-xl mt-20 text-gray-600 dark:text-gray-400">
    {message}
  </div>
);

const ReviewCard = ({ review }) => (
  <motion.div
    className="flex flex-col items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow w-full max-w-md mx-auto"
    whileHover={{ scale: 1.05 }}
  >
    <img
      src={review.songId.image_url}
      alt={review.songId.title}
      className="w-24 h-24 rounded-xl shadow-md mb-6"
    />
    <div className="text-center mb-4">
      <h4 className="font-semibold text-transparent bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text">
        {review.songId.title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {review.songId.artist}
      </p>
    </div>
    <div className="flex justify-center items-center">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`h-5 w-5 ${
            review.rating > index ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
    <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center leading-relaxed">
      {review.content}
    </p>
  </motion.div>
);

export default UserDetails;
