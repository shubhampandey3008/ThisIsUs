'use client';

import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Repeat,
  CalendarDays,
  CalendarClock,
  Pencil,
} from 'lucide-react';
import { useEvents, type CalendarEvent } from '@/hooks/useEvents';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

const RECURRENCE_OPTIONS: { value: CalendarEvent['recurrence']; label: string; icon: typeof Repeat }[] = [
  { value: 'one-time', label: 'One time', icon: CalendarDays },
  { value: 'monthly', label: 'Monthly', icon: CalendarClock },
  { value: 'yearly', label: 'Yearly', icon: Repeat },
];

function RecurrenceBadge({ recurrence }: { recurrence: CalendarEvent['recurrence'] }) {
  const config = {
    'one-time': { label: 'Once', className: 'bg-accent-soft text-accent' },
    monthly: { label: 'Monthly', className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' },
    yearly: { label: 'Yearly', className: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400' },
  };
  const { label, className } = config[recurrence];
  return (
    <span className={`text-[0.6rem] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${className}`}>
      {label}
    </span>
  );
}

export default function EventCalendar() {
  const { events, loaded, addEvent, updateEvent, removeEvent } = useEvents();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formRecurrence, setFormRecurrence] = useState<CalendarEvent['recurrence']>('one-time');

  // Build a map of dateKey -> events for the current view month
  // Includes recurring events
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);

    for (const event of events) {
      const parsed = parseDate(event.date);

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = formatDateKey(viewYear, viewMonth, day);
        let matches = false;

        if (event.recurrence === 'one-time') {
          matches = event.date === dateKey;
        } else if (event.recurrence === 'yearly') {
          matches = parsed.month === viewMonth && parsed.day === day;
        } else if (event.recurrence === 'monthly') {
          matches = parsed.day === day;
        }

        if (matches) {
          if (!map[dateKey]) map[dateKey] = [];
          map[dateKey].push(event);
        }
      }
    }

    return map;
  }, [events, viewYear, viewMonth]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const goToPrev = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNext = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(todayKey);
  };

  const handleDayClick = (day: number) => {
    const key = formatDateKey(viewYear, viewMonth, day);
    setSelectedDate(key === selectedDate ? null : key);
  };

  const openAddModal = (dateKey?: string) => {
    setEditingEvent(null);
    setFormTitle('');
    setFormRecurrence('one-time');
    if (dateKey) setSelectedDate(dateKey);
    setShowAddModal(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormRecurrence(event.recurrence);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    const trimmed = formTitle.trim();
    if (!trimmed || !selectedDate) return;

    if (editingEvent) {
      await updateEvent(editingEvent.id, {
        title: trimmed,
        date: selectedDate,
        recurrence: formRecurrence,
      });
    } else {
      await addEvent({
        title: trimmed,
        date: selectedDate,
        recurrence: formRecurrence,
      });
    }

    setShowAddModal(false);
    setFormTitle('');
    setFormRecurrence('one-time');
    setEditingEvent(null);
  };

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  if (!loaded) return null;

  return (
    <div className="px-4 py-8 pb-4">
      {/* Header */}
      <div className="mb-5 animate-fade-in-up">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent mb-1.5">
          Important Dates
        </p>
        <h2 className="text-2xl font-display font-bold tracking-tight">
          Our Calendar
        </h2>
        <p className="text-sm text-muted mt-1">
          {events.length} event{events.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Month Navigation */}
      <div
        className="flex items-center justify-between mb-4 animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        <button
          onClick={goToPrev}
          className="p-2 rounded-xl text-muted active:text-foreground active:bg-accent-soft transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <button onClick={goToToday} className="text-center">
          <span className="text-lg font-display font-bold text-card-foreground">
            {MONTH_NAMES[viewMonth]}
          </span>
          <span className="text-lg font-display font-bold text-accent ml-2">
            {viewYear}
          </span>
        </button>

        <button
          onClick={goToNext}
          className="p-2 rounded-xl text-muted active:text-foreground active:bg-accent-soft transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Labels */}
      <div
        className="grid grid-cols-7 mb-1 animate-fade-in-up"
        style={{ animationDelay: '0.15s' }}
      >
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[0.65rem] font-semibold uppercase tracking-wider text-muted py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        className="grid grid-cols-7 gap-px bg-border rounded-2xl overflow-hidden shadow-sm border border-border animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        {/* Empty cells for offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-card/50 aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = formatDateKey(viewYear, viewMonth, day);
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const dayEvents = eventsByDate[dateKey] || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative bg-card aspect-square flex flex-col items-center justify-center transition-all duration-150
                ${isSelected ? 'bg-accent text-white z-10 shadow-lg' : ''}
                ${isToday && !isSelected ? 'bg-accent-soft' : ''}
                ${!isSelected && !isToday ? 'active:bg-accent-soft/50' : ''}
              `}
            >
              <span
                className={`text-sm leading-none ${
                  isSelected
                    ? 'font-bold'
                    : isToday
                      ? 'font-bold text-accent'
                      : 'text-card-foreground'
                }`}
              >
                {day}
              </span>
              {hasEvents && (
                <div className="flex gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white/80' : 'bg-accent'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}

        {/* Fill remaining cells to complete the grid */}
        {(() => {
          const totalCells = firstDay + daysInMonth;
          const remainder = totalCells % 7;
          if (remainder === 0) return null;
          return Array.from({ length: 7 - remainder }).map((_, i) => (
            <div key={`trail-${i}`} className="bg-card/50 aspect-square" />
          ));
        })()}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-5 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-card-foreground">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <button
              onClick={() => openAddModal(selectedDate)}
              className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-white text-xs font-semibold active:scale-95 transition-transform shadow-sm"
            >
              <Plus size={14} strokeWidth={2.5} />
              Add
            </button>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="text-center py-8 rounded-xl bg-card border border-border">
              <p className="text-muted text-sm">No events on this day</p>
              <p className="text-muted-light text-xs mt-1">Tap &quot;Add&quot; to create one</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {event.title}
                    </p>
                    <div className="mt-1">
                      <RecurrenceBadge recurrence={event.recurrence} />
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal(event)}
                    className="shrink-0 text-muted-light active:text-accent transition-colors p-1"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="shrink-0 text-muted-light active:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedDate && (
        <div className="mt-5 text-center py-8 rounded-xl bg-card border border-border animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <CalendarDays size={28} className="mx-auto text-muted-light mb-2" />
          <p className="text-muted text-sm">Select a date to view or add events</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false);
              setEditingEvent(null);
            }}
          />
          <div className="relative w-full max-w-md bg-card rounded-t-3xl sm:rounded-2xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl border border-border animate-fade-in-up">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingEvent(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted active:text-foreground active:bg-accent-soft transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-display font-bold mb-1">
              {editingEvent ? 'Edit Event' : 'New Event'}
            </h3>
            <p className="text-xs text-muted mb-5">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            {/* Title */}
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Anniversary, Birthday..."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-card-foreground placeholder:text-muted-light outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all mb-5"
              autoFocus
            />

            {/* Recurrence */}
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Recurrence
            </label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {RECURRENCE_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFormRecurrence(value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-center ${
                    formRecurrence === value
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-border bg-card text-muted active:border-accent/50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-[0.65rem] font-semibold leading-tight">{label}</span>
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!formTitle.trim()}
              className="w-full rounded-xl bg-accent py-3.5 text-white text-sm font-semibold shadow-sm active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100"
            >
              {editingEvent ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
