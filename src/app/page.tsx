"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";

const WORLD_CUP_DATE = new Date("2026-06-11T00:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const SERVER_SNAPSHOT: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

let cachedSnapshot = SERVER_SNAPSHOT;
let cachedSecond = -1;

function getSnapshot(): TimeLeft {
  const now = Math.floor(Date.now() / 1000);
  if (now !== cachedSecond) {
    cachedSecond = now;
    const diff = Math.max(0, Math.floor((WORLD_CUP_DATE - now * 1000) / 1000));
    cachedSnapshot = {
      days: Math.floor(diff / 86400),
      hours: Math.floor((diff % 86400) / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
    };
  }
  return cachedSnapshot;
}

function getServerSnapshot(): TimeLeft {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void) {
  const interval = setInterval(onStoreChange, 1000);
  return () => clearInterval(interval);
}

function useCountdown(): TimeLeft {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function HomePage() {
  const { data: session } = useSession();
  const timeLeft = useCountdown();

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        Array.from(particles).forEach((particle) => {
          gsap.set(particle, {
            x: gsap.utils.random(0, window.innerWidth),
            y: gsap.utils.random(0, window.innerHeight),
            opacity: gsap.utils.random(0.1, 0.4),
            scale: gsap.utils.random(0.3, 1),
          });
          gsap.to(particle, {
            y: `-=${gsap.utils.random(100, 300)}`,
            x: `+=${gsap.utils.random(-80, 80)}`,
            opacity: 0,
            duration: gsap.utils.random(3, 6),
            repeat: -1,
            ease: "none",
            delay: gsap.utils.random(0, 3),
          });
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.7, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "back.out(1.6)" }
      );

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.4"
      );

      tl.fromTo(
        ".countdown-item",
        { opacity: 0, y: 30, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "back.out(1.4)",
        },
        "-=0.2"
      );

      tl.fromTo(
        ".action-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      );

      tl.fromTo(
        ".feature-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.1"
      );

      gsap.to(countdownRef.current, {
        boxShadow: "0 0 60px rgba(72, 125, 251, 0.35)",
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand-electric/40"
          />
        ))}
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="text-center space-y-6 sm:space-y-8 max-w-3xl mx-auto">
          <p
            ref={subtitleRef}
            className="text-xs sm:text-sm uppercase tracking-[0.3em] text-brand-electric font-mono opacity-0"
          >
            Quiniela &middot; USA &middot; Mexico &middot; Canada
          </p>

          <h1
            ref={titleRef}
            className="text-display text-6xl sm:text-8xl lg:text-9xl text-white opacity-0 leading-[0.9]"
          >
            MUNDIAL <span className="text-fire-gradient">2026</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            Predice los marcadores, compite contra tus amigos y se el primero en gritar{" "}
            <span className="text-display not-italic font-display text-fire-gradient text-2xl sm:text-3xl align-baseline">
              GOL
            </span>
            .
          </p>

          {/* Countdown */}
          <div
            ref={countdownRef}
            className="bg-card/80 backdrop-blur-md border border-brand-electric/20 rounded-2xl p-5 sm:p-6 max-w-lg mx-auto"
          >
            <p className="text-[0.65rem] sm:text-xs text-brand-electric uppercase tracking-[0.25em] mb-3 font-mono">
              Arranca en
            </p>
            <div
              role="timer"
              aria-label="Cuenta regresiva al inicio del Mundial 2026"
              className="flex items-end justify-center gap-2 sm:gap-3"
            >
              <CountdownUnit value={timeLeft.days} label="Dias" />
              <CountdownSeparator />
              <CountdownUnit value={timeLeft.hours} label="Horas" />
              <CountdownSeparator />
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <CountdownSeparator />
              <CountdownUnit value={timeLeft.seconds} label="Seg" />
            </div>
            <p className="text-[0.65rem] sm:text-xs text-white/50 mt-3 font-mono">
              11 jun &mdash; 19 jul, 2026
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href={session ? "/matches" : "/sign-in"} className="action-btn opacity-0">
              <Button
                variant="accent"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold"
              >
                {session ? "Empezar a predecir" : "Empezar"}
              </Button>
            </Link>
            <Link href="/leaderboard" className="action-btn opacity-0">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base"
              >
                Ver ranking
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          <FeatureCard
            icon="01"
            title="Predicciones"
            description="Marca tu pronostico para los 104 partidos antes del silbatazo inicial."
            href="/matches"
            cta="Ver partidos"
          />
          <FeatureCard
            icon="02"
            title="Ranking"
            description="Sube posiciones partido a partido. El mejor pronosticador se lleva la gloria."
            href="/leaderboard"
            cta="Ver tabla"
          />
          <FeatureCard
            icon="03"
            title="Reglas"
            description="Marcador exacto, ganador, empate. Conoce como se reparten los puntos."
            href="/rules"
            cta="Leer reglas"
          />
        </div>
      </section>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-item flex flex-col items-center opacity-0 min-w-[3.5rem] sm:min-w-[4.5rem]">
      <span
        className="text-display text-4xl sm:text-6xl text-white tabular-nums leading-none"
        aria-hidden="true"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="sr-only">{`${value} ${label}`}</span>
      <span className="text-[0.6rem] sm:text-xs text-brand-electric/80 uppercase tracking-[0.2em] mt-2 font-mono">
        {label}
      </span>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <span
      className="text-display text-4xl sm:text-6xl text-brand-electric/40 self-start leading-none mt-1"
      aria-hidden="true"
    >
      :
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="feature-card opacity-0 group block">
      <Card className="h-full bg-card/70 border-brand-electric/20 hover:border-brand-electric/60 transition-all hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(72,125,251,0.18)]">
        <CardContent className="p-6 space-y-3">
          <span className="font-mono text-xs text-brand-electric tracking-widest">
            {icon}
          </span>
          <h2 className="font-display text-2xl text-white not-italic">
            {title}
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">{description}</p>
          <p className="pt-2 text-sm text-brand-electric font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            {cta}
            <span aria-hidden="true">&rarr;</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
