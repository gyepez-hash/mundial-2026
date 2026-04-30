import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PredictionForm } from "@/components/prediction-form";
import { STAGE_LABELS, STATUS_LABELS } from "@/lib/match-constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matchId: string }>;
}): Promise<Metadata> {
  const { matchId } = await params;
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { homeTeam: true, awayTeam: true },
  });

  if (!match) return { title: "Partido no encontrado" };

  const home = match.homeTeam?.name ?? "Por definir";
  const away = match.awayTeam?.name ?? "Por definir";
  const title = `${home} vs ${away}`;
  const description = `Partido #${match.matchNumber} del Mundial 2026. ${home} vs ${away} en ${match.venue}. Haz tu prediccion y acumula puntos.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Quiniela Mundial 2026`,
      description,
    },
  };
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const session = await auth();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { homeTeam: true, awayTeam: true },
  });

  if (!match) notFound();

  const prediction = session?.user?.id
    ? await prisma.prediction.findUnique({
        where: {
          userId_matchId: {
            userId: session.user.id,
            matchId: match.id,
          },
        },
      })
    : null;

  // Top predictors for this match (only relevant once finished)
  const topPredictors =
    match.status === "finished"
      ? await prisma.prediction.findMany({
          where: { matchId: match.id, points: { gt: 0 } },
          orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
          take: 5,
          include: { user: { select: { name: true, image: true } } },
        })
      : [];

  const date = new Date(match.dateTime);
  const isFinished = match.status === "finished";
  const isLocked = match.status === "locked";
  const canPredict = match.status === "scheduled";
  const stageLabel = match.group
    ? `Grupo ${match.group}`
    : (STAGE_LABELS[match.stage] ?? match.stage);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10 space-y-8">
      {/* Header / meta */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="outline" className="border-brand-electric/40 text-brand-electric">
            {stageLabel}
          </Badge>
          <Badge
            variant={isFinished ? "default" : isLocked ? "destructive" : "secondary"}
          >
            {STATUS_LABELS[match.status] ?? match.status}
          </Badge>
          <span className="text-xs font-mono text-white/50">
            #{match.matchNumber}
          </span>
        </div>
        <p className="text-sm text-white/70">
          {date.toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-xs text-white/50 font-mono uppercase tracking-widest">
          {match.venue}
        </p>
      </header>

      {/* Scoreline */}
      <section
        className="bg-card/70 border border-brand-electric/20 rounded-2xl p-6 sm:p-10"
        aria-label="Marcador y equipos"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
          {/* Home */}
          <div className="flex flex-col items-center text-center gap-3 min-w-0">
            {match.homeTeam?.flagUrl ? (
              <img
                src={match.homeTeam.flagUrl}
                alt={`Bandera de ${match.homeTeam.name}`}
                className="w-16 h-12 sm:w-24 sm:h-16 object-cover rounded-md shadow-lg ring-1 ring-white/10"
              />
            ) : (
              <div className="w-16 h-12 sm:w-24 sm:h-16 rounded-md bg-muted/40" aria-hidden="true" />
            )}
            <p className="font-semibold text-base sm:text-xl text-white truncate max-w-full">
              {match.homeTeam?.name ?? "Por definir"}
            </p>
            <p className="text-xs font-mono text-brand-electric tracking-widest">
              {match.homeTeam?.code ?? "TBD"}
            </p>
          </div>

          {/* Score */}
          <div className="text-center">
            {isFinished ? (
              <p
                className="text-display text-6xl sm:text-8xl text-white tabular-nums leading-none"
                aria-label={`Marcador final ${match.homeScore} a ${match.awayScore}`}
              >
                {match.homeScore}
                <span className="text-fire-gradient"> - </span>
                {match.awayScore}
              </p>
            ) : (
              <p className="text-display text-4xl sm:text-6xl text-white/40 leading-none">
                VS
              </p>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center text-center gap-3 min-w-0">
            {match.awayTeam?.flagUrl ? (
              <img
                src={match.awayTeam.flagUrl}
                alt={`Bandera de ${match.awayTeam.name}`}
                className="w-16 h-12 sm:w-24 sm:h-16 object-cover rounded-md shadow-lg ring-1 ring-white/10"
              />
            ) : (
              <div className="w-16 h-12 sm:w-24 sm:h-16 rounded-md bg-muted/40" aria-hidden="true" />
            )}
            <p className="font-semibold text-base sm:text-xl text-white truncate max-w-full">
              {match.awayTeam?.name ?? "Por definir"}
            </p>
            <p className="text-xs font-mono text-brand-electric tracking-widest">
              {match.awayTeam?.code ?? "TBD"}
            </p>
          </div>
        </div>
      </section>

      {/* Prediction form / locked prediction */}
      {session?.user ? (
        <>
          {prediction && isFinished ? (
            <Card className="border-brand-electric/20 bg-card/70">
              <CardContent className="p-6 text-center space-y-3">
                <p className="text-[0.65rem] uppercase tracking-widest text-brand-electric font-mono">
                  Tu prediccion
                </p>
                <p className="text-display text-4xl text-white tabular-nums">
                  {prediction.homeScore} - {prediction.awayScore}
                </p>
                {prediction.points !== null ? (
                  <Badge
                    className={
                      prediction.points > 0
                        ? "bg-fire-gradient border-transparent text-white text-sm px-4 py-1"
                        : "text-sm px-4 py-1"
                    }
                    variant={prediction.points > 0 ? "default" : "secondary"}
                  >
                    {prediction.points > 0
                      ? `+${prediction.points} puntos`
                      : "Sin puntos"}
                  </Badge>
                ) : (
                  <p className="text-sm text-white/60">Pendiente de calificar</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <PredictionForm
              matchId={match.id}
              homeTeamName={match.homeTeam?.name ?? "Local"}
              awayTeamName={match.awayTeam?.name ?? "Visitante"}
              disabled={!canPredict}
              initialHome={prediction?.homeScore}
              initialAway={prediction?.awayScore}
            />
          )}
        </>
      ) : (
        <Card className="border-brand-electric/20 bg-card/70">
          <CardContent className="p-6 text-center text-sm text-white/70">
            Inicia sesion para registrar tu prediccion.
          </CardContent>
        </Card>
      )}

      {/* Top predictors */}
      {isFinished && topPredictors.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg text-white not-italic">
              Mejores pronosticos
            </h2>
            <span className="flex-1 h-px bg-border" aria-hidden="true" />
          </div>
          <Card className="border-brand-electric/15 bg-card/60">
            <CardContent className="p-3 sm:p-4">
              <ol className="divide-y divide-border">
                {topPredictors.map((p, idx) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span
                      className={`text-display text-xl w-6 text-center ${
                        idx === 0 ? "text-fire-gradient" : "text-brand-electric"
                      }`}
                      aria-hidden="true"
                    >
                      {idx + 1}
                    </span>
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={p.user.image ?? ""} alt="" />
                      <AvatarFallback className="text-xs">
                        {p.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm text-white truncate">
                      {p.user.name ?? "Anonimo"}
                    </span>
                    <span className="text-xs font-mono text-white/50 tabular-nums">
                      {p.homeScore}-{p.awayScore}
                    </span>
                    <Badge
                      className={
                        p.points && p.points >= 5
                          ? "bg-fire-gradient border-transparent text-white"
                          : ""
                      }
                      variant={p.points && p.points > 0 ? "default" : "secondary"}
                    >
                      +{p.points}
                    </Badge>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
