import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <header className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-display text-3xl sm:text-4xl text-white">
            ADMIN
          </h1>
          <span className="text-[0.65rem] font-mono uppercase tracking-widest text-brand-electric">
            Panel de control
          </span>
        </div>
        <nav
          className="flex gap-1 rounded-lg border border-brand-electric/20 bg-card/70 p-1 text-sm w-full sm:w-auto"
          aria-label="Secciones de administracion"
        >
          <AdminNavLink href="/admin">Partidos</AdminNavLink>
          <AdminNavLink href="/admin/scoring">Puntuacion</AdminNavLink>
        </nav>
      </header>
      {children}
    </div>
  );
}

function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex-1 sm:flex-none px-3 py-1.5 rounded-md text-center text-white/70 hover:text-white hover:bg-brand-electric/15 transition-colors"
    >
      {children}
    </Link>
  );
}
