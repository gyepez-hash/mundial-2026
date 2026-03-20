import { LeaderboardTable } from "@/components/leaderboard-table";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Ranking</h1>
      <LeaderboardTable />
    </div>
  );
}
