export const ratingIndicators = [
  { key: "speed", label: "Speed" },
  { key: "shooting", label: "Shooting" },
  { key: "passingAccuracy", label: "Passing accuracy" },
  { key: "dribbling", label: "Dribbling" },
  { key: "ballControl", label: "Ball control" },
  { key: "stamina", label: "Stamina" }
] as const;

export type RatingIndicator = (typeof ratingIndicators)[number]["key"];
export type RatingValues = Record<RatingIndicator, number>;
export type PeerRatings = Record<string, Record<string, RatingValues>>;
export const ratingsStorageKey = "korasmart-peer-ratings-v1";
export const defaultRatingValue = 5;

export const emptyRatingValues = ratingIndicators.reduce((acc, indicator) => {
  acc[indicator.key] = defaultRatingValue;
  return acc;
}, {} as RatingValues);

export function normalizeRatingValues(rating?: Partial<RatingValues>): RatingValues {
  return ratingIndicators.reduce((acc, indicator) => {
    const value = rating?.[indicator.key];
    acc[indicator.key] = typeof value === "number" ? value : defaultRatingValue;
    return acc;
  }, {} as RatingValues);
}

export function calculateQuantitativeScore(ratings: Partial<RatingValues>[]) {
  const validRatings = ratings.filter((rating) => ratingIndicators.some((indicator) => typeof rating[indicator.key] === "number"));

  if (!validRatings.length) return null;

  const total = validRatings.reduce((sum, rating) => {
    const normalizedRating = normalizeRatingValues(rating);
    const ratingAverage =
      ratingIndicators.reduce((innerSum, indicator) => innerSum + normalizedRating[indicator.key], 0) /
      ratingIndicators.length;
    return sum + ratingAverage;
  }, 0);

  return Number((total / validRatings.length).toFixed(2));
}
