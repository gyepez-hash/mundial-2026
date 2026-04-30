import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted via-secondary/70 to-muted ring-1 ring-border/30",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
