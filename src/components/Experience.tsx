'use client';

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Memory } from "@/data/memories";
import MemoryTimeline from "./MemoryTimeline";
import MemoryModal from "./MemoryModal";
import AddMemoryModal from "./AddMemoryModal";
import EditMemoryModal from "./EditMemoryModal";
import { usePersistentMemories } from "@/hooks/usePersistentMemories";

const MemoryMap = dynamic(() => import("./MemoryMap"), {
  ssr: false,
});

export default function Experience() {
  const { memories, loaded, addMemory, updateMemory, removeMemory } =
    usePersistentMemories();

  const sortedMemories = useMemo(
    () =>
      [...memories].sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [memories],
  );

  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(
    null,
  );
  const [modalMemoryId, setModalMemoryId] = useState<string | null>(null);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [draftLocation, setDraftLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapFocusTrigger, setMapFocusTrigger] = useState(0);

  useEffect(() => {
    if (!activeMemoryId && sortedMemories.length > 0) {
      setActiveMemoryId(sortedMemories[0].id);
    }
  }, [activeMemoryId, sortedMemories]);

  const activeMemory =
    sortedMemories.find((m) => m.id === activeMemoryId) ?? null;
  const modalMemory =
    sortedMemories.find((m) => m.id === modalMemoryId) ?? null;
  const editingMemory =
    sortedMemories.find((m) => m.id === editingMemoryId) ?? null;

  const handleSaveNewMemory = async (input: Omit<Memory, "id">) => {
    const newId = await addMemory(input);
    setDraftLocation(null);
    setIsPickingLocation(false);
    setActiveMemoryId(newId);
    setModalMemoryId(newId);
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted animate-pulse">Loading memories...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <main className="relative flex min-h-0 flex-1 flex-col">
        <section className="relative h-[58vh] min-h-[280px] overflow-hidden bg-zinc-900 shadow-inner">
          <MemoryMap
            memories={sortedMemories}
            activeMemoryId={activeMemoryId}
            mapFocusTrigger={mapFocusTrigger}
            onActiveMemoryChange={(id) => {
              setActiveMemoryId(id);
              setMapFocusTrigger((prev) => prev + 1);
            }}
            onMemoryOpen={(id) => {
              setModalMemoryId(id);
              setActiveMemoryId(id);
              setMapFocusTrigger((prev) => prev + 1);
            }}
            isPickingLocation={isPickingLocation}
            onTogglePickingLocation={() => {
              setDraftLocation(null);
              setIsPickingLocation((prev) => !prev);
            }}
            onLocationPicked={(lat, lng) => {
              setDraftLocation({ latitude: lat, longitude: lng });
              setIsPickingLocation(false);
            }}
          />
        </section>

        <section className="relative z-10 -mt-3 rounded-t-2xl bg-background/95 pb-3 pt-2 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] backdrop-blur">
          <div className="flex items-center justify-between px-4 pb-1">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-zinc-500">
                Timeline
              </p>
              <p className="text-xs text-zinc-500">
                {sortedMemories.length > 0
                  ? "Scroll or tap to move through time."
                  : "Add your first memory to get started."}
              </p>
            </div>
          </div>

          <MemoryTimeline
            memories={sortedMemories}
            activeMemoryId={activeMemoryId}
            onActiveMemoryChange={(id) => {
              setActiveMemoryId(id);
              setMapFocusTrigger((prev) => prev + 1);
            }}
            onMemoryOpen={(id) => {
              setModalMemoryId(id);
              setActiveMemoryId(id);
              setMapFocusTrigger((prev) => prev + 1);
            }}
          />
        </section>
      </main>

      <MemoryModal
        memory={modalMemory}
        onClose={() => setModalMemoryId(null)}
        onEdit={(memory) => {
          setEditingMemoryId(memory.id);
          setModalMemoryId(null);
        }}
        onDelete={(id) => {
          removeMemory(id);
          if (activeMemoryId === id) {
            setActiveMemoryId(null);
          }
          if (modalMemoryId === id) {
            setModalMemoryId(null);
          }
        }}
      />

      <AddMemoryModal
        location={draftLocation}
        onSave={handleSaveNewMemory}
        onClose={() => {
          setDraftLocation(null);
          setIsPickingLocation(false);
        }}
      />

      <EditMemoryModal
        memory={editingMemory}
        onSave={(id, updates) => {
          updateMemory(id, updates);
          setEditingMemoryId(null);
        }}
        onDelete={(id) => {
          removeMemory(id);
          setEditingMemoryId(null);
          if (activeMemoryId === id) {
            setActiveMemoryId(null);
          }
          if (modalMemoryId === id) {
            setModalMemoryId(null);
          }
        }}
        onClose={() => setEditingMemoryId(null)}
      />
    </div>
  );
}
