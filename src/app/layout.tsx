import type { Metadata } from "next";
import { Outfit, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/structured-data";

// Body / UI font — geometric sans, Albula Pro alternative
const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Display font — heavy italic for impact headlines (Albula Pro ExtraBold Oblique replacement)
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["800", "900"],
  style: ["italic", "normal"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mundial-2026.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quiniela Mundial 2026 — Predice los resultados",
    template: "%s | Quiniela Mundial 2026",
  },
  description:
    "Participa en la quiniela del Mundial de Futbol 2026. Predice marcadores de los 104 partidos, compite contra amigos y escala en el ranking. USA, Mexico y Canada.",
  keywords: [
    "quiniela",
    "mundial 2026",
    "predicciones futbol",
    "world cup 2026",
    "FIFA",
    "pronosticos",
    "marcadores",
    "copa del mundo",
  ],
  authors: [{ name: "Legendsoft" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Quiniela Mundial 2026",
    title: "Quiniela Mundial 2026 — Predice los resultados",
    description:
      "Predice los marcadores de los 104 partidos del Mundial 2026. Compite contra amigos y escala en el ranking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiniela Mundial 2026",
    description:
      "Predice los marcadores del Mundial 2026 y compite por el primer lugar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <StructuredData />
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
