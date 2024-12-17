import { Avatar, Button, Card, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { Textarea } from "@nextui-org/react";
import dateFormat from "dateformat";
import axios from "axios";
import { useRecoilValue } from "recoil";
import {
  likedReviewsState,
  userIdState,
  userRoleState,
} from "@/atoms/userData";
import { toast } from "sonner";
import { FiHeart, FiTrash } from "react-icons/fi";
import { AiFillStar, AiOutlineComment } from "react-icons/ai";

const ReviewCard = ({
  review,
  songId,
  onReviewUpdated,
  incrementReplyCount,
}) => {
  const userId = useRecoilValue(userIdState);
  const role = useRecoilValue(userRoleState);
  const likedReviews = useRecoilValue(likedReviewsState);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [repliesList, setRepliesList] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/songs/${songId}/reviews/${
          review._id
        }/comments/`
      );
      setRepliesList(data.comments);
      setLikesCount(data.comments.length);
    } catch (error) {
      toast.error("Failed to load replies.");
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleLike = async () => {
    if (!role) return toast.error("You must be logged in.");
    setLoadingLike(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/songs/${songId}/reviews/${
          review._id
        }/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error liking the review");
    } finally {
      setLoadingLike(false);
    }
  };

  const handleDeleteReview = async () => {
    setLoadingComment(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/songs/${songId}/reviews/${
          review._id
        }`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Deleted review ID:", review._id);
      if (typeof onReviewDeleted === "function") {
        onReviewDeleted(review._id);
      }

      toast.success("Review deleted successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting the review."
      );
    } finally {
      setLoadingComment(false);
      setDeleteDialogOpen(false);
    }
  };

  const handlePostComment = async (event) => {
    event.preventDefault();
    if (!commentText) return toast.error("Comment cannot be empty.");
    setLoadingComment(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/songs/${songId}/reviews/${
          review._id
        }/comments`,
        { content: commentText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Comment posted successfully.");
      onReviewUpdated();
    } catch (error) {
    } finally {
      setLoadingComment(false);
    }
  };

  useEffect(() => {
    setLikesCount(review.comments.length);
    setLiked(likedReviews.includes(review._id));
  }, [review, likedReviews]);

  useEffect(() => {
    if (repliesVisible) fetchReplies();
  }, [repliesVisible]);

  return (
    <Card className="flex flex-col p-3 sm:p-4 mt-4 w-full overflow-y-auto">
      <div className="flex items-center gap-2 pb-2">
        <a
          href={`/users/${review.userId._id}`}
          className="flex items-center gap-2"
        >
          <Avatar
            alt="Profile"
            src={review.userId.profileImage}
            className="h-12 w-12 cursor-pointer"
          />
        </a>
        <div className="flex flex-col items-start">
          <a
            href={`/users/${review.userId._id}`}
            className="text-lg font-medium hover:underline"
          >
            {`${review.userId.firstName} ${review.userId.lastName}`}
          </a>{" "}
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <AiFillStar
                key={index}
                size={15}
                color={review.rating >= index + 1 ? "gold" : "#E2E8F0"}
              />
            ))}
            <span className="text-gray-500 text-sm ml-3">
              {dateFormat(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <blockquote className="ml-1 mb-2 sm:mb-4 italic text-sm sm:text-base">
        {review.content}
      </blockquote>

      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          onClick={handleLike}
          className={`gap-2 p-2 ${
            liked ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white" : ""
          }`}
        >
          {loadingLike ? <Spinner /> : <FiHeart />}
          <span className="hidden md:flex">{liked ? "Liked" : "Like"}</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setRepliesVisible(!repliesVisible)}
          className="gap-2 p-2"
        >
          <AiOutlineComment />
          <span className="hidden md:flex">
            {repliesVisible ? "Hide Replies" : "Show Replies"}
          </span>
          {likesCount > 0 && (
            <span className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md text-slate-600 p-3 h-5 w-5 rounded-full">
              {likesCount}
            </span>
          )}
        </Button>

        {(role === "admin" || userId === review.userId._id) && (
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="ml-auto py-2 px-2 gap-2"
          >
            <FiTrash />
            <span className="hidden md:flex">Delete</span>
          </Button>
        )}
      </div>

      {repliesVisible && loadingReplies ? (
        <Spinner />
      ) : (
        repliesVisible &&
        repliesList.map((comment, index) => (
          <CommentCard
            key={index}
            comment={comment}
            songId={songId}
            reviewId={review._id}
            onCommentUpdate={() => {}}
          />
        ))
      )}

      <form onSubmit={handlePostComment} className="sm:w-3/4 mt-2">
        <Textarea
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          type="submit"
          variant="outline"
          className="mt-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white"
        >
          Post
        </Button>
      </form>

      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold">Are you sure?</h3>
            <p className="my-4">
              Deleting this review will remove it permanently.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteReview}>
                {loadingComment ? <Spinner /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReviewCard;
