export const financeSnapshot = {
  currency: "dh",
  balance: 230,
  usedAmount: 2670,
  baselineEffectiveFrom: "2026-07-22T00:00:00+01:00",
  reservedUntil: "2026-08-31",
  reservationNote: "Terrain reserve chaque semaine jusqu'au 31/08/2026",
  contributions: [
    { player: "Nawfal", amount: 300, lastAmount: 300, lastDate: "2026-07-14" },
    { player: "Elhachmi", amount: 300, lastAmount: 300, lastDate: "2026-07-14" },
    { player: "Said", amount: 200, lastAmount: 200, lastDate: "2026-07-14" },
    { player: "Badr", amount: 300, lastAmount: 300, lastDate: "2026-07-14" },
    { player: "Abdou", amount: 200, lastAmount: 200, lastDate: "2026-07-14" },
    { player: "Abdelhamid", amount: 200, lastAmount: 200, lastDate: "2026-07-14" },
    { player: "Ahmed G", amount: 400, lastAmount: 400, lastDate: "2026-07-14" },
    { player: "Ismail", amount: 300, lastAmount: 300, lastDate: "2026-07-14" },
    { player: "Najib", amount: 300, lastAmount: 300, lastDate: "2026-07-22" },
    { player: "Ahmed A", amount: 300, lastAmount: 300, lastDate: "2026-07-22" },
    { player: "Driss", amount: 100, lastAmount: 100, lastDate: "2026-07-14" }
  ]
};

export const formatDh = (amount: number) => `${amount.toLocaleString("fr-MA")} dh`;

export function isAfterFinanceBaseline(createdAt: string) {
  return new Date(createdAt).getTime() >= new Date(financeSnapshot.baselineEffectiveFrom).getTime();
}

export const contributionTotal = financeSnapshot.contributions.reduce(
  (sum, contribution) => sum + contribution.amount,
  0
);
