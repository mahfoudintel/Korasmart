import {
  BarChart3,
  CalendarDays,
  Home,
  Medal,
  Shield,
  Users,
  WalletCards
} from "lucide-react";

export const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Finances", href: "/finances", icon: WalletCards },
  { label: "Scheduling", href: "/bookings", icon: CalendarDays },
  { label: "Players Details", href: "/players", icon: Users }
];

export const players = [
  { name: "Najib", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Ahmed A", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Ahmed G", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Nawfal", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Badr", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Said", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Driss", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Abdou", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Bobker", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Abdelhamid", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Ismail", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Mehdi", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Elhachmi", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Miloudi", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Yassine", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 },
  { name: "Hicham", position: "Member", goals: 0, assists: 0, wins: 0, mvps: 0, rating: 0, skill: 0, speed: 0, stamina: 0, passing: 0, defense: 0, shooting: 0 }
];

export const fluorescentTeam = players.slice(0, 8);
export const orangeTeam = players.slice(8, 16);

export const statHighlights = [
  { label: "Ratings status", value: "Pending", meta: "Awaiting peer scores", icon: Shield },
  { label: "Match stats", value: "Empty", meta: "No official game entered", icon: Medal },
  { label: "Attendance", value: "Live", meta: "Based on member responses", icon: Users },
  { label: "Team balance", value: "Ready", meta: "Will use quantitative scores", icon: BarChart3 }
];
