"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ScoringPage() {
  const [exactScore, setExactScore] = useState("5");
  const [correctWinner, setCorrectWinner] = useState("3");
  const [correctDraw, setCorrectDraw] = useState("2");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/scoring")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setExactScore(data.exactScore.toString());
          setCorrectWinner(data.correctWinner.toString());
          setCorrectDraw(data.correctDraw.toString());
        }
        setInitialLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar configuracion", {
          description: "No se pudieron cargar los puntos actuales.",
        });
        setInitialLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/scoring", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exactScore: parseInt(exactScore, 10),
          correctWinner: parseInt(correctWinner, 10),
          correctDraw: parseInt(correctDraw, 10),
        }),
      });

      if (!res.ok) {
        toast.error("Error al guardar configuracion", {
          description: "No se pudieron guardar los puntos. Intenta de nuevo.",
        });
        return;
      }

      toast.success("Configuracion de puntos actualizada");
    } catch {
      toast.error("Error de conexion", {
        description: "No se pudo conectar al servidor. Intenta mas tarde.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] items-start">
      <Card className="border-brand-electric/20 bg-card/70">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="font-display text-xl text-white not-italic">
              Configuracion de puntos
            </h2>
            <p className="text-xs text-white/60">
              Define cuantos puntos otorga cada tipo de acierto.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <ScoringField
              id="exactScore"
              label="Marcador exacto"
              hint="Cuando el usuario acierta el marcador exacto."
              value={exactScore}
              onChange={setExactScore}
            />
            <ScoringField
              id="correctWinner"
              label="Ganador correcto"
              hint="Cuando acierta al ganador pero no el marcador."
              value={correctWinner}
              onChange={setCorrectWinner}
            />
            <ScoringField
              id="correctDraw"
              label="Empate correcto"
              hint="Cuando predice empate y es empate, con diferente marcador."
              value={correctDraw}
              onChange={setCorrectDraw}
            />

            <Button
              type="submit"
              variant="accent"
              disabled={loading || initialLoading}
              className="w-full h-10"
            >
              {loading ? "Guardando..." : "Guardar configuracion"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Live preview */}
      <Card className="border-brand-electric/15 bg-card/60">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-xl text-white not-italic">
              Vista previa
            </h2>
            <p className="text-xs text-white/60">
              Asi se muestran los puntos en la pagina de reglas.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <PreviewTile value={exactScore} tone="fire" label="Marcador exacto" />
            <PreviewTile value={correctWinner} tone="electric" label="Ganador" />
            <PreviewTile value={correctDraw} tone="muted" label="Empate" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScoringField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-white">
        {label}
      </Label>
      <p className="text-xs text-white/55">{hint}</p>
      <NumberInput id={id} value={value} onChange={onChange} />
    </div>
  );
}

function PreviewTile({
  value,
  tone,
  label,
}: {
  value: string;
  tone: "fire" | "electric" | "muted";
  label: string;
}) {
  const toneClass =
    tone === "fire"
      ? "text-fire-gradient"
      : tone === "electric"
        ? "text-brand-electric"
        : "text-white";

  return (
    <div className="rounded-lg border border-brand-electric/15 bg-card/70 p-4 text-center">
      <p className={`text-display text-4xl ${toneClass} leading-none`}>
        {value || "0"}
      </p>
      <p className="text-[0.65rem] uppercase tracking-widest text-white/55 font-mono mt-2">
        {label}
      </p>
    </div>
  );
}
