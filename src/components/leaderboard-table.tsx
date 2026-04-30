import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { LeaderboardUser } from "@/lib/leaderboard";

export function LeaderboardTable({ users }: { users: LeaderboardUser[] }) {
  if (users.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Aun no hay predicciones calificadas.
      </p>
    );
  }

  const rankRowStyles = (rank: number) => {
    if (rank === 1)
      return "bg-accent/10 ring-1 ring-inset ring-accent/30 hover:bg-accent/15";
    if (rank === 2)
      return "bg-primary/10 ring-1 ring-inset ring-primary/30 hover:bg-primary/15";
    if (rank === 3)
      return "bg-accent-coral/10 ring-1 ring-inset ring-accent-coral/30 hover:bg-accent-coral/15";
    return "";
  };

  const rankNumberStyles = (rank: number) => {
    if (rank === 1) return "text-fire-gradient";
    if (rank === 2) return "text-primary";
    if (rank === 3) return "text-accent-coral";
    return "text-muted-foreground";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">#</TableHead>
          <TableHead>Jugador</TableHead>
          <TableHead className="text-right">Predicciones</TableHead>
          <TableHead className="text-right">Puntos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className={cn(rankRowStyles(user.rank))}>
            <TableCell>
              <span
                className={cn(
                  "text-display text-2xl leading-none",
                  rankNumberStyles(user.rank)
                )}
              >
                {user.rank}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback className="text-xs">
                    {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">
                  {user.name ?? "Anonimo"}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {user.totalPredictions}
            </TableCell>
            <TableCell className="text-right">
              <span
                className={cn(
                  "text-display text-xl tabular-nums",
                  user.rank === 1
                    ? "text-fire-gradient"
                    : "text-foreground"
                )}
              >
                {user.totalPoints}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
