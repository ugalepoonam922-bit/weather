import React from 'react';
import { Home, CalendarDays, Map, SlidersHorizontal } from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'forecast', label: 'Forecast', icon: CalendarDays },
    { id: 'radar', label: 'Radar / Map', icon: Map },
    { id: 'settings', label: 'Personalize', icon: SlidersHorizontal },
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Bottom Navigation">
      <div className="bottom-nav-content">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="nav-icon-container">
                <Icon size={20} className="nav-icon" />
                {isActive && <div className="nav-active-indicator" />}
              </div>
              <span className="nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
