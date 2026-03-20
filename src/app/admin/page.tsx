import { prisma } from "@/lib/prisma";
import { AdminMatchesClient } from "./admin-matches-client";

export default async function AdminPage() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: { matchNumber: "asc" },
  });

  const serialized = matches.map((m) => ({
    ...m,
    dateTime: m.dateTime.toISOString(),
  }));

  return <AdminMatchesClient matches={serialized} />;
}
