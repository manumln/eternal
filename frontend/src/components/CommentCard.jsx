import { FiHeart, FiMessageCircle, FiTrash } from "react-icons/fi";
import { AiOutlineComment } from "react-icons/ai";
import { Button, Spinner, Textarea, Avatar } from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import {
  isUserLoadingState,
  likedCommentsState,
  userIdState,
  userRoleState,
} from "@/atoms/userData";

const CommentCard = ({ comment, songId, reviewId, onNewReply }) => {
  const userId = useRecoilValue(userIdState);
  const role = useRecoilValue(userRoleState);
  const likedComments = useRecoilValue(likedCommentsState);
  const isUserLoading = useRecoilValue(isUserLoadingState);

  const [repliesCount, setRepliesCount] = useState(comment.replies.length);
  const [liked, setLiked] = useState(likedComments.includes(comment._id));
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLikeInProgress, setIsLikeInProgress] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (showReplies) fetchReplies();
  }, [showReplies]);

  useEffect(() => {
    setLiked(likedComments.includes(comment._id));
  }, [likedComments, comment]);

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/songs/${songId}/reviews/${reviewId}/comments/${comment._id}`
      );
      setReplies(response.data.comments);
      setRepliesCount(response.data.comments.length);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    setIsSubmittingReply(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/songs/${songId}/reviews/${reviewId}/comments/${comment._id}`,
        { content: replyContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onNewReply();
      toast.success("Reply posted successfully");
    } catch (error) {
    } finally {
      setIsSubmittingReply(false);
      setReplyContent("");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/songs/${songId}/reviews/${reviewId}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Comment deleted");
      onNewReply(); 
    } catch (error) {
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleLike = async () => {
    if (isLikeInProgress) return; 
    if (!role) {
      toast.error("You need to be logged in");
      return;
    }

    setIsLikeInProgress(true);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/songs/${songId}/reviews/${reviewId}/comments/${comment._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLiked((prevLiked) => !prevLiked);
      toast.success(response.data.message || "Comment liked!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like comment");
    } finally {
      setIsLikeInProgress(false);
    }
  };

  return (
    <div className="flex flex-col mt-2">
      <div className="flex items-center gap-2">
      <a
          href={`/users/${comment.userId._id}`}
          className="flex items-center gap-2"
        >
        <Avatar
          src={comment.userId.profileImage}
          alt="user"
          className="h-10 w-10"
        />
        </a>
        <div className="flex flex-col">
        <a
        href={`/users/${comment.userId._id}`}
        className="text-sm font-medium hover:underline"
      >
        {`${comment.userId.firstName} ${comment.userId.lastName}`}
      </a>          <span className="text-gray-500 text-xs">
            {dateFormat(comment.createdAt)}
          </span>
        </div>
      </div>

      <div className={showReplies ? "ml-5 pl-6 border-l-2" : "ml-11"}>
        <blockquote className="text-sm italic">{comment.content}</blockquote>

        <div className="flex gap-2 mt-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            disabled={isLikeInProgress}
            className={`gap-2 p-2 ${liked ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white" : ""}`}
            >
            {isLikeInProgress ? <Spinner size={20} /> : <FiHeart size={20} />}
            <span className="ml-1">{liked ? "Liked" : "Like"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReplies((prev) => !prev)}
            className="p-2"
          >
            <FiMessageCircle size={20} />
            Comment
          </Button>

          {repliesCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplies((prev) => !prev)}
              className="p-2"
            >
              <AiOutlineComment size={20} />
              <span className="ml-1">
                {showReplies ? "Hide Replies" : "Show Replies"}
              </span>
            </Button>
          )}

          {(userId === comment.userId._id || role === "admin") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="p-2"
            >
              {isDeleting ? <Spinner size={20} /> : <FiTrash size={20} />}
              Delete
            </Button>
          )}
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h4 className="text-lg font-bold">Confirm Deletion</h4>
              <p>Are you sure you want to delete this comment?</p>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => setConfirmDelete(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? <Spinner size={20} /> : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {showReplies && (
          <div>
            {loadingReplies ? (
              <Spinner size={20} />
            ) : (
              replies.map((reply, index) => (
                <CommentCard
                  key={index}
                  comment={reply}
                  songId={songId}
                  reviewId={reviewId}
                  onNewReply={onNewReply}
                />
              ))
            )}
          </div>
        )}

        {showReplies && !loadingReplies && repliesCount === 0 && (
          <p className="text-sm text-gray-500 mt-2">No replies yet.</p>
        )}

        {showReplies && (
          <form onSubmit={handleReplySubmit} className="mt-3">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
            />
            <Button
              type="submit"
              className="mt-2"
              disabled={isSubmittingReply || !replyContent.trim()}
            >
              {isSubmittingReply ? <Spinner size={20} /> : "Post Reply"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
