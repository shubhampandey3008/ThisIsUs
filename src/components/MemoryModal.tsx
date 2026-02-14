import Image from "next/image";
import type { Memory } from "@/data/memories";

type MemoryModalProps = {
  memory: Memory | null;
  onClose: () => void;
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
};

export default function MemoryModal({
  memory,
  onClose,
  onEdit,
  onDelete,
}: MemoryModalProps) {
  if (!memory) return null;

  const date = new Date(memory.date);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <div
        className="pointer-events-auto absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <article className="pointer-events-auto relative z-10 mb-3 w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl shadow-black/40 sm:mb-0 max-h-[90vh] flex flex-col">
        <div className="relative w-full shrink-0 overflow-hidden rounded-t-3xl bg-black/90">
          <Image
            src={memory.imageUrl}
            alt={memory.title}
            width={800}
            height={600}
            className="object-contain w-full h-auto max-h-[50vh]"
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-zinc-300">
                {date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-zinc-50">
                {memory.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(memory)}
                className="inline-flex items-center rounded-full bg-zinc-50/95 px-2 py-0.5 text-[0.65rem] font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(memory.id)}
                className="inline-flex items-center rounded-full bg-red-500/90 px-2 py-0.5 text-[0.65rem] font-semibold text-white shadow-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 px-4 pb-3 pt-3 overflow-y-auto">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {memory.description}
          </p>

          <div className="flex items-center justify-between text-[0.7rem] text-zinc-500">
            <p>
              {memory.latitude.toFixed(4)}° N ·{" "}
              {Math.abs(memory.longitude).toFixed(4)}°{" "}
              {memory.longitude >= 0 ? "E" : "W"}
            </p>
            <p>Saved as a spatial memory</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mb-1 mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 active:scale-[0.99] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Back to map
          </button>
        </div>
      </article>
    </div>
  );
}

