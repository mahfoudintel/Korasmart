export const ratingIndicators = [
  { key: "speed", label: "Speed" },
  { key: "shooting", label: "Shooting" },
  { key: "dribbling", label: "Dribbling" },
  { key: "ballControl", label: "Ball control" },
  { key: "stamina", label: "Stamina" }
] as const;

export type RatingIndicator = (typeof ratingIndicators)[number]["key"];
export type RatingValues = Record<RatingIndicator, number>;

export const emptyRatingValues = ratingIndicators.reduce((acc, indicator) => {
  acc[indicator.key] = 3;
  return acc;
}, {} as RatingValues);

export function calculateQuantitativeScore(ratings: RatingValues[]) {
  const validRatings = ratings.filter((rating) =>
    ratingIndicators.every((indicator) => typeof rating[indicator.key] === "number")
  );

  if (!validRatings.length) return null;

  const total = validRatings.reduce((sum, rating) => {
    const ratingAverage =
      ratingIndicators.reduce((innerSum, indicator) => innerSum + (rating[indicator.key] ?? 0), 0) /
      ratingIndicators.length;
    return sum + ratingAverage;
  }, 0);

  return Number((total / validRatings.length).toFixed(1));
}
