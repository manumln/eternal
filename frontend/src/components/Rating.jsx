import React from "react";
import { Rating as MuiRating } from "@mui/material";

const Rating = ({ value, onChange }) => {
  const handleRatingChange = (_, newValue) => {
    onChange(newValue || 0);
  };

  return (
    <div className="flex items-center gap-2">
      <MuiRating
        name="rating"
        value={value}
        onChange={handleRatingChange}
        size="large"
        precision={1}
        sx={{
          fontSize: "2rem",
          "& .MuiRating-iconFilled": {
            color: "#ffcc00",
          },
          "& .MuiRating-iconHover": {
            color: "#ffa726",
          },
        }}
        aria-label={`Rating: ${value} stars`}
      />
      <span className="text-sm">
        {value ? `${value} Star${value > 1 ? "s" : ""}` : "No rating"}
      </span>
    </div>
  );
};

export default Rating;
