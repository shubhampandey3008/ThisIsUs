'use client';

import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useBucketList } from '@/hooks/useBucketList';

export default function BucketList() {
  const { items, loaded, addItem, toggleItem, removeItem } = useBucketList();
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (trimmed) {
      addItem(trimmed);
      setNewText('');
    }
  };

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;

  if (!loaded) return null;

  return (
    <div className="px-6 py-8 pb-4">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent mb-1.5">
          Dreams &amp; Goals
        </p>
        <h2 className="text-2xl font-display font-bold tracking-tight">
          Our Bucket List
        </h2>
        <p className="text-sm text-muted mt-1">
          {completed} of {total} dreams fulfilled
        </p>
      </div>

      {/* Add input */}
      <div
        className="flex gap-2 mb-5 animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a dream..."
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-light outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="rounded-xl bg-accent px-4 py-3 text-white shadow-sm active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div
          className="mb-5 animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="h-1.5 rounded-full bg-accent-soft overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{
                width: `${total > 0 ? (completed / total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3.5 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${0.2 + index * 0.04}s` }}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleItem(item.id)}
              className={`shrink-0 flex items-center justify-center h-[22px] w-[22px] rounded-full border-2 transition-all duration-200 ${
                item.completed
                  ? 'bg-accent border-accent text-white'
                  : 'border-muted-light active:border-accent'
              }`}
            >
              {item.completed && <Check size={12} strokeWidth={3} />}
            </button>

            {/* Text */}
            <span
              className={`flex-1 text-sm leading-snug transition-all duration-200 ${
                item.completed
                  ? 'line-through text-muted'
                  : 'text-card-foreground'
              }`}
            >
              {item.text}
            </span>

            {/* Delete */}
            <button
              onClick={() => removeItem(item.id)}
              className="shrink-0 text-muted-light active:text-red-400 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {total === 0 && (
        <div className="text-center py-16 animate-fade-in-up">
          <p className="text-muted text-sm">
            No dreams yet — add your first one above!
          </p>
        </div>
      )}
    </div>
  );
}
