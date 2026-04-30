import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MatchCard } from "@/components/match-card";
import { STAGE_LABELS } from "@/lib/match-constants";

export const metadata: Metadata = {
  title: "Mis Predicciones",
  description:
    "Revisa todas tus predicciones del Mundial 2026, los puntos obtenidos por partido y tu puntaje total acumulado.",
  robots: { index: false },
};

const STAGE_ORDER = ["group", "round32", "round16", "quarter", "semi", "third", "final"];

export default async function PredictionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const predictions = await prisma.prediction.findMany({
    where: { userId: session.user.id },
    include: {
      match: {
        include: { homeTeam: true, awayTeam: true },
      },
    },
    orderBy: { match: { matchNumber: "asc" } },
  });

  const totalPoints = predictions.reduce((sum, p) => sum + (p.points ?? 0), 0);
  const scored = predictions.filter((p) => p.points !== null).length;
  const exactHits = predictions.filter((p) => (p.points ?? 0) >= 5).length;
  const totalCount = predictions.length;

  // Group predictions by stage / group
  const grouped = new Map<string, typeof predictions>();
  for (const pred of predictions) {
    const key = pred.match.group
      ? `Grupo ${pred.match.group}`
      : (STAGE_LABELS[pred.match.stage] ?? pred.match.stage);
    const arr = grouped.get(key) ?? [];
    arr.push(pred);
    grouped.set(key, arr);
  }

  // Sort sections: groups A..H first, then knockout stages in order
  const sortedSections = Array.from(grouped.entries()).sort(([a], [b]) => {
    const aIsGroup = a.startsWith("Grupo");
    const bIsGroup = b.startsWith("Grupo");
    if (aIsGroup && !bIsGroup) return -1;
    if (!aIsGroup && bIsGroup) return 1;
    if (aIsGroup && bIsGroup) return a.localeCompare(b);
    // knockout: order by STAGE_ORDER label
    const aIdx = STAGE_ORDER.findIndex((s) => STAGE_LABELS[s] === a);
    const bIdx = STAGE_ORDER.findIndex((s) => STAGE_LABELS[s] === b);
    return aIdx - bIdx;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-electric font-mono">
            Tu quiniela
          </p>
          <h1 className="text-display text-4xl sm:text-6xl text-white">
            MIS PREDICCIONES
          </h1>
        </div>

        {totalCount > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 sm:min-w-[420px]">
            <StatTile label="Total" value={String(totalPoints)} accent />
            <StatTile label="Calificadas" value={`${scored}/${totalCount}`} />
            <StatTile label="Exactos" value={String(exactHits)} />
          </div>
        )}
      </header>

      {/* Empty state */}
      {predictions.length === 0 ? (
        <Card className="border-brand-electric/20 bg-card/60">
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-display text-3xl text-fire-gradient">SIN PRONOSTICOS</p>
            <p className="text-white/70 max-w-md mx-auto">
              Aun no has hecho predicciones. Entra a la lista de partidos y marca
              tus marcadores antes de que cierren.
            </p>
            <Link href="/matches" className="inline-block pt-2">
              <Button variant="accent" size="lg" className="h-11 px-6">
                Ir a partidos
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {sortedSections.map(([sectionTitle, sectionPredictions]) => (
            <section key={sectionTitle} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl sm:text-2xl text-white not-italic">
                  {sectionTitle}
                </h2>
                <span className="text-xs text-white/50 font-mono">
                  {sectionPredictions.length}{" "}
                  {sectionPredictions.length === 1 ? "partido" : "partidos"}
                </span>
                <span className="flex-1 h-px bg-border" aria-hidden="true" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sectionPredictions.map((pred) => (
                  <MatchCard
                    key={pred.id}
                    match={{
                      ...pred.match,
                      dateTime: pred.match.dateTime.toISOString(),
                    }}
                    prediction={{
                      homeScore: pred.homeScore,
                      awayScore: pred.awayScore,
                      points: pred.points,
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 sm:px-4 sm:py-4 text-center ${
        accent
          ? "bg-fire-gradient border-transparent text-white"
          : "bg-card/70 border-brand-electric/20"
      }`}
    >
      <p
        className={`text-display text-2xl sm:text-3xl leading-none ${
          accent ? "text-white" : "text-white"
        }`}
      >
        {value}
      </p>
      <p
        className={`text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] mt-1.5 font-mono ${
          accent ? "text-white/80" : "text-brand-electric"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
