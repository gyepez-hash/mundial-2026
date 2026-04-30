"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";

export default function RulesPage() {
  const [config, setConfig] = useState({
    exactScore: 5,
    correctWinner: 3,
    correctDraw: 2,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/scoring")
      .then((res) => res.json())
      .then((data) => {
        if (data) setConfig(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".rules-hero",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      gsap.fromTo(
        ".rules-card",
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.1,
          ease: "back.out(1.2)",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        ".points-card",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.5)",
          delay: 0.4,
        }
      );

      gsap.fromTo(
        ".example-row",
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.7,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="mx-auto max-w-4xl px-4 py-10 sm:py-12 space-y-12">
      {/* Hero */}
      <header className="rules-hero text-center space-y-3 opacity-0">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-electric font-mono">
          Como jugar
        </p>
        <h1 className="text-display text-5xl sm:text-7xl text-white">
          REGLAS
        </h1>
        <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
          Predice los marcadores de los 104 partidos del Mundial 2026 y compite
          contra otros jugadores por el primer lugar.
        </p>
      </header>

      {/* Como funciona */}
      <section className="space-y-5" aria-labelledby="como-funciona">
        <h2
          id="como-funciona"
          className="font-display text-2xl text-white not-italic flex items-center gap-3"
        >
          Como funciona
          <span className="flex-1 h-px bg-border" aria-hidden="true" />
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <StepCard
            number="01"
            title="Registrate"
            description="Crea tu cuenta con correo y contrasena o inicia sesion con Google para comenzar a participar."
          />
          <StepCard
            number="02"
            title="Haz tus predicciones"
            description="Entra a cada partido y predice el marcador final. Puedes modificar tu prediccion hasta que el partido sea bloqueado."
          />
          <StepCard
            number="03"
            title="Espera los resultados"
            description="Cuando el partido finalice, el administrador registrara el marcador real y el sistema calculara automaticamente tus puntos."
          />
          <StepCard
            number="04"
            title="Revisa el ranking"
            description="Consulta la tabla de posiciones para ver como vas comparado con los demas. El que acumule mas puntos al final del torneo gana."
          />
        </div>
      </section>

      {/* Sistema de puntos */}
      <section className="space-y-5" aria-labelledby="sistema-puntos">
        <h2
          id="sistema-puntos"
          className="font-display text-2xl text-white not-italic flex items-center gap-3"
        >
          Sistema de puntos
          <span className="flex-1 h-px bg-border" aria-hidden="true" />
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <PointsCard
            value={config.exactScore}
            tone="fire"
            title="Marcador exacto"
            description="Acertaste el resultado exacto del partido (mismos goles para ambos equipos)."
          />
          <PointsCard
            value={config.correctWinner}
            tone="electric"
            title="Ganador correcto"
            description="Acertaste quien gano el partido pero no el marcador exacto."
          />
          <PointsCard
            value={config.correctDraw}
            tone="muted"
            title="Empate correcto"
            description="Predijiste empate y el partido termino en empate, pero con diferente marcador."
          />
        </div>

        <Card className="rules-card opacity-0 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Badge variant="destructive" className="shrink-0">
              0 pts
            </Badge>
            <p className="text-sm text-white/70">
              Si no aciertas ninguna de las condiciones anteriores, no obtendras
              puntos por ese partido.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Ejemplos */}
      <section className="space-y-5" aria-labelledby="ejemplos">
        <h2
          id="ejemplos"
          className="font-display text-2xl text-white not-italic flex items-center gap-3"
        >
          Ejemplos
          <span className="flex-1 h-px bg-border" aria-hidden="true" />
        </h2>

        <Card className="border-brand-electric/15 bg-card/70 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card/60">
                    <th className="text-left p-3 font-medium text-white/80">Tu prediccion</th>
                    <th className="text-left p-3 font-medium text-white/80">Resultado real</th>
                    <th className="text-left p-3 font-medium text-white/80">Puntos</th>
                    <th className="text-left p-3 font-medium text-white/80">Razon</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="example-row border-b border-border opacity-0">
                    <td className="p-3 font-mono text-white">2 - 1</td>
                    <td className="p-3 font-mono text-white">2 - 1</td>
                    <td className="p-3">
                      <Badge className="bg-fire-gradient border-transparent text-white">
                        +{config.exactScore}
                      </Badge>
                    </td>
                    <td className="p-3 text-white/60">Marcador exacto</td>
                  </tr>
                  <tr className="example-row border-b border-border opacity-0">
                    <td className="p-3 font-mono text-white">3 - 1</td>
                    <td className="p-3 font-mono text-white">2 - 0</td>
                    <td className="p-3">
                      <Badge>+{config.correctWinner}</Badge>
                    </td>
                    <td className="p-3 text-white/60">
                      Gano el local en ambos casos
                    </td>
                  </tr>
                  <tr className="example-row border-b border-border opacity-0">
                    <td className="p-3 font-mono text-white">0 - 2</td>
                    <td className="p-3 font-mono text-white">1 - 3</td>
                    <td className="p-3">
                      <Badge>+{config.correctWinner}</Badge>
                    </td>
                    <td className="p-3 text-white/60">
                      Gano el visitante en ambos casos
                    </td>
                  </tr>
                  <tr className="example-row border-b border-border opacity-0">
                    <td className="p-3 font-mono text-white">1 - 1</td>
                    <td className="p-3 font-mono text-white">0 - 0</td>
                    <td className="p-3">
                      <Badge variant="secondary">+{config.correctDraw}</Badge>
                    </td>
                    <td className="p-3 text-white/60">
                      Ambos son empate, diferente marcador
                    </td>
                  </tr>
                  <tr className="example-row border-b border-border opacity-0">
                    <td className="p-3 font-mono text-white">0 - 0</td>
                    <td className="p-3 font-mono text-white">0 - 0</td>
                    <td className="p-3">
                      <Badge className="bg-fire-gradient border-transparent text-white">
                        +{config.exactScore}
                      </Badge>
                    </td>
                    <td className="p-3 text-white/60">
                      Marcador exacto (incluye empates)
                    </td>
                  </tr>
                  <tr className="example-row opacity-0">
                    <td className="p-3 font-mono text-white">2 - 0</td>
                    <td className="p-3 font-mono text-white">0 - 1</td>
                    <td className="p-3">
                      <Badge variant="destructive">0</Badge>
                    </td>
                    <td className="p-3 text-white/60">
                      Predijiste local, gano visitante
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Estados del partido */}
      <section className="space-y-5" aria-labelledby="estados">
        <h2
          id="estados"
          className="font-display text-2xl text-white not-italic flex items-center gap-3"
        >
          Estados de un partido
          <span className="flex-1 h-px bg-border" aria-hidden="true" />
        </h2>

        <div className="space-y-3">
          <StateCard
            badge={<Badge variant="secondary">Programado</Badge>}
            text="El partido aun no inicia. Puedes crear o modificar tu prediccion libremente."
          />
          <StateCard
            badge={<Badge variant="destructive">Bloqueado</Badge>}
            text="El partido esta a punto de iniciar o ya inicio. Las predicciones estan cerradas y ya no se pueden modificar."
          />
          <StateCard
            badge={<Badge>Finalizado</Badge>}
            text="El partido termino. El resultado ya fue registrado y tus puntos fueron calculados automaticamente."
          />
        </div>
      </section>

      {/* Tips */}
      <section className="space-y-5" aria-labelledby="consejos">
        <h2
          id="consejos"
          className="font-display text-2xl text-white not-italic flex items-center gap-3"
        >
          Consejos
          <span className="flex-1 h-px bg-border" aria-hidden="true" />
        </h2>

        <Card className="border-brand-electric/30 bg-electric-gradient/5">
          <CardContent className="p-5 sm:p-6">
            <ul className="space-y-3 text-sm text-white/85">
              {[
                "Intenta predecir el marcador exacto siempre que puedas, ya que otorga la mayor cantidad de puntos.",
                "Si no estas seguro del marcador, al menos intenta acertar al ganador para obtener puntos parciales.",
                "No olvides hacer tu prediccion antes de que el partido sea bloqueado, ya que despues no podras modificarla.",
                "Puedes cambiar tu prediccion cuantas veces quieras mientras el partido siga en estado Programado.",
                "Revisa el ranking frecuentemente para ver tu posicion y motivarte a seguir participando.",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2.5">
                  <span
                    className="text-accent mt-1 shrink-0 leading-none"
                    aria-hidden="true"
                  >
                    &#9670;
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="rules-card opacity-0 border-brand-electric/20 bg-card/70 hover:border-brand-electric/50 transition-colors">
      <CardContent className="p-5 space-y-3">
        <span className="font-mono text-xs text-brand-electric tracking-widest">
          {number}
        </span>
        <h3 className="font-semibold text-white text-base">{title}</h3>
        <p className="text-sm text-white/70 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function PointsCard({
  value,
  tone,
  title,
  description,
}: {
  value: number;
  tone: "fire" | "electric" | "muted";
  title: string;
  description: string;
}) {
  const styles = {
    fire: {
      card: "border-accent/40 bg-fire-gradient/10",
      number: "text-fire-gradient",
    },
    electric: {
      card: "border-brand-electric/40 bg-brand-electric/5",
      number: "text-brand-electric",
    },
    muted: {
      card: "border-brand-electric/15 bg-card/70",
      number: "text-white",
    },
  }[tone];

  return (
    <Card className={`points-card opacity-0 ${styles.card}`}>
      <CardContent className="p-5 text-center space-y-2">
        <div
          className={`text-display text-6xl ${styles.number} leading-none`}
          aria-hidden="true"
        >
          {value}
        </div>
        <span className="sr-only">{value} puntos</span>
        <div className="text-sm font-semibold text-white">{title}</div>
        <p className="text-xs text-white/60 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function StateCard({
  badge,
  text,
}: {
  badge: React.ReactNode;
  text: string;
}) {
  return (
    <Card className="rules-card opacity-0 border-brand-electric/15 bg-card/70">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{badge}</div>
        <p className="text-sm text-white/70 leading-relaxed">{text}</p>
      </CardContent>
    </Card>
  );
}
