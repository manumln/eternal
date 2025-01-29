import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card } from "@nextui-org/react";

const LatestReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reviews/latest`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching latest reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Latest Reviews
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">Loading...</div>
      ) : (
        <motion.div 
          className="flex gap-4 overflow-x-auto w-full max-w-7xl p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {reviews.map((review) => (
            <motion.div key={review.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="w-60 shadow-lg rounded-xl overflow-hidden p-3 bg-white dark:bg-gray-800">
                <img src={review.song.image_url} alt={review.song.title} className="w-full h-32 object-cover rounded-md" />
                <div className="mt-2">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">{review.song.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">by {review.user.name}</p>
                  <p className="text-sm text-yellow-500">⭐ {review.rating}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">{review.comment}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LatestReviews;
