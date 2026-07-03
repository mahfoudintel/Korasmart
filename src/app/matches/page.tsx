import { ReservationAdmin } from "@/components/reservation-admin";
import { MatchStatsSection } from "@/components/match-stats-section";

export default function MatchesPage() {
  return (
    <div className="space-y-5">
      <ReservationAdmin />
      <MatchStatsSection />
    </div>
  );
}
