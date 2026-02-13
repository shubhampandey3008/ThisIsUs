'use client';

import { Heart, Sparkles, Star, Infinity, Check } from 'lucide-react';

const REACHED_STAGE = 2; // stages 1 & 2 are completed

const milestones = [
  {
    icon: Heart,
    title: 'The Day We Met',
    date: 'October 16, 2022',
    description:
      'Two paths crossing, two stories merging into one — the day it all began.',
    gradient: 'from-rose-400 to-pink-400',
    glowColor: 'rgba(251,113,133,0.45)',
  },
  {
    icon: Sparkles,
    title: 'Falling in Love',
    date: 'Somewhere along the way',
    description:
      'Not a single moment, but a thousand little ones — each one pulling us closer.',
    gradient: 'from-pink-400 to-fuchsia-400',
    glowColor: 'rgba(232,121,249,0.45)',
  },
  {
    icon: Star,
    title: 'Making It Official',
    date: 'The day we chose us',
    description:
      'No more maybes — we became us, wholeheartedly and without looking back.',
    gradient: 'from-fuchsia-400 to-purple-400',
    glowColor: 'rgba(192,132,252,0.45)',
  },
  {
    icon: Infinity,
    title: "Forever Each Other's",
    date: 'Now & Always',
    description:
      "This isn't the end of a chapter — it's a promise that the best is yet to come.",
    gradient: 'from-purple-400 to-violet-400',
    glowColor: 'rgba(167,139,250,0.45)',
  },
];

export default function OurJourney() {
  return (
    <div className="px-6 py-8 pb-4">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent mb-1.5">
          Our Story
        </p>
        <h2 className="text-2xl font-display font-bold tracking-tight">
          Our Journey
        </h2>
        <p className="text-sm text-muted mt-1">
          The milestones that made us, us.
        </p>
      </div>

      {/* Progress summary bar */}
      <div
        className="mb-8 animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">
            Progress
          </span>
          <span className="text-xs font-bold text-accent">
            {REACHED_STAGE} of {milestones.length} milestones
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-border/60 overflow-hidden">
          <div
            className="h-full rounded-full journey-line-reached transition-all duration-1000 ease-out"
            style={{ width: `${(REACHED_STAGE / milestones.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative ml-1">
        {/* Vertical line — reached portion */}
        <div
          className="absolute left-[17px] top-4 w-[3px] rounded-full journey-line-reached"
          style={{
            height: `calc(${((REACHED_STAGE - 0.5) / milestones.length) * 100}% - 8px)`,
          }}
        />
        {/* Vertical line — upcoming portion */}
        <div
          className="absolute left-[17px] bottom-4 w-px"
          style={{
            height: `calc(${((milestones.length - REACHED_STAGE + 0.5) / milestones.length) * 100}% - 8px)`,
            background:
              'repeating-linear-gradient(180deg, var(--border) 0px, var(--border) 6px, transparent 6px, transparent 12px)',
          }}
        />

        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const stageNum = index + 1;
            const isReached = stageNum <= REACHED_STAGE;
            const isCurrent = stageNum === REACHED_STAGE;

            return (
              <div
                key={milestone.title}
                className={`relative flex gap-4 animate-fade-in-up transition-opacity duration-500 ${
                  isReached ? 'opacity-100' : 'opacity-50'
                }`}
                style={{ animationDelay: `${0.15 + index * 0.12}s` }}
              >
                {/* Icon circle */}
                <div className="relative shrink-0">
                  {/* Ripple ring for current stage */}
                  {isCurrent && (
                    <div
                      className="absolute inset-0 rounded-full animate-ripple"
                      style={{
                        background: `radial-gradient(circle, ${milestone.glowColor} 0%, transparent 70%)`,
                      }}
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${
                      isReached ? milestone.gradient : 'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
                    } text-white shadow-lg ${isCurrent ? 'animate-glow-pulse' : ''}`}
                  >
                    {isReached ? (
                      <Icon size={16} strokeWidth={2.5} />
                    ) : (
                      <Icon size={16} strokeWidth={2} className="opacity-60" />
                    )}
                  </div>

                  {/* Completed check badge */}
                  {isReached && !isCurrent && (
                    <div className="absolute -bottom-0.5 -right-0.5 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
                      <Check size={10} strokeWidth={3} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-2xl border p-4 shadow-sm transition-all duration-500 ${
                    isReached
                      ? 'bg-card border-border'
                      : 'bg-card/50 border-border/50'
                  } ${isCurrent ? 'animate-border-glow' : ''}`}
                >
                  {/* Stage label */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${
                        isReached
                          ? 'bg-accent/15 text-accent'
                          : 'bg-muted-light/40 text-muted'
                      }`}
                    >
                      {isReached ? (
                        isCurrent ? (
                          <>
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
                            Current
                          </>
                        ) : (
                          'Completed'
                        )
                      ) : (
                        'Upcoming'
                      )}
                    </span>
                  </div>

                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent mb-1">
                    {milestone.date}
                  </p>
                  <h3
                    className={`text-[0.95rem] font-semibold mb-1 ${
                      isReached ? 'text-card-foreground' : 'text-muted'
                    }`}
                  >
                    {milestone.title}
                  </h3>
                  <p
                    className={`text-[0.8rem] leading-relaxed ${
                      isReached ? 'text-muted' : 'text-muted/60'
                    }`}
                  >
                    {milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
