import { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import FeedReviewCard from "./FeedReviewCard";
import { toast } from "sonner";

const FollowedReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/followed-reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setReviews(response.data.reviews);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error fetching followed reviews"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl m-auto mt-8 px-6">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
      Reviews You're Following
      </h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <FeedReviewCard key={index} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-500">
          No reviews available to show.
        </div>
      )}
    </section>
  );
};

export default FollowedReviewList;
