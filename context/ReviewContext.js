import { createContext, useContext, useState } from "react";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  // { restaurantId: [{ id, rating, comment, author, createdAt }] }
  const [reviewsByRestaurant, setReviewsByRestaurant] = useState({});

  const addReview = (restaurantId, { rating, comment, author = "Guest" }) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      rating,
      comment,
      author,
      createdAt: new Date().toISOString(),
    };
    setReviewsByRestaurant((prev) => ({
      ...prev,
      [restaurantId]: [...(prev[restaurantId] || []), newReview],
    }));
  };

  const getReviews = (restaurantId) => reviewsByRestaurant[restaurantId] || [];

  const getAverageRating = (restaurantId) => {
    const reviews = getReviews(restaurantId);
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  };

  return (
    <ReviewContext.Provider
      value={{ reviewsByRestaurant, addReview, getReviews, getAverageRating }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export const useReview = () => useContext(ReviewContext);