import { type Member } from "@/hooks/use-members";
import { calculateQuantitativeScore, type PeerRatings, type RatingValues } from "@/lib/ratings";
import { type MatchReport, type Reservation } from "@/lib/reservations";

export type PlayerPerformance = {
  player: string;
  ratingScore: number | null;
  ratingSubmissions: number;
  goals: number;
  appearances: number;
  wins: number;
  teamScoreFor: number;
  teamScoreAgainst: number;
  formScore: number;
  balanceScore: number;
};

export type BalancedTeam = {
  name: "Team A" | "Team B";
  players: PlayerPerformance[];
  total: number;
};

function reportPlayers(report: MatchReport) {
  return [...new Set([...report.fluorescentTeam, ...report.orangeTeam, ...Object.keys(report.scorers || {})])];
}

function playerTeam(report: MatchReport, player: string) {
  if (report.fluorescentTeam.includes(player)) return "fluorescent";
  if (report.orangeTeam.includes(player)) return "orange";
  return null;
}

function teamWon(report: MatchReport, team: "fluorescent" | "orange") {
  if (report.winner === team) return true;
  if (report.winner !== "draw") return false;
  return team === "fluorescent"
    ? report.fluorescentScore > report.orangeScore
    : report.orangeScore > report.fluorescentScore;
}

export function getRecordedReservations(reservations: Reservation[]) {
  return reservations.filter((reservation) => Boolean(reservation.matchReport));
}

export function derivePlayerPerformance(members: Member[], reservations: Reservation[], ratings: PeerRatings): PlayerPerformance[] {
  const recorded = getRecordedReservations(reservations);

  return members.map((member) => {
    const receivedRatings = Object.values(ratings)
      .map((raterRatings) => raterRatings[member.name])
      .filter(Boolean) as RatingValues[];
    const ratingScore = calculateQuantitativeScore(receivedRatings);

    const stats = recorded.reduce(
      (acc, reservation) => {
        const report = reservation.matchReport;
        if (!report) return acc;

        const goals = Number(report.scorers?.[member.name] || 0);
        const team = playerTeam(report, member.name);
        const played = Boolean(team || goals > 0 || reportPlayers(report).includes(member.name));

        if (!played) return acc;

        acc.appearances += 1;
        acc.goals += goals;

        if (team === "fluorescent") {
          acc.teamScoreFor += report.fluorescentScore;
          acc.teamScoreAgainst += report.orangeScore;
          if (teamWon(report, team)) acc.wins += 1;
        }

        if (team === "orange") {
          acc.teamScoreFor += report.orangeScore;
          acc.teamScoreAgainst += report.fluorescentScore;
          if (teamWon(report, team)) acc.wins += 1;
        }

        return acc;
      },
      { goals: 0, appearances: 0, wins: 0, teamScoreFor: 0, teamScoreAgainst: 0 }
    );

    const resultMargin = stats.appearances ? (stats.teamScoreFor - stats.teamScoreAgainst) / stats.appearances : 0;
    const formScore = Number((stats.goals * 0.7 + stats.wins * 0.8 + resultMargin * 0.25).toFixed(2));
    const balanceScore = Number(((ratingScore ?? 5) * 0.72 + formScore * 0.28).toFixed(2));

    return {
      player: member.name,
      ratingScore,
      ratingSubmissions: receivedRatings.length,
      ...stats,
      formScore,
      balanceScore
    };
  });
}

export function getTopScorers(performance: PlayerPerformance[]) {
  const maxGoals = Math.max(0, ...performance.map((player) => player.goals));
  if (!maxGoals) return [];
  return performance.filter((player) => player.goals === maxGoals);
}

export function balanceTeams(performance: PlayerPerformance[], selectedPlayers: string[]): [BalancedTeam, BalancedTeam] {
  const selected = selectedPlayers
    .map((name) => performance.find((player) => player.player === name))
    .filter(Boolean) as PlayerPerformance[];

  const sorted = [...selected].sort((a, b) => b.balanceScore - a.balanceScore);
  const teams: [BalancedTeam, BalancedTeam] = [
    { name: "Team A", players: [], total: 0 },
    { name: "Team B", players: [], total: 0 }
  ];

  sorted.forEach((player) => {
    const target = teams[0].total <= teams[1].total ? teams[0] : teams[1];
    target.players.push(player);
    target.total = Number((target.total + player.balanceScore).toFixed(2));
  });

  return teams;
}
