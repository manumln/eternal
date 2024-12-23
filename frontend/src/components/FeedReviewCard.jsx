import React, { useState, useEffect } from "react";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import { Avatar, Button, Card, Spinner } from "@nextui-org/react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { likedReviewsState } from "@/atoms/userData";
import { FiMessageCircle } from "react-icons/fi";
import axios from "axios";

const FeedReviewCard = ({ review }) => {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const likedReviews = useRecoilValue(likedReviewsState);
  const [likesCount, setLikesCount] = useState(review.likes || 0);

  useEffect(() => {
    setIsLiked(likedReviews.includes(review?._id));
  }, [review, likedReviews]);

  const toggleLike = async () => {
    if (!!role) {
      setIsLikeLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/songs/${review.songId._id}/reviews/${review._id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setIsLikeLoading(false);
          setIsLiked(!isLiked);
          setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        })
        .catch((error) => toast.error(error.response.data.message))
        .finally(() => setIsLikeLoading(false));
    } else {
      toast.error("You need to be logged in");
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, index) => (
      <AiFillStar
        key={index}
        size={14}
        color={rating >= index + 1 ? "gold" : "#E2E8F0"}
      />
    ));

  return (
    <Card className="flex flex-col p-4 mt-4 w-full max-w-md mx-auto hover:shadow-xl transition-all ease-in-out duration-300">
      {/* Header: User Info */}
      <div className="flex gap-3 mb-4">
        <Link to={`/users/${review.userId._id}`} className="flex items-center gap-2">
          <Avatar
            src={
              review.userId.profileImage ||
              `https://api.multiavatar.com/${review.userId._id}.svg`
            }
            alt="user-avatar"
            className="h-12 w-12 object-cover border-gray-300 cursor-pointer"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              {`${review.userId.firstName} ${review.userId.lastName}`}
            </h4>
            <div className="flex items-center mt-1">{renderStars(review.rating)}</div>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </Link>
      </div>

      {/* Song Info */}
      <Card className="flex mt-3 gap-4 w-full p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md">
        <Link to={`/songs/${review.songId._id}`} className="flex items-center gap-3">
          <img
            src={review.songId.image_url || "/default-image.jpg"}
            alt={review.songId.title}
            className="w-16 h-16 rounded-md object-cover shadow"
          />
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-gray-900">{review.songId.title}</h4>
            <p className="text-xs text-gray-600">{review.songId.artist}</p>
          </div>
        </Link>
      </Card>

      {/* Review Content */}
      <p className="mt-3 text-sm text-gray-700">{review.content}</p>

      {/* Actions: Likes */}
      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="outline"
          className={`gap-2 p-2 transition-all duration-300 ${
            isLiked
              ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
              : "text-gray-600 hover:text-blue-600"
          }`}
          title={isLiked ? "unlike" : "like"}
          onClick={toggleLike}
          disabled={isLikeLoading}
        >
          {isLikeLoading ? (
            <Spinner size="sm" />
          ) : (
            <AiFillHeart />
          )}
          <span className="hidden md:flex">{isLiked ? "Liked" : "Like"}</span>
        </Button>

        <div className="flex items-center gap-1 ml-4">
          <span className="text-sm">{likesCount}</span>
          <AiFillHeart className="text-red-500 text-sm" />
        </div>
      </div>
    </Card>
  );
};

export default FeedReviewCard;
