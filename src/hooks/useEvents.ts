'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CalendarEvent } from '@/types';

export type { CalendarEvent };

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data: CalendarEvent[]) => {
        setEvents(data);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  const addEvent = useCallback(
    async (event: { title: string; date: string; recurrence: CalendarEvent['recurrence'] }) => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      const newEvent: CalendarEvent = await res.json();
      setEvents((prev) => [newEvent, ...prev]);
    },
    [],
  );

  const updateEvent = useCallback(
    async (id: string, updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>) => {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated: CalendarEvent = await res.json();
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    },
    [],
  );

  const removeEvent = useCallback(async (id: string) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { events, loaded, addEvent, updateEvent, removeEvent };
}
