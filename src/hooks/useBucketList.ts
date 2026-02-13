'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BucketItem } from '@/types';

export type { BucketItem };

export function useBucketList() {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch from API on mount
  useEffect(() => {
    fetch('/api/bucket-list')
      .then((res) => res.json())
      .then((data: BucketItem[]) => {
        setItems(data);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  const addItem = useCallback(async (text: string) => {
    const res = await fetch('/api/bucket-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const newItem: BucketItem = await res.json();
    setItems((prev) => [newItem, ...prev]);
  }, []);

  const toggleItem = useCallback(async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const res = await fetch(`/api/bucket-list/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !item.completed }),
    });
    const updated: BucketItem = await res.json();
    setItems((prev) =>
      prev.map((i) => (i.id === id ? updated : i)),
    );
  }, [items]);

  const removeItem = useCallback(async (id: string) => {
    await fetch(`/api/bucket-list/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, loaded, addItem, toggleItem, removeItem };
}
