import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { formatDate } from "@/utilities/formatDate";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useRecoilValue } from "recoil";
import {
  isUserLoadingState,
  likedCommentsState,
  userIdState,
  userRoleState,
} from "@/atoms/userData";
import { toast } from "sonner";
import { Avatar, Spinner, Textarea } from "@nextui-org/react";
import { AiFillHeart } from "react-icons/ai";
import { FiMessageCircle, FiMessageSquare, FiTrash2 } from "react-icons/fi";

const Commentcard = ({
  comment,
  songId,
  reviewId,
  handleParentReloadReply,
}) => {
  const userId = useRecoilValue(userIdState);
  const role = useRecoilValue(userRoleState);
  const isUserLoading = useRecoilValue(isUserLoadingState);
  const likedComments = useRecoilValue(likedCommentsState);

  // Two ways: comment.replies.count(initial), replies.count(when childrens are added or deleted)
  // is Comment Liked by the User
  const [replyCount, setReplyCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes || 0); // Added likes count
  useEffect(() => {
    setReplyCount(comment.replies.length);
    if (!isUserLoading && comment) {
      setIsLiked(likedComments.includes(comment._id));
      setLikesCount(comment.likes); // Update the likes count
    }
  }, [likedComments, comment]);

  // Trigger for Children to refetch replies
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState();
  const [counter, setCounter] = useState(0);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const handleReloadReply = () => setCounter(counter + 1);
  useEffect(() => {
    if (!showReplies) return;
    const fetchReply = async () => {
      setIsReplyLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/songs/${songId}/reviews/${reviewId}/comments/${comment._id}`
        )
        .then((response) => {
          setReplies(response.data.comments);
          setReplyCount(response.data.comments.length);
        })
        .catch((err) => toast.error(err.response.data.message))
        .finally(() => {
          setIsReplyLoading(false);
        });
    };
    fetchReply();
  }, [showReplies, counter]);

  // Replying a Comment
  const [showForm, setShowForm] = useState(false);
  const [myComment, setMyComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!myComment) {
      toast.error("Please write a comment");
      return;
    }
    setIsLoading(true);
    axios
      .post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/songs/${songId}/reviews/${reviewId}/comments/${comment._id}`,
        { content: myComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        handleParentReloadReply();
        toast.success("Replied successfully");
      })
      .catch((err) => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  // Deleting Comment
  const [open, setOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDelete = async () => {
    setIsDeleteLoading(true);
    axios
      .delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/songs/${songId}/reviews/${reviewId}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        toast.warning("Comment Deleted");
        handleParentReloadReply();
      })
      .catch((err) => toast.error("Something went wrong"))
      .finally(() => {
        setIsDeleteLoading(false);
        setOpen(false);
      });
  };

  // Liking Comments
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const toggleLike = async () => {
    if (!!role) {
      setIsLikeLoading(true);
      axios
        .post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/songs/${songId}/reviews/${reviewId}/comments/${comment._id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setIsLiked(!isLiked);
          setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1)); // Update likes count
        })
        .catch((error) => toast.error(error.response.data.message))
        .finally(() => setIsLikeLoading(false));
    } else {
      setIsLiked(!isLiked);
      toast.error("You need to be logged in");
    }
  };

  return (
    <div className="flex flex-col mt-2">
      <div className="flex items-center h-12 w-full gap-2">
        <Avatar
          src={comment.userId.profileImage}
          alt="user"
          className="h-10 w-10"
        />
        <div className="flex flex-col items-start">
          <h4 className="text-sm font-medium tracking-tight">
            {comment.userId.firstName + " " + comment.userId.lastName}
          </h4>
          <div className="flex items-center">
            <span className="text-gray-500 text-xs ">
              {formatDate(comment.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div
        className={
          showReplies && replyCount > 0 ? "border-l-2 ml-5 pl-6" : "ml-11"
        }
      >
        <blockquote className="italic text-sm ml-1">
          {comment.content}
        </blockquote>

        <div className="flex gap-2 items-center my-2">
          <Button
            variant="outline"
            className={`gap-2 p-2 ${
              isLiked && "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
            }`}
            title={isLiked ? "unlike" : "like"}
            onClick={toggleLike}
          >
            {isLikeLoading ? (
              <Spinner strokeWidth={2.5} opacity={0.5} />
            ) : (
              <AiFillHeart />
            )}
            <span className="hidden md:flex">{isLiked ? "Liked" : "Like"}</span>
          </Button>

          <div className="flex items-center gap-1 ml-4">
            <span className="text-sm">{likesCount}</span>
            <AiFillHeart className="text-red-500 text-sm" />
          </div>

          <Button
            variant="outline"
            className="gap-2 p-2"
            onClick={() => setShowForm(!showForm)}
          >
            <FiMessageSquare />
            <span className="hidden md:flex">Comment</span>
          </Button>

          {replyCount > 0 && (
            <Button
              variant="outline"
              className="gap-2 p-2 "
              onClick={() => setShowReplies(!showReplies)}
            >
              <FiMessageSquare />
              <span className="flex gap-2">
                <span className="hidden md:flex">
                  {showReplies ? "Hide Replies" : "Show Replies"}
                </span>
                <span className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 h-5 w-5 rounded-full">
                  {replyCount}
                </span>
              </span>
            </Button>
          )}

          {(userId === comment.userId._id || role === "admin") && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  title="delete"
                  size="sm"
                  className="flex rounded-full py-2 px-2 gap-2"
                >
                  <FiTrash2 size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-11/12">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    Comment and all the Replies below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" onClick={handleDelete}>
                    {isDeleteLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      <>Delete</>
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="sm:w-3/4 mt-2">
            <Textarea
              placeholder="Comment here..."
              value={myComment}
              onChange={(event) => setMyComment(event.target.value)}
            />
            {isLoading ? (
              <Button disabled className="mt-2 bg-slate-200 text-slate-800">
                <Spinner />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="mt-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white"
              >
                Reply
              </Button>
            )}
          </form>
        )}

        {showReplies && isReplyLoading ? (
          <div className="w-full">
            <Spinner />
          </div>
        ) : (
          showReplies &&
          replies?.map((comment, index) => (
            <Commentcard
              key={index}
              comment={comment}
              songId={songId}
              reviewId={reviewId}
              handleParentReloadReply={handleReloadReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Commentcard;
