import { Button } from "@nextui-org/react";
import Commentcard from "./CommentCard";
import { useEffect, useState } from "react";
import { Avatar, Card, Spinner, Textarea } from "@nextui-org/react";
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
  likedReviewsState,
  userIdState,
  userRoleState,
} from "@/atoms/userData";
import { toast } from "sonner";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import { FiMessageSquare, FiTrash2 } from "react-icons/fi";

const ReviewCard = ({
  review,
  songId,
  handleParentReload,
  setUserReplyCounter,
}) => {
  const userId = useRecoilValue(userIdState);
  const role = useRecoilValue(userRoleState);
  const likedReviews = useRecoilValue(likedReviewsState);

  // Usefull when Children are added or deleted
  const [replyCount, setReplyCount] = useState(0);
  useEffect(() => {
    setReplyCount(review.comments.length);
    setIsLiked(likedReviews.includes(review?._id));
  }, [review, likedReviews]);

  // Liking Reply
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const toggleLike = async () => {
    if (!!role) {
      setIsLikeLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/songs/${songId}/reviews/${
            review._id
          }/like`,
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
        })
        .catch((error) => toast.error(error.response.data.message))
        .finally(() => setIsLikeLoading(false));
    } else {
      setIsLiked(!isLiked);
      toast.error("You need to be logged in");
    }
  };

  // Trigger for Children to refetch Replies
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState();
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const handleReload = () => setCounter(counter + 1);
  useEffect(() => {
    if (!showReplies) return;
    setIsReplyLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/songs/${songId}/reviews/${
          review._id
        }/comments/`
      )
      .then((response) => {
        setReplies(response.data.comments);
        setReplyCount(response.data.comments.length);
      })
      .catch((err) => toast.error("User can only have 1 review"))
      .finally(() => setIsReplyLoading(false));
  }, [showReplies, counter]);

  // Deleting Review
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    setIsDeleteLoading(true);
    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/songs/${songId}/reviews/${
          review._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (userId === review.userId._id) setUserReplyCounter(-1);
        handleParentReload();
        toast.warning(response.data.message);
      })
      .catch((err) => toast.error(err.response.data.message))
      .finally(() => {
        setIsDeleteLoading(false);
        setOpen(false);
      });
  };

  // Commenting on Reviews
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment) {
      toast.error("Please write a comment");
      return;
    }
    setIsLoading(true);
    const promise = axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/songs/${songId}/reviews/${
        review._id
      }/comments`,
      { content: comment },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.promise(promise, {
      loading: "Loading...",
      success: (response) => {
        handleParentReload();
        return response.data.message;
      },
      error: (error) => error.response.data.message,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <Card className="flex flex-col p-3 sm:p-4 mt-4 w-full overflow-y-auto">
      <div className="flex items-center w-full gap-2 pb-2">
        <Avatar
          src={review.userId.profileImage}
          alt="user"
          className="h-10 w-10"
        />
        <div className="flex flex-col items-start">
          <h4 className="text-lg font-medium tracking-tight">
            {review.userId.firstName + " " + review.userId.lastName}
          </h4>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <AiFillStar
                size={15}
                key={index}
                color={review.rating >= index + 1 ? "gold" : "#E2E8F0"}
                fill={review.rating >= index + 1 ? "gold" : "#E2E8F0"}
              />
            ))}
            <span className="text-gray-500 text-sm ml-3">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <div
        className={
          showReplies && replyCount > 0
            ? "border-l-2 ml-5 pl-6 sm:ml-6 sm:pl-7"
            : ""
        }
      >
        <blockquote className="ml-1 mb-2 sm:mb-4 italic text-sm sm:text-base">
          {review.content}
        </blockquote>
        <div className="flex gap-2 items-center">
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
                <span className="flex items-center justify-center bg-slate-200 text-slate-600 p-3 h-5 w-5 rounded-full">
                  {replyCount}
                </span>
              </span>
            </Button>
          )}
          {(role === "admin" || userId === review.userId._id) && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex ml-auto py-2 px-2 gap-2"
                >
                  <FiTrash2 />
                  <span className="hidden md:flex">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-11/12">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    Review and all the Replies below.
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
              placeholder="Comment here ..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            {isLoading ? (
              <Button disabled className="mt-2 bg-slate-200 text-slate-800">
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="mt-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white">
                Reply
              </Button>
            )}
          </form>
        )}

        {showReplies && isReplyLoading ? (
          <div className="w-full">
            <Spinner className="mx-auto h-10 w-10 animate-spin" />
          </div>
        ) : (
          showReplies &&
          replies?.map((comment, index) => (
            <Commentcard
              key={index}
              comment={comment}
              songId={songId}
              reviewId={review._id}
              handleParentReloadReply={handleReload}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default ReviewCard;
