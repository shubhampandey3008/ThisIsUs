'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Poem } from '@/types';

export type { Poem };

export function usePoems() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/poems')
      .then((res) => res.json())
      .then((data: Poem[]) => {
        setPoems(data);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  const addPoem = useCallback(
    async (poem: {
      title: string;
      content: string;
      author: 'nikita' | 'shubham';
      language: 'english' | 'hindi';
    }) => {
      const res = await fetch('/api/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poem),
      });
      const newPoem: Poem = await res.json();
      setPoems((prev) => [newPoem, ...prev]);
    },
    [],
  );

  const updatePoem = useCallback(
    async (
      id: string,
      updates: Partial<Pick<Poem, 'title' | 'content' | 'language'>>,
    ) => {
      const res = await fetch(`/api/poems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated: Poem = await res.json();
      setPoems((prev) => prev.map((p) => (p.id === id ? updated : p)));
    },
    [],
  );

  const removePoem = useCallback(async (id: string) => {
    await fetch(`/api/poems/${id}`, { method: 'DELETE' });
    setPoems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const poemsByAuthor = useCallback(
    (author: 'nikita' | 'shubham') =>
      poems.filter((p) => p.author === author),
    [poems],
  );

  return { poems, loaded, addPoem, updatePoem, removePoem, poemsByAuthor };
}
