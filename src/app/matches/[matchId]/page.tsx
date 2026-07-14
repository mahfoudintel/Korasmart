import { MatchDetail } from "@/components/match-detail";

export default async function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  return <MatchDetail matchId={matchId} />;
}
