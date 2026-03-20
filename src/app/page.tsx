"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const worldCupDate = new Date("2026-06-11T00:00:00");
  const now = new Date();
  const diffMs = worldCupDate.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-blue-900">
          Mundial 2026
        </h1>
        <p className="text-xl text-blue-400">
          Quiniela del Mundial de Futbol
        </p>

        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-xl p-6 space-y-2 shadow-lg">
          <p className="text-sm text-blue-200 uppercase tracking-wide">
            Faltan
          </p>
          <p className="text-5xl font-bold tabular-nums">{diffDays}</p>
          <p className="text-sm text-blue-200">
            dias para el inicio del Mundial
          </p>
        </div>

        <p className="text-blue-400 text-sm">
          11 de junio - 19 de julio, 2026 &middot; USA, Mexico y Canada
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/matches">
            <Button size="lg" className="w-full min-w-[140px]">
              Ver partidos
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline" size="lg" className="w-full min-w-[140px]">
              Ver ranking
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
