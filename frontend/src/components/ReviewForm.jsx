import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button, Textarea } from "@nextui-org/react";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "@/atoms/userData";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/react";
import Rating from "./Rating";

const ReviewSchema = Yup.object().shape({
  content: Yup.string()
    .required("Review content is required")
    .max(500, "Review cannot exceed 500 characters"),
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
});

const Review = ({ song, isEditing, reviewId, handleUserReply }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useRecoilValue(isAuthenticatedState);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      content: "",
      rating: 0,
    },
    validationSchema: ReviewSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const endpoint = isEditing
        ? `${import.meta.env.VITE_BACKEND_URL}/songs/${song._id}/reviews/${reviewId}`
        : `${import.meta.env.VITE_BACKEND_URL}/songs/${song._id}/reviews/`;
      const method = isEditing ? "put" : "post";

      try {
        const response = await axios[method](endpoint, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success(response.data.message);
        handleUserReply();
      } catch (error) {
        if (!isLoggedIn) navigate("/login");
        toast.error(
          isLoggedIn
            ? error.response?.data?.message || "An error occurred"
            : "You need to Login to write a review"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-2 mb-2 p-4">
      <Rating
  value={formik.values.rating}
  onChange={(value) => formik.setFieldValue("rating", value)}
/>


      <div className="space-y-1 sm:col-span-3">
        <label className="text-left text-lg pl-0.5">
          {isEditing ? "Edit the Review" : "Leave a Review"}
        </label>
        <Textarea
          placeholder="Write a brief review of the song..."
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.content && formik.errors.content}
          status={formik.touched.content && formik.errors.content ? "error" : "default"}
        />
      </div>

      {isLoading ? (
        <Button disabled>
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md hover:opacity-90 transition-all"
        >
          {isEditing ? "Edit" : "Post"}
        </Button>
      )}
    </form>
  );
};

export default Review;