'use client';

import { useEffect, useState } from 'react';
import { Heart, Sun, Calendar, Clock } from 'lucide-react';

const RELATIONSHIP_START = new Date('2022-10-16T00:00:00');

function calculateStats() {
  const now = new Date();
  const diff = now.getTime() - RELATIONSHIP_START.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months =
    (now.getFullYear() - RELATIONSHIP_START.getFullYear()) * 12 +
    (now.getMonth() - RELATIONSHIP_START.getMonth());
  const hours = Math.floor(diff / (1000 * 60 * 60));

  return { days, sunsets: days, months, hours };
}

export default function HomePage() {
  const [stats, setStats] = useState(() => calculateStats());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setStats(calculateStats()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const statCards = [
    {
      value: stats.days.toLocaleString(),
      label: 'Days Together',
      icon: Calendar,
    },
    {
      value: stats.sunsets.toLocaleString(),
      label: 'Sunsets Shared',
      icon: Sun,
    },
    {
      value: stats.months.toLocaleString(),
      label: 'Months of Love',
      icon: Heart,
    },
    {
      value: stats.hours.toLocaleString(),
      label: 'Hours as One',
      icon: Clock,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      {/* Decorative flourish */}
      <div className="flex items-center gap-2 text-accent mb-4 animate-fade-in-up">
        <div className="h-px w-10 bg-accent/30" />
        <Heart
          size={14}
          fill="currentColor"
          className="animate-pulse-soft"
        />
        <div className="h-px w-10 bg-accent/30" />
      </div>

      {/* Title */}
      <h1
        className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-center mb-2 animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        Frames of Us
      </h1>
      <p
        className="text-muted text-sm tracking-widest uppercase mb-10 animate-fade-in-up"
        style={{ animationDelay: '0.15s' }}
      >
        since october 16, 2022
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-12">
        {statCards.map(({ value, label, icon: Icon }, index) => (
          <div
            key={label}
            className="rounded-2xl bg-card border border-border p-5 text-center shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${0.2 + index * 0.08}s` }}
          >
            <Icon
              size={18}
              className="mx-auto mb-2.5 text-accent"
              strokeWidth={1.5}
            />
            <p className="text-3xl font-bold font-display text-card-foreground leading-none">
              {value}
            </p>
            <p className="text-[0.7rem] text-muted mt-2 tracking-wide uppercase">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div
        className="text-center max-w-xs animate-fade-in-up"
        style={{ animationDelay: '0.55s' }}
      >
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-14 bg-border" />
          <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
          <div className="h-px w-14 bg-border" />
        </div>
        <p className="text-sm text-muted italic leading-relaxed font-display">
          &ldquo;Every sunset with you is a memory painted across the
          sky.&rdquo;
        </p>
      </div>
    </div>
  );
}
