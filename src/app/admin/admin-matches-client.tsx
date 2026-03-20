"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Match {
  id: string;
  matchNumber: number;
  stage: string;
  group: string | null;
  dateTime: string;
  venue: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  homeTeam: { name: string; code: string; flagUrl: string | null } | null;
  awayTeam: { name: string; code: string; flagUrl: string | null } | null;
}

export function AdminMatchesClient({ matches }: { matches: Match[] }) {
  const [scores, setScores] = useState<
    Record<string, { home: string; away: string }>
  >({});
  const [loading, setLoading] = useState<string | null>(null);

  function getScore(matchId: string) {
    return scores[matchId] ?? { home: "", away: "" };
  }

  async function handleSaveResult(matchId: string) {
    const s = getScore(matchId);
    if (s.home === "" || s.away === "") {
      toast.error("Ingresa ambos marcadores", {
        description: "Debes llenar el marcador de ambos equipos.",
      });
      return;
    }

    setLoading(matchId);
    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          homeScore: parseInt(s.home),
          awayScore: parseInt(s.away),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Error al guardar resultado", {
          description: "No se pudo guardar el resultado del partido.",
        });
        return;
      }

      const data = await res.json();
      toast.success("Resultado guardado", {
        description: `Se calificaron ${data.scored} predicciones correctamente.`,
      });
    } catch {
      toast.error("Error de conexion", {
        description: "No se pudo conectar al servidor. Intenta mas tarde.",
      });
    } finally {
      setLoading(null);
    }
  }

  async function handleLock(matchId: string) {
    setLoading(matchId);
    try {
      const res = await fetch("/api/admin/matches/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });

      if (!res.ok) {
        toast.error("Error al bloquear partido", {
          description: "No se pudo bloquear. Intenta de nuevo.",
        });
        return;
      }

      toast.success("Partido bloqueado");
    } catch {
      toast.error("Error de conexion", {
        description: "No se pudo conectar al servidor. Intenta mas tarde.",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Partido</TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead >Resultado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => {
            const s = getScore(match.id);
            return (
              <TableRow key={match.id}>
                <TableCell className="text-muted-foreground">
                  {match.matchNumber}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {match.homeTeam?.flagUrl && (
                      <img src={match.homeTeam.flagUrl} alt={match.homeTeam.code} className="w-5 h-4 object-cover rounded-sm" />
                    )}
                    {match.homeTeam?.code ?? "TBD"}
                    <span className="text-muted-foreground">vs</span>
                    {match.awayTeam?.flagUrl && (
                      <img src={match.awayTeam.flagUrl} alt={match.awayTeam.code} className="w-5 h-4 object-cover rounded-sm" />
                    )}
                    {match.awayTeam?.code ?? "TBD"}
                  </div>
                </TableCell>
                <TableCell>
                  {match.group ? (
                    <Badge variant="outline">Grupo {match.group}</Badge>
                  ) : (
                    <Badge variant="secondary">{match.stage}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      match.status === "finished"
                        ? "default"
                        : match.status === "locked"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {match.status === "finished"
                      ? "Finalizado"
                      : match.status === "locked"
                      ? "Bloqueado"
                      : "Programado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {match.status === "finished" ? (
                    <span className="font-bold">
                      {match.homeScore} - {match.awayScore}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        className="w-14 text-center"
                        value={s.home}
                        onChange={(e) =>
                          setScores((prev) => ({
                            ...prev,
                            [match.id]: { ...s, home: e.target.value },
                          }))
                        }
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        min="0"
                        className="w-14 text-center"
                        value={s.away}
                        onChange={(e) =>
                          setScores((prev) => ({
                            ...prev,
                            [match.id]: { ...s, away: e.target.value },
                          }))
                        }
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {match.status !== "finished" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSaveResult(match.id)}
                          disabled={loading === match.id}
                        >
                          Guardar
                        </Button>
                        {match.status === "scheduled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLock(match.id)}
                            disabled={loading === match.id}
                          >
                            Bloquear
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
