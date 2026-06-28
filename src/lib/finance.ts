export const financeSnapshot = {
  currency: "dh",
  balance: -170,
  reservedUntil: "2026-07-27",
  reservationNote: "Terrain reserve chaque semaine jusqu'au 27/07/2026",
  contributions: [
    { player: "Nawfal", amount: 300 },
    { player: "Elhachmi", amount: 300 },
    { player: "Said", amount: 200 },
    { player: "Badr", amount: 300 },
    { player: "Abdou", amount: 200 },
    { player: "Abdelhamid", amount: 100 },
    { player: "Ahmed G", amount: 200 },
    { player: "Ismail", amount: 200 },
    { player: "Najib", amount: 100 },
    { player: "Ahmed A", amount: 100 },
    { player: "Driss", amount: 100 }
  ]
};

export const formatDh = (amount: number) => `${amount.toLocaleString("fr-MA")} dh`;

export const contributionTotal = financeSnapshot.contributions.reduce(
  (sum, contribution) => sum + contribution.amount,
  0
);
