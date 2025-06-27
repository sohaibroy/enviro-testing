"use client";

import * as React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


// Transition for hover 
const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-icon": {
    transition: "color 0.3s ease, transform 0.2s ease",
  },
  "& .MuiRating-iconFilled": {
    transform: "scale(1.2)",
  },
}));

// Renders a styled number icon with dynamic color based on its value when hovered or selected, otherwise grey.
function NumberIconContainer(props) {
  const { value, selected, hovered, ...other } = props;

  const surveyColors = (value) => {
    if (value >= 1 && value <= 4) { return '#FF4C4C' }
    if (value >= 5 && value <= 7) { return '#FFC107' }
    if (value >= 8 && value <= 10) { return '#4CAF50' }
    return "#000";
  }

  const color = hovered || selected ? surveyColors(value) : "#bbb";

  return (
    <span
      {...other}
      style={{
        padding: "0 0.75rem",
        fontSize: "1.25rem",
        color,
        transition: "color 0.3s ease, border 0.3s ease",
      }}
    >
      {value}
    </span>
  );
}

export default function NPSSurvey({ open }) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [rating, setRating] = React.useState(null);
  const [hover, setHover] = React.useState(-1);
  const [feedback, setFeedback] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (rating == null) {
      setError("Please select a rating before submitting.");
      return;
    }
  
    setError("");
    setLoading(true);
  
    try {
      //const response = await fetch("http://localhost/api/feedback", {
      const response = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: rating,
          comment: feedback,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }
  
      const data = await response.json();
      console.log("Feedback submitted successfully:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  if (!open) return null;

  return (
    <div className="bg-white rounded-lg max-w-lg mx-auto">
      {isSubmitted ? (
        <h3 className="text-xl font-bold text-center text-enviro_blue">
          Thank you for your feedback!
        </h3>
      ) : (
        <>
          <h3 className="text-lg font-bold text-center mb-4">
            How likely are you to recommend our services to a friend or colleague?
          </h3>
          <div className="flex justify-center mb-2">
            <StyledRating
              name="nps-rating"
              value={rating}
              max={10}
              IconContainerComponent={(props) => (
                <NumberIconContainer
                  {...props}
                  selected={rating === props.value}
                  hovered={hover === props.value}
                />
              )}
              getLabelText={(value) => `${value}`}
              onChange={(event, newValue) => setRating(newValue)}
              onChangeActive={(event, newHover) => setHover(newHover)}
            />
          </div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="3"
            style={{ color: "#003883", borderColor: "#003883" }}
            className="w-full p-2 mb-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional comments (optional)"
          />
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="py-2 px-4 rounded-md bg-enviro_blue text-white hover:bg-blue-800"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
