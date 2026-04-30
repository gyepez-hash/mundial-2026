"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
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
      toast.error("Ingresa ambos marcadores", {
        description: "Debes llenar el marcador de ambos equipos.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          homeScore: parseInt(homeScore, 10),
          awayScore: parseInt(awayScore, 10),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Error al guardar prediccion", {
          description: "Hubo un problema al guardar. Intenta de nuevo.",
        });
        return;
      }

      toast.success("Prediccion guardada correctamente");
    } catch {
      toast.error("Error de conexion", {
        description: "No se pudo conectar al servidor. Intenta mas tarde.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-display text-xl uppercase italic">
          Tu prediccion
        </CardTitle>
      </CardHeader>
      <CardContent>
        {disabled ? (
          <div className="rounded-lg bg-secondary/60 px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Este partido ya no acepta predicciones.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-end justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Label className="max-w-[6rem] truncate text-center" title={homeTeamName}>
                  {homeTeamName}
                </Label>
                <NumberInput
                  value={homeScore}
                  onChange={setHomeScore}
                  aria-label={`Marcador de ${homeTeamName}`}
                  className="text-display h-16 w-20 text-center text-3xl tabular-nums"
                />
              </div>
              <span
                className="text-display pb-3 text-3xl text-muted-foreground"
                aria-hidden="true"
              >
                -
              </span>
              <div className="flex flex-col items-center gap-2">
                <Label className="max-w-[6rem] truncate text-center" title={awayTeamName}>
                  {awayTeamName}
                </Label>
                <NumberInput
                  value={awayScore}
                  onChange={setAwayScore}
                  aria-label={`Marcador de ${awayTeamName}`}
                  className="text-display h-16 w-20 text-center text-3xl tabular-nums"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="fire"
              size="lg"
              className="h-11 w-full text-base font-semibold uppercase tracking-wide"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar prediccion"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
