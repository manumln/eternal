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
        console.log(response.data); // Verifica la respuesta
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
      <div className="w-full grid items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl m-auto mt-5">
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl">
        Following
      </h2>
      {reviews.length !== 0 ? (
        reviews.map((review, index) => (
          <FeedReviewCard key={index} review={review} />
        ))
      ) : (
        <h3 className="text-2xl tracking-tight">No hay reseñas disponibles</h3>
      )}
    </section>
  );
};

export default FollowedReviewList;
