import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { MatchCard } from "@/components/match-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Partidos",
  description:
    "Consulta los 104 partidos del Mundial 2026: fase de grupos, octavos, cuartos, semifinales y la gran final. Haz tus predicciones antes de que cierren.",
  openGraph: {
    title: "Partidos — Quiniela Mundial 2026",
    description:
      "Todos los partidos del Mundial 2026. Predice marcadores y acumula puntos.",
  },
};

const STAGE_TAB_LABEL: Record<string, string> = {
  round32: "32avos",
  round16: "8vos",
  quarter: "4tos",
  semi: "Semis",
  third: "3er lugar",
  final: "Final",
};

export default async function MatchesPage() {
  const session = await auth();

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: { matchNumber: "asc" },
  });

  const predictions = session?.user?.id
    ? await prisma.prediction.findMany({
        where: { userId: session.user.id },
      })
    : [];

  const predictionMap = new Map(predictions.map((p) => [p.matchId, p]));

  const groups = [...new Set(matches.filter((m) => m.group).map((m) => m.group!))].sort();
  const stages = [...new Set(matches.filter((m) => !m.group).map((m) => m.stage))];

  const allTabs = [
    ...groups.map((g) => ({ key: g, label: `Grupo ${g}` })),
    ...stages.map((s) => ({ key: s, label: STAGE_TAB_LABEL[s] ?? s })),
  ];

  // Stats
  const totalMatches = matches.length;
  const finishedCount = matches.filter((m) => m.status === "finished").length;
  const liveCount = matches.filter((m) => m.status === "locked").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-electric font-mono">
            Calendario completo
          </p>
          <h1 className="text-display text-4xl sm:text-6xl text-white">
            PARTIDOS
          </h1>
        </div>

        <dl className="flex gap-4 text-sm">
          <div>
            <dt className="text-[0.65rem] uppercase tracking-widest text-white/50 font-mono">
              Total
            </dt>
            <dd className="font-display text-2xl text-white not-italic">
              {totalMatches}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-widest text-white/50 font-mono">
              Jugados
            </dt>
            <dd className="font-display text-2xl text-white not-italic">
              {finishedCount}
            </dd>
          </div>
          {liveCount > 0 && (
            <div>
              <dt className="text-[0.65rem] uppercase tracking-widest text-accent font-mono">
                En curso
              </dt>
              <dd className="font-display text-2xl text-accent not-italic flex items-center gap-1.5">
                {liveCount}
                <span
                  className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse"
                  aria-hidden="true"
                />
              </dd>
            </div>
          )}
        </dl>
      </header>

      {/* Tabs */}
      <Tabs defaultValue={groups[0] ?? stages[0] ?? "A"}>
        <div
          className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
          role="region"
          aria-label="Filtrar por fase"
        >
          <TabsList className="flex h-auto gap-1 mb-6 bg-card/60 border border-brand-electric/15 p-1.5">
            {allTabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {allTabs.map((tab) => {
          const tabMatches = matches.filter((m) =>
            groups.includes(tab.key)
              ? m.group === tab.key
              : m.stage === tab.key,
          );
          return (
            <TabsContent key={tab.key} value={tab.key}>
              {tabMatches.length === 0 ? (
                <p className="text-center text-white/60 py-12 text-sm">
                  No hay partidos en esta fase todavia.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tabMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={{
                        ...match,
                        dateTime: match.dateTime.toISOString(),
                      }}
                      prediction={predictionMap.get(match.id) ?? null}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
