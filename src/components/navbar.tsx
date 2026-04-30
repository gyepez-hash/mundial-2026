"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import logo from "@/assets/Logo-Base-Blanco.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const showBack = pathname !== "/";

  const navLinks = [
    { href: "/matches", label: "Partidos" },
    { href: "/predictions", label: "Mis Predicciones" },
    { href: "/leaderboard", label: "Ranking" },
    { href: "/rules", label: "Reglas" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="sticky top-0 z-40 border-b border-border/40 bg-brand-navy/80 text-foreground backdrop-blur-md supports-[backdrop-filter]:bg-brand-navy/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label="Volver"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl tracking-tight text-foreground"
          >
            <Image src={logo} alt="Logo" className="h-8 w-auto -mt-4" />
            <span className="text-display text-lg uppercase leading-none">
              Mundial 2026
            </span>
          </Link>
          {session && (
            <div className="hidden items-center gap-1 sm:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      "after:absolute after:inset-x-3 after:-bottom-[18px] after:h-[2px] after:rounded-full after:bg-primary after:transition-opacity",
                      active ? "after:opacity-100" : "after:opacity-0"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive("/admin")
                      ? "text-accent"
                      : "text-accent/80 hover:text-accent"
                  )}
                >
                  Admin
                </Link>
              )}
            </div>
          )}
        </div>

        <div>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-9 w-9 rounded-full outline-none ring-1 ring-border/60 transition-shadow hover:ring-primary/60 focus-visible:ring-2 focus-visible:ring-ring/60">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? ""}
                  />
                  <AvatarFallback>
                    {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  {session.user.name}
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden">
                  <Link href="/matches" className="w-full">
                    Partidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden">
                  <Link href="/predictions" className="w-full">
                    Mis Predicciones
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden">
                  <Link href="/leaderboard" className="w-full">
                    Ranking
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden">
                  <Link href="/rules" className="w-full">
                    Reglas
                  </Link>
                </DropdownMenuItem>
                {session.user.role === "admin" && (
                  <DropdownMenuItem className="sm:hidden">
                    <Link href="/admin" className="w-full">
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  Cerrar sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button size="lg" variant="accent" className="px-5">
                Iniciar sesion
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
