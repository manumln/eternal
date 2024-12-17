import { Spinner } from "@nextui-org/react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ReviewCard from "./ReviewCard";
import { Card } from "@nextui-org/react";
import { toast } from "sonner";
import { AiFillStar } from "react-icons/ai";
import { motion } from "framer-motion";

// Axios instance for reusability and better error handling
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Custom hook to handle reviews fetching and state management
const useReviews = (songId, userReplyCounter) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/songs/${songId}/reviews/`);
        setReviews(response.data.reviews);
        setError(null); // Reset error state if fetching succeeds
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching reviews");
        toast.error(err.response?.data?.message || "Error fetching reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [songId, userReplyCounter]); // Only fetch when `songId` or `userReplyCounter` changes

  // Memoize statistics calculation for performance improvement
  const meta = useMemo(() => {
    const starCounts = [0, 0, 0, 0, 0];
    let totalRating = 0;

    reviews.forEach((review) => {
      starCounts[review.rating - 1]++;
      totalRating += review.rating;
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? (totalRating / totalReviews).toFixed(1)
      : "0";

    return { totalReviews, averageRating, stars: starCounts };
  }, [reviews]);

  return { reviews, meta, isLoading, error };
};

const handleReviewDeleted = (deletedReviewId) => {
  setReviews((prevReviews) => {
    const updatedReviews = prevReviews.filter((review) => review._id !== deletedReviewId);
    console.log("Updated reviews:", updatedReviews);
    return updatedReviews;
  });
};


// Component to render reviews list and statistics
const ReviewList = ({ song, userReplyCounter, setUserReplyCounter }) => {
  const { reviews, meta, isLoading, error } = useReviews(
    song._id,
    userReplyCounter
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Spinner className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section className="w-full max-w-6xl mx-auto mt-8 space-y-6">
      <h2 className="text-3xl font-semibold">
        Community Reviews
      </h2>

      <div className="grid sm:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            title="Total Reviews"
            value={formatNumber(meta.totalReviews)}
            color="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard
            title="Song Rating"
            value={meta.averageRating}
            icon={<AiFillStar size={28} color="gold" />}
            color="yellow"
          />
        </motion.div>
      </div>

      {reviews.length ? (
        reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ReviewCard
              review={review}
              songId={song._id}
              onReviewDeleted={(deletedReviewId) => {
                // Actualiza el estado local eliminando la reseña borrada
                setReviews((prevReviews) =>
                  prevReviews.filter((r) => r._id !== deletedReviewId)
                );
              }}
            />
          </motion.div>
        ))
      ) : (
        <p className="text-xl text-center">No Reviews Yet</p>
      )}
    </section>
  );
};

// Stateless component for displaying statistics
const StatCard = ({ title, value, icon }) => (
  <Card className="flex flex-col items-center p-6 shadow-lg rounded-lg">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="flex items-center gap-2 mt-2">
      <p className={`text-4xl font-bold`}>{value}</p>
      {icon && icon}
    </div>
  </Card>
);

// Helper function to format numbers with commas
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

export default ReviewList;
