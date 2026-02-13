import type { Memory } from "@/data/memories";
import { useEffect, useRef } from "react";

type MemoryTimelineProps = {
  memories: Memory[];
  activeMemoryId: string | null;
  onActiveMemoryChange: (id: string) => void;
  onMemoryOpen: (id: string) => void;
};

export default function MemoryTimeline({
  memories,
  activeMemoryId,
  onActiveMemoryChange,
  onMemoryOpen,
}: MemoryTimelineProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeMemoryId || !scrollRef.current) return;
    const container = scrollRef.current;
    const activeCard = container.querySelector<HTMLDivElement>(
      `[data-memory-id="${activeMemoryId}"]`,
    );
    if (!activeCard) return;

    const cardCenter =
      activeCard.offsetLeft + activeCard.offsetWidth / 2;
    const containerCenter =
      container.scrollLeft + container.offsetWidth / 2;
    const delta = cardCenter - containerCenter;

    container.scrollTo({
      left: container.scrollLeft + delta,
      behavior: "smooth",
    });
  }, [activeMemoryId]);

  return (
    <div className="relative mt-1 border-t border-zinc-900/5 pt-3">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent" />

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 pt-1"
      >
        {memories.map((memory) => {
          const isActive = memory.id === activeMemoryId;
          const date = new Date(memory.date);

          return (
            <button
              key={memory.id}
              type="button"
              data-memory-id={memory.id}
              onClick={() => {
                onActiveMemoryChange(memory.id);
                onMemoryOpen(memory.id);
              }}
              className={`flex min-w-[70%] max-w-[82%] flex-shrink-0 flex-col items-start rounded-2xl border px-3.5 py-2.5 text-left shadow-sm transition-all active:scale-[0.98] sm:min-w-[260px] ${
                isActive
                  ? "border-emerald-400/70 bg-emerald-500/5 shadow-emerald-500/20"
                  : "border-zinc-200 bg-white/80 hover:border-zinc-300 hover:bg-white/95 dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:hover:border-zinc-700"
              }`}
            >
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </p>
              <h2 className="mt-1 text-sm font-semibold leading-snug">
                {memory.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                {memory.description}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-[0.7rem] font-medium text-emerald-500">
                Jump to this moment
                <span aria-hidden="true">↗</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

