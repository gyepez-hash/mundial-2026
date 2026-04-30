import { prisma } from "./prisma";

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string | null;
  image: string | null;
  totalPoints: number;
  totalPredictions: number;
}

export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  const [users, aggregations] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, image: true },
    }),
    prisma.prediction.groupBy({
      by: ["userId"],
      where: { points: { not: null } },
      _sum: { points: true },
      _count: { _all: true },
    }),
  ]);

  const aggMap = new Map(
    aggregations.map((a) => [
      a.userId,
      {
        totalPoints: a._sum.points ?? 0,
        totalPredictions: a._count._all,
      },
    ])
  );

  return users
    .map((u) => ({
      id: u.id,
      name: u.name,
      image: u.image,
      totalPoints: aggMap.get(u.id)?.totalPoints ?? 0,
      totalPredictions: aggMap.get(u.id)?.totalPredictions ?? 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((user, index) => ({ ...user, rank: index + 1 }));
}
