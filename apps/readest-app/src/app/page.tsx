'use client';

import React, { useState } from 'react';
import { MdMenuBook, MdExplore, MdQuiz } from 'react-icons/md';
import { MdTrendingUp as MdTrendingUpIcon } from 'react-icons/md';
import type { IconType } from 'react-icons';
import LibraryPage from './library/page';
import ExplorePage from './explore/page';
import ReviewPage from './review/page';
import MasteryPage from './mastery/page';

interface Tab {
  id: string;
  label: string;
  icon: IconType;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  { id: 'library', label: 'Library', icon: MdMenuBook, component: LibraryPage },
  { id: 'explore', label: 'Explore', icon: MdExplore, component: ExplorePage },
  { id: 'review', label: 'Review', icon: MdQuiz, component: ReviewPage },
  { id: 'mastery', label: 'Mastery', icon: MdTrendingUpIcon, component: MasteryPage },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('library');
  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component ?? LibraryPage;

  return (
    <div className='flex flex-col h-screen bg-base-200'>
      <div className='flex-1 overflow-hidden'>
        <ActiveComponent />
      </div>
      <nav className='btm-nav btm-nav-sm bg-base-100 border-t border-base-300 z-50'>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onTap={() => setActiveTab(tab.id)}
          />
        ))}
      </nav>
    </div>
  );
}

function TabButton({ tab, isActive, onTap }: { tab: Tab; isActive: boolean; onTap: () => void }) {
  const Icon = tab.icon;
  return (
    <button
      className={`${isActive ? 'active text-primary' : 'text-base-content/50'} transition-colors`}
      onClick={onTap}
    >
      <Icon size={22} />
      <span className='btm-nav-label text-xs'>{tab.label}</span>
    </button>
  );
}
