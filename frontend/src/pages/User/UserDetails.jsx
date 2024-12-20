import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userRoleState, isAuthenticatedState } from "../../atoms/userData";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiEdit2, FiUserCheck, FiUserMinus, FiUserPlus } from "react-icons/fi";
import { Avatar, Button, Card, Spinner } from "@nextui-org/react";
import { AiFillHeart, AiFillStar } from "react-icons/ai";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
    <div className="max-w-6xl mx-auto py-12 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Profile Section */}
      <div className="space-y-8">
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
              className="w-36 h-36 mx-auto rounded-full shadow-xl"
            />
            <h2 className="text-3xl font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
            {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}{" "}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <StatCard label="Followers" count={user.followers.length} />
              <StatCard label="Following" count={user.following.length} />
            </div>
            {isLoggedIn && loggedInUserId !== userId && (
              <Button
                onClick={toggleFollow}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`mt-4 px-6 py-2 text-white transition-all duration-200 ${
                  isHovering && isFollowing
                    ? "bg-gradient-to-r from-red-500 to-orange-400"
                    : isFollowing
                    ? "bg-gradient-to-r from-green-500 to-teal-400"
                    : "bg-blue-500"
                }`}
              >
                {isHovering && isFollowing ? (
                  <>
                    <FiUserMinus className="mr-2" /> Unfollow
                  </>
                ) : isFollowing ? (
                  <>
                    <FiUserCheck className="mr-2" /> Following
                  </>
                ) : (
                  <>
                    <FiUserPlus className="mr-2" /> Follow
                  </>
                )}
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
      </div>

      {/* Reviews Section */}
      <div className="col-span-2 space-y-8">
        <h3 className="text-2xl font-semibold text-center text-gray-900">
          Reviews of {user.firstName} {user.lastName}
        </h3>
        <div>
          {reviews.length > 0 ? (
            <div className="space-y-6 mt-6">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <EmptyState message="No reviews available." />
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, count }) => (
  <div className="flex flex-col items-center">
    <p className="text-2xl font-semibold text-gray-900">{count}</p>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

const CardContainer = ({ children }) => (
  <Card className="w-full p-6 shadow-lg rounded-lg bg-white">
    {children}
  </Card>
);

const EmptyState = ({ message }) => (
  <div className="text-center text-xl text-gray-500 mt-20">{message}</div>
);

const ReviewCard = ({ review, toggleLike, likedReviews = [] }) => {
  const [isLiked, setIsLiked] = useState(likedReviews.includes(review._id)); // Default to an empty array
  const [likesCount, setLikesCount] = useState(review.likes || 0);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const loggedInUserId = localStorage.getItem("userId");

  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, reviewsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}/reviews`),
        ]);

        setUser(userResponse.data.user);
        setReviews(reviewsResponse.data.reviews);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLikeToggle = () => {
    toggleLike(review._id);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  // Check if user is loaded before rendering
  if (isLoading || !user) {
    return <div>Loading...</div>; // Or render a spinner, or a placeholder, as you prefer
  }

  return (
    <motion.div
      className="flex flex-col p-4 w-full max-w-md mx-auto bg-white rounded-lg shadow-md hover:shadow-xl transition-all"
      whileHover={{ scale: 1.05 }}
    >
      {/* Header: User Info */}
      <div className="flex gap-3">
        <Avatar
          src={user?.profileImage || `https://api.multiavatar.com/${user?._id}.svg`} // Optional chaining added here
          alt="user-avatar"
          className="h-12 w-12 object-cover border-gray-300 cursor-pointer"
        />
        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            {`${user.firstName} ${user.lastName}`}
          </h4>
          <div className="flex items-center">
            {renderStars(review.rating)}
          </div>
          <span className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Song Info */}
      <Card className="flex mt-3 gap-4 w-full max-w-fit pr-6">
      <Link to={`/songs/${review.songId._id}`} className="flex items-center gap-3">
          <img
            src={review.songId.image_url || "/default-image.jpg"}
            alt={review.songId.title}
            className="w-14 h-14 rounded-md object-cover shadow"
          />
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-gray-900">{review.songId.title}</h4>
            <p className="text-xs text-gray-600">{review.songId.artist}</p>
          </div>
        </Link>
      </Card>

      {/* Review Content */}
      <p className="mt-3 text-sm text-gray-700 text-left">{review.content}</p>

      {/* Actions: Likes */}
      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleLikeToggle}
          className={`gap-2 p-2 ${isLiked ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white" : ""}`}
        >
          <AiFillHeart />
          <span>{isLiked ? "Liked" : "Like"}</span>
        </Button>

        <div className="flex items-center gap-1 ml-4">
          <span className="text-sm">{likesCount}</span>
          <AiFillHeart className="text-red-500 text-sm" />
        </div>
      </div>
    </motion.div>
  );
};

const renderStars = (rating) =>
  Array.from({ length: 5 }).map((_, index) => (
    <AiFillStar
      key={index}
      size={14}
      color={rating >= index + 1 ? "gold" : "#E2E8F0"}
    />
  ));



export default UserDetails;
