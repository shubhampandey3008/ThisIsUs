import { useEffect, useState } from "react";
import type { Memory } from "@/data/memories";
import { uploadImage } from "@/lib/upload";

type EditMemoryModalProps = {
  memory: Memory | null;
  onSave: (id: string, updates: Omit<Memory, "id">) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export default function EditMemoryModal({
  memory,
  onSave,
  onDelete,
  onClose,
}: EditMemoryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form state when the memory prop changes
  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setDescription(memory.description);
      setDate(new Date(memory.date).toISOString().slice(0, 16));
      setFile(null);
      setIsSubmitting(false);
    }
  }, [memory]);

  if (!memory) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      let imageUrl = memory.imageUrl;
      if (file) {
        imageUrl = await uploadImage(file);
      }

      onSave(memory.id, {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date).toISOString(),
        latitude: memory.latitude,
        longitude: memory.longitude,
        imageUrl,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    onDelete(memory.id);
    onClose();
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <div
        className="pointer-events-auto absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="pointer-events-auto relative z-10 mb-3 w-full max-w-md rounded-3xl bg-background shadow-2xl shadow-black/40 sm:mb-0"
      >
        <div className="border-b border-zinc-200 px-4 pb-2 pt-3 dark:border-zinc-800">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Edit memory
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Adjust the title, note, date, or photo.
          </p>
        </div>

        <div className="space-y-3 px-4 pb-4 pt-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Note
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
            />
          </div>

          <div className="space-y-2 rounded-2xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-900/60">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
              When did this happen?
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Date &amp; time
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
                />
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setFile(event.target.files?.[0] ?? null)
                  }
                  className="block w-full text-xs text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-50 hover:file:bg-zinc-800 dark:text-zinc-300 dark:file:bg-zinc-50 dark:file:text-zinc-900 dark:hover:file:bg-zinc-100"
                />
                <p className="text-[0.65rem] text-zinc-500">
                  Leave empty to keep the current photo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-1 flex gap-2 pb-1 pt-1">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 active:scale-[0.99] dark:border-red-500/60 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-900/60"
            >
              Delete
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 dark:disabled:bg-zinc-500"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
