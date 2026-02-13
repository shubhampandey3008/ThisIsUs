'use client';

import { Heart, Route, ListChecks, MapPin, CalendarHeart, BookHeart } from 'lucide-react';

export type Tab = 'home' | 'journey' | 'bucket' | 'calendar' | 'map' | 'catalog';

const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: 'home', label: 'Home', icon: Heart },
  { id: 'journey', label: 'Journey', icon: Route },
  { id: 'calendar', label: 'Calendar', icon: CalendarHeart },
  { id: 'bucket', label: 'Wishes', icon: ListChecks },
  { id: 'catalog', label: 'Poetry', icon: BookHeart },
  { id: 'map', label: 'Map', icon: MapPin },
];

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="shrink-0 border-t border-border bg-card/80 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-xl transition-all duration-200 min-w-[44px] ${
                isActive
                  ? 'text-accent'
                  : 'text-muted active:text-foreground'
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                fill={isActive && id === 'home' ? 'currentColor' : 'none'}
              />
              <span
                className={`text-[0.65rem] leading-tight ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
