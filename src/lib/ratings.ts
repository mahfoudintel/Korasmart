export const ratingIndicators = [
  { key: "attack", label: "Attack", helper: "Shooting, finishing, goal threat" },
  { key: "technique", label: "Technique", helper: "Control, dribbling, passing quality" },
  { key: "fitness", label: "Fitness", helper: "Speed, stamina, intensity" },
  { key: "teamPlay", label: "Team Play", helper: "Positioning, defending, decisions" }
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
  const legacyRating = rating as Partial<RatingValues> & {
    speed?: number;
    shooting?: number;
    passingAccuracy?: number;
    dribbling?: number;
    ballControl?: number;
    stamina?: number;
  } | undefined;

  return ratingIndicators.reduce((acc, indicator) => {
    const value = rating?.[indicator.key];
    if (typeof value === "number") {
      acc[indicator.key] = value;
      return acc;
    }

    if (legacyRating) {
      if (indicator.key === "attack" && typeof legacyRating.shooting === "number") {
        acc[indicator.key] = legacyRating.shooting;
        return acc;
      }

      if (indicator.key === "technique") {
        const values = [legacyRating.passingAccuracy, legacyRating.dribbling, legacyRating.ballControl].filter(
          (legacyValue): legacyValue is number => typeof legacyValue === "number"
        );
        if (values.length) {
          acc[indicator.key] = Number((values.reduce((sum, legacyValue) => sum + legacyValue, 0) / values.length).toFixed(2));
          return acc;
        }
      }

      if (indicator.key === "fitness") {
        const values = [legacyRating.speed, legacyRating.stamina].filter(
          (legacyValue): legacyValue is number => typeof legacyValue === "number"
        );
        if (values.length) {
          acc[indicator.key] = Number((values.reduce((sum, legacyValue) => sum + legacyValue, 0) / values.length).toFixed(2));
          return acc;
        }
      }

      if (indicator.key === "teamPlay" && typeof legacyRating.passingAccuracy === "number") {
        acc[indicator.key] = legacyRating.passingAccuracy;
        return acc;
      }
    }

    acc[indicator.key] = defaultRatingValue;
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
