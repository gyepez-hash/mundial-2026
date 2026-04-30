import type { Metadata } from "next";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { LeaderboardPodium } from "./podium";
import { getLeaderboard } from "@/lib/leaderboard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ranking",
  description:
    "Tabla de posiciones de la quiniela del Mundial 2026. Consulta quien lidera la clasificacion y cuantos puntos llevas acumulados.",
  openGraph: {
    title: "Ranking — Quiniela Mundial 2026",
    description: "Tabla de posiciones de la quiniela. Mira quien va ganando.",
  },
};

export default async function LeaderboardPage() {
  const users = await getLeaderboard();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10 space-y-8">
      <header className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-electric font-mono">
          Tabla de posiciones
        </p>
        <h1 className="text-display text-5xl sm:text-7xl text-white">
          RANKING
        </h1>
        <p className="text-sm text-white/60 max-w-md mx-auto">
          El que mas puntos acumule al final del Mundial se lleva la gloria.
        </p>
      </header>

      <LeaderboardPodium users={users} />

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg text-white not-italic">
            Tabla completa
          </h2>
          <span className="flex-1 h-px bg-border" aria-hidden="true" />
        </div>
        <div className="rounded-xl border border-brand-electric/20 bg-card/60 overflow-hidden">
          <LeaderboardTable users={users} />
        </div>
      </section>
    </div>
  );
}
