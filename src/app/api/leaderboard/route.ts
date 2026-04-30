import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/leaderboard";

export const revalidate = 60;

export async function GET() {
  const leaderboard = await getLeaderboard();
  return NextResponse.json(leaderboard);
}
