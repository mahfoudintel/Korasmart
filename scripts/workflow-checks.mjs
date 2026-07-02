import assert from "node:assert/strict";

const bookingCostAmount = -80;

function reservationOpenAt(date) {
  const gameDate = new Date(`${date}T00:00:00`);
  const openDate = new Date(gameDate);
  openDate.setDate(gameDate.getDate() - 1);
  openDate.setHours(11, 0, 0, 0);
  return openDate;
}

function reservationEndAt(reservation) {
  return new Date(new Date(`${reservation.date}T${reservation.time}:00`).getTime() + reservation.durationMinutes * 60 * 1000);
}

function reservationStatus(reservation, now) {
  if (reservationEndAt(reservation).getTime() <= now.getTime()) return "completed";
  if (reservation.reservationStatus === "open") return "open";
  if (reservation.reservationStatus === "completed") return "completed";
  return reservationOpenAt(reservation.date).getTime() <= now.getTime() ? "open" : "closed";
}

function recordBookingCost(transactions, bookingId) {
  if (transactions.some((transaction) => transaction.type === "booking_cost" && transaction.bookingId === bookingId)) return transactions;
  return [...transactions, { id: `cost-${bookingId}`, type: "booking_cost", bookingId, amount: bookingCostAmount }];
}

function reverseBookingCost(transactions, bookingId) {
  const cost = transactions.find((transaction) => transaction.type === "booking_cost" && transaction.bookingId === bookingId);
  if (!cost) return transactions;
  if (transactions.some((transaction) => transaction.type === "booking_cost_reversal" && transaction.reversedTransactionId === cost.id)) return transactions;
  return [...transactions, { id: `reversal-${bookingId}`, type: "booking_cost_reversal", bookingId, amount: Math.abs(cost.amount), reversedTransactionId: cost.id }];
}

function normalizeRole(role) {
  if (role === "admin") return "admin";
  if (role === "budgeting_booking_officer" || role === "finance" || role === "booking") return "budgeting_booking_officer";
  return "player";
}

function canManageMoney(role) {
  return role === "admin" || role === "budgeting_booking_officer";
}

function notificationIdsFor(reservation, currentStatus, now) {
  const ids = [`reservation-${reservation.id}`];
  if (!currentStatus && reservationStatus(reservation, now) === "open") ids.push(`reservation-open-${reservation.id}`);
  return [...new Set(ids)];
}

function canReadPrivateChat(message, playerName) {
  if (message.conversationId === "team") return true;
  return [message.playerName, ...message.recipients].includes(playerName);
}

function localMinuteStamp(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

const mondayGame = { id: "res-2026-07-06", date: "2026-07-06", time: "20:00", durationMinutes: 60 };
assert.equal(localMinuteStamp(reservationOpenAt(mondayGame.date)), "2026-07-05T11:00");
assert.equal(reservationStatus(mondayGame, new Date("2026-07-05T10:59:00")), "closed");
assert.equal(reservationStatus(mondayGame, new Date("2026-07-05T11:00:00")), "open");
assert.equal(reservationStatus(mondayGame, new Date("2026-07-06T21:01:00")), "completed");

let transactions = [];
transactions = recordBookingCost(transactions, mondayGame.id);
transactions = recordBookingCost(transactions, mondayGame.id);
assert.equal(transactions.reduce((sum, item) => sum + item.amount, 0), -80);
transactions = reverseBookingCost(transactions, mondayGame.id);
transactions = reverseBookingCost(transactions, mondayGame.id);
assert.equal(transactions.reduce((sum, item) => sum + item.amount, 0), 0);

assert.equal(normalizeRole("finance"), "budgeting_booking_officer");
assert.equal(canManageMoney(normalizeRole("player")), false);
assert.equal(canManageMoney(normalizeRole("booking")), true);

assert.deepEqual(notificationIdsFor(mondayGame, undefined, new Date("2026-07-05T11:00:00")), [
  "reservation-res-2026-07-06",
  "reservation-open-res-2026-07-06"
]);

const privateMessage = { conversationId: "private-najib-ahmed", playerName: "Najib", recipients: ["Ahmed A"] };
assert.equal(canReadPrivateChat(privateMessage, "Najib"), true);
assert.equal(canReadPrivateChat(privateMessage, "Ahmed A"), true);
assert.equal(canReadPrivateChat(privateMessage, "Admin"), false);

console.log("KORASMART workflow checks passed.");
