import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@nextui-org/react";

const ReviewsFeed = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedReviews = async () => {
      try {
        const { data } = await axios.get("/api/reviews/feed", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching followed reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedReviews();
  }, []);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <Card key={review._id} className="mb-4">
          <div>
            <h3>{review.songId.title} - {review.songId.artist}</h3>
            <p>{review.content}</p>
            <small>By: {review.userId.firstName} {review.userId.lastName}</small>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsFeed;
