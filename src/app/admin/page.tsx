import { prisma } from "@/lib/prisma";
import { AdminMatchesClient } from "./admin-matches-client";

export default async function AdminPage() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: { matchNumber: "asc" },
  });

  const serialized = matches.map((m) => ({
    ...m,
    dateTime: m.dateTime.toISOString(),
  }));

  const total = serialized.length;
  const finished = serialized.filter((m) => m.status === "finished").length;
  const locked = serialized.filter((m) => m.status === "locked").length;
  const scheduled = serialized.filter((m) => m.status === "scheduled").length;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-display text-lg text-white not-italic mb-3">
          Resumen
        </h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryTile label="Total" value={total} />
          <SummaryTile label="Programados" value={scheduled} />
          <SummaryTile label="Bloqueados" value={locked} accent="electric" />
          <SummaryTile label="Finalizados" value={finished} accent="fire" />
        </dl>
      </section>

      <section aria-labelledby="admin-matches-heading">
        <h2
          id="admin-matches-heading"
          className="font-display text-lg text-white not-italic mb-3 flex items-center gap-3"
        >
          Administrar partidos
          <span className="flex-1 h-px bg-border" aria-hidden="true" />
        </h2>
        <AdminMatchesClient matches={serialized} />
      </section>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "electric" | "fire";
}) {
  const accentClass =
    accent === "fire"
      ? "text-fire-gradient"
      : accent === "electric"
        ? "text-brand-electric"
        : "text-white";

  return (
    <div className="rounded-lg border border-brand-electric/20 bg-card/70 px-4 py-3">
      <dt className="text-[0.6rem] uppercase tracking-widest text-white/50 font-mono">
        {label}
      </dt>
      <dd className={`text-display text-2xl ${accentClass} leading-none mt-1`}>
        {value}
      </dd>
    </div>
  );
}
