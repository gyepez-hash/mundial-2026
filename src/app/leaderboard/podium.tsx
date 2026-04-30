import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LeaderboardUser } from "@/lib/leaderboard";

type PodiumStyle = "gold" | "silver" | "bronze";

const STYLES: Record<
  PodiumStyle,
  {
    container: string;
    badge: string;
    badgeText: string;
    glow: string;
    label: string;
  }
> = {
  gold: {
    container: "bg-fire-gradient border-transparent",
    badge: "bg-white/20 text-white",
    badgeText: "text-white",
    glow: "shadow-[0_0_60px_rgba(107,177,226,0.35)]",
    label: "Lider",
  },
  silver: {
    container: "bg-electric-gradient border-transparent",
    badge: "bg-white/20 text-white",
    badgeText: "text-white",
    glow: "shadow-[0_0_45px_rgba(72,125,251,0.3)]",
    label: "2do lugar",
  },
  bronze: {
    container: "bg-card/80 border-brand-electric/15",
    badge: "bg-brand-electric/15 text-brand-electric",
    badgeText: "text-white",
    glow: "",
    label: "3er lugar",
  },
};

export function LeaderboardPodium({ users }: { users: LeaderboardUser[] }) {
  if (users.length === 0) {
    return null;
  }

  const top3 = users.slice(0, 3);
  const styles: PodiumStyle[] = ["gold", "silver", "bronze"];

  return (
    <section aria-label="Top 3 del ranking" className="grid gap-3 sm:gap-4 sm:grid-cols-3">
      {top3.map((user, idx) => {
        const style = STYLES[styles[idx]];
        const desktopOrder = idx === 0 ? "sm:order-2" : idx === 1 ? "sm:order-1" : "sm:order-3";
        const heightClass =
          idx === 0
            ? "sm:pt-10 sm:pb-8"
            : idx === 1
            ? "sm:pt-7 sm:pb-7"
            : "sm:pt-6 sm:pb-6";

        return (
          <article
            key={user.id}
            className={`relative rounded-2xl border ${style.container} ${style.glow} ${desktopOrder} px-5 py-6 ${heightClass} flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5`}
          >
            <span
              className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[0.65rem] font-mono uppercase tracking-widest ${style.badge}`}
            >
              {style.label}
            </span>

            <div
              className={`text-display ${
                idx === 0 ? "text-7xl sm:text-8xl" : "text-6xl sm:text-7xl"
              } ${style.badgeText} leading-none`}
              aria-hidden="true"
            >
              {user.rank}
            </div>

            <Avatar className="h-14 w-14 ring-2 ring-white/30">
              <AvatarImage src={user.image ?? ""} alt="" />
              <AvatarFallback className="text-sm bg-black/20 text-white">
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <p className={`font-semibold text-base ${style.badgeText} truncate max-w-full`}>
              {user.name ?? "Anonimo"}
            </p>

            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-display text-3xl sm:text-4xl ${style.badgeText}`}
                aria-label={`${user.totalPoints} puntos`}
              >
                {user.totalPoints}
              </span>
              <span className={`text-xs uppercase tracking-widest ${style.badgeText} opacity-80`}>
                pts
              </span>
            </div>

            <p className={`text-[0.7rem] ${style.badgeText} opacity-70 font-mono`}>
              {user.totalPredictions} predicciones
            </p>
          </article>
        );
      })}
    </section>
  );
}
