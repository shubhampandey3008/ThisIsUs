'use client';

import { useState } from 'react';
import BottomNav, { type Tab } from '@/components/BottomNav';
import HomePage from '@/components/HomePage';
import OurJourney from '@/components/OurJourney';
import BucketList from '@/components/BucketList';
import Experience from '@/components/Experience';
import EventCalendar from '@/components/EventCalendar';
import PoetryCatalog from '@/components/PoetryCatalog';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'journey' && <OurJourney />}
        {activeTab === 'calendar' && <EventCalendar />}
        {activeTab === 'bucket' && <BucketList />}
        {activeTab === 'catalog' && <PoetryCatalog />}
        {activeTab === 'map' && <Experience />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
