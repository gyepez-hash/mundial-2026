"use client";

import Link from "next/link";
import { LockIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/match-constants";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: {
    id: string;
    matchNumber: number;
    stage: string;
    group: string | null;
    dateTime: string;
    venue: string;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
    homeTeam: { name: string; code: string; flagUrl: string | null } | null;
    awayTeam: { name: string; code: string; flagUrl: string | null } | null;
  };
  prediction?: {
    homeScore: number;
    awayScore: number;
    points: number | null;
  } | null;
}

export function MatchCard({ match, prediction }: MatchCardProps) {
  const isFinished = match.status === "finished";
  const isLocked = match.status === "locked";
  const date = new Date(match.dateTime);

  return (
    <Link href={`/matches/${match.id}`} className="group block">
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200",
          "group-hover:-translate-y-0.5 group-hover:ring-primary/40 group-hover:shadow-lg group-hover:shadow-primary/15",
          isLocked && "opacity-80"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {date.toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div className="flex gap-1.5">
              {match.group && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  Grupo {match.group}
                </Badge>
              )}
              {isFinished && (
                <Badge variant="accent" className="text-[10px] uppercase tracking-wide">
                  {STATUS_LABELS["finished"]}
                </Badge>
              )}
              {isLocked && (
                <Badge variant="destructive" className="text-[10px] uppercase tracking-wide gap-1">
                  <LockIcon className="size-3" />
                  {STATUS_LABELS["locked"]}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center justify-end gap-2.5">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {match.homeTeam?.name ?? "Por definir"}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {match.homeTeam?.code ?? "TBD"}
                </p>
              </div>
              {match.homeTeam?.flagUrl && (
                <img
                  src={match.homeTeam.flagUrl}
                  alt={match.homeTeam.code}
                  className="h-7 w-9 rounded-sm object-cover shadow-md ring-1 ring-border/50"
                />
              )}
            </div>

            <div
              className={cn(
                "min-w-[68px] rounded-lg px-3 py-1.5 text-center",
                isFinished
                  ? "bg-electric-gradient text-white shadow-md shadow-primary/30"
                  : "bg-secondary/60 ring-1 ring-border/50"
              )}
            >
              {isFinished ? (
                <span className="text-display text-2xl leading-none tabular-nums">
                  {match.homeScore} - {match.awayScore}
                </span>
              ) : isLocked ? (
                <LockIcon className="mx-auto size-4 text-muted-foreground" />
              ) : (
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  vs
                </span>
              )}
            </div>

            <div className="flex flex-1 items-center gap-2.5">
              {match.awayTeam?.flagUrl && (
                <img
                  src={match.awayTeam.flagUrl}
                  alt={match.awayTeam.code}
                  className="h-7 w-9 rounded-sm object-cover shadow-md ring-1 ring-border/50"
                />
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  {match.awayTeam?.name ?? "Por definir"}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {match.awayTeam?.code ?? "TBD"}
                </p>
              </div>
            </div>
          </div>

          {prediction && (
            <div className="mt-3 flex items-center justify-center gap-2 border-t border-border/40 pt-2 text-center">
              <span className="text-xs text-muted-foreground">
                Tu prediccion:{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {prediction.homeScore} - {prediction.awayScore}
                </span>
              </span>
              {prediction.points !== null && (
                <Badge
                  variant={prediction.points > 0 ? "fire" : "secondary"}
                  className="text-xs"
                >
                  {prediction.points > 0 ? `+${prediction.points} pts` : "0 pts"}
                </Badge>
              )}
            </div>
          )}

          <p className="mt-2 text-center text-xs text-muted-foreground/80">
            {match.venue}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
