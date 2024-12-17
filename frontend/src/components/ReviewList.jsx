import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "./ReviewCard";
import { Card, Progress, Spinner } from "@nextui-org/react";
import { formatNumber } from "@/utilities/formatNum";
import { toast } from "sonner";
import { set } from "react-hook-form";
import { AiFillStar } from "react-icons/ai";
import { FiTrendingUp } from "react-icons/fi";

const ReviewList = ({ song, userReplyCounter, setUserReplyCounter }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/songs/${song._id}/reviews/`)
      .then((response) => {
        setReviews(response.data.reviews);
      })
      .catch((err) => toast.error(err.response.data.message))
      .finally(() => setIsLoading(false));
  }, [counter, userReplyCounter]);

  const [meta, setMeta] = useState({
    totalReviews: 4000,
    averageRating: 4.0,
    initialReviews: 3340,
    stars: [50, 200, 300, 1000, 2000],
  });
  const stars = [0, 0, 0, 0, 0];

  useEffect(() => {
    if (!reviews) return;
    let total = 0;
    reviews.map((review) => {
      stars[review.rating - 1]++;
      total += review.rating;
    });
    setMeta({
      totalReviews: reviews.length,
      averageRating: reviews.length === 0 ? 0 : total / reviews.length,
      initialReviews: 1,
      stars: stars,
    });
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="w-full grid items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl m-auto mt-5">
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl">
        Ratings and Reviews
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4 text-sm py-4 my-2">
        <Card className="flex flex-col justify-center p-4 pl-10 sm:pl-4">
          <h3 className="text-md font-bold mb-2">Total Reviews</h3>
          <div className="flex items-center gap-2">
            <p className="text-4xl font-bold">
              {formatNumber(meta.totalReviews)}
            </p>
            <p className="bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full px-3 py-1 font-medium flex items-center gap-1">
              {(
                ((meta.totalReviews - meta.initialReviews) /
                  meta.initialReviews) *
                100
              ).toFixed(0)}
              % <FiTrendingUp size={20} />
            </p>
          </div>
          <p className="text-gray-500/60 text-sm">
            Growth in reviews this year
          </p>
        </Card>
        <Card className="flex flex-col justify-center p-4 pl-10 sm:pl-4">
          <h3 className="text-md font-bold mb-2">Average Rating</h3>
          <div className="flex items-center gap-2">
            <p className="text-4xl font-bold">
              {meta.averageRating.toFixed(1)}
            </p>

            <AiFillStar size={30} color="gold" fill="gold" />
          </div>
          <p className="text-gray-500/60 text-sm">Average Rating this year</p>
        </Card>
      </div>
      {reviews.length !== 0 ? (
        reviews?.map((review, index) => (
          <ReviewCard
            key={index}
            review={review}
            songId={song._id}
            setUserReplyCounter={() =>
              setUserReplyCounter(userReplyCounter + 1)
            }
            handleParentReload={() => setCounter(counter + 1)}
          />
        ))
      ) : (
        <h3 className=" text-2xl tracking-tight">No Reviews</h3>
      )}
    </section>
  );
};

export default ReviewList;