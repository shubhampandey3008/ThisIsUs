'use client';

import { useCallback, useEffect, useState } from "react";
import type { Memory } from "@/data/memories";

export type NewMemoryInput = Omit<Memory, "id">;

export function usePersistentMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch memories from the API on mount
  useEffect(() => {
    fetch("/api/memories")
      .then((res) => res.json())
      .then((data: Memory[]) => {
        setMemories(data);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  const addMemory = useCallback(async (input: NewMemoryInput): Promise<string> => {
    const res = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const newMemory: Memory = await res.json();
    setMemories((prev) => [...prev, newMemory]);
    return newMemory.id;
  }, []);

  const updateMemory = useCallback(async (id: string, updates: NewMemoryInput) => {
    const res = await fetch(`/api/memories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated: Memory = await res.json();
    setMemories((prev) =>
      prev.map((memory) => (memory.id === id ? updated : memory)),
    );
  }, []);

  const removeMemory = useCallback(async (id: string) => {
    await fetch(`/api/memories/${id}`, { method: "DELETE" });
    setMemories((prev) => prev.filter((memory) => memory.id !== id));
  }, []);

  return { memories, loaded, addMemory, updateMemory, removeMemory };
}
