"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface PredictionFormProps {
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
  disabled: boolean;
  initialHome?: number;
  initialAway?: number;
}

export function PredictionForm({
  matchId,
  homeTeamName,
  awayTeamName,
  disabled,
  initialHome,
  initialAway,
}: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState(initialHome?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(initialAway?.toString() ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (homeScore === "" || awayScore === "") {
      toast.error("Ingresa ambos marcadores");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Error al guardar prediccion");
        return;
      }

      toast.success("Prediccion guardada correctamente");
    } catch {
      toast.error("Error de conexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tu prediccion</CardTitle>
      </CardHeader>
      <CardContent>
        {disabled ? (
          <p className="text-sm text-muted-foreground">
            Este partido ya no acepta predicciones.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-end gap-4 justify-center">
              <div className="space-y-1 text-center">
                <Label className="text-xs">{homeTeamName}</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="w-16 text-center text-lg font-bold"
                />
              </div>
              <span className="text-lg font-bold pb-2">-</span>
              <div className="space-y-1 text-center">
                <Label className="text-xs">{awayTeamName}</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="w-16 text-center text-lg font-bold"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar prediccion"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
