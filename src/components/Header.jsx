import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Moon, Sparkles, UserCheck, Settings as SettingsIcon } from 'lucide-react';

const PERSONA_LABELS = {
  general: { label: 'General Mode', icon: '👤', color: '#0284c7' },
  farmer: { label: 'Farmer / Kisan', icon: '🌾', color: '#16a34a' },
  fitness: { label: 'Outdoor Fitness', icon: '🏃', color: '#ea580c' },
  health: { label: 'Health Sensitive', icon: '🫁', color: '#8b5cf6' },
  commuter: { label: 'Daily Commuter', icon: '🚆', color: '#0891b2' },
};

export default function Header({
  cityName,
  persona,
  onOpenSettings,
  onOpenCompare,
  onOpenShare,
  theme,
  onToggleTheme,
  unit,
  onToggleUnit,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const personaInfo = PERSONA_LABELS[persona] || PERSONA_LABELS.general;

  return (
    <header className="app-header">
      {/* Top Bar Branding */}
      <div className="header-top">
        <div className="brand-group">
          <div className="brand-icon-wrapper">
            <Cloud className="brand-icon" size={24} />
            <div className="india-badge-dot"></div>
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">मौसम MAUSAM</h1>
              <span className="gov-tag">IMD • MoES</span>
            </div>
            <p className="brand-subtitle">National Weather Intelligence Portal</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Unit Toggle Button */}
          <button
            className="header-pill-btn"
            onClick={onToggleUnit}
            title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
          >
            <span className={unit === 'C' ? 'pill-active' : ''}>°C</span>
            <span className="pill-divider">/</span>
            <span className={unit === 'F' ? 'pill-active' : ''}>°F</span>
          </button>

          {/* Compare Cities Trigger */}
          {onOpenCompare && (
            <button
              className="icon-btn"
              onClick={onOpenCompare}
              aria-label="Compare Cities"
              title="Compare Weather Across Cities"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="M7 21h10"/>
                <path d="M12 3v18"/>
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
              </svg>
            </button>
          )}

          {/* Share Trigger */}
          {onOpenShare && (
            <button
              className="icon-btn"
              onClick={onOpenShare}
              aria-label="Share Weather Bulletin"
              title="Share Weather Bulletin"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
              </svg>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} className="theme-icon-sun" /> : <Moon size={18} />}
          </button>

          {/* Settings Trigger */}
          <button
            className="icon-btn"
            onClick={onOpenSettings}
            aria-label="Personalization Settings"
            title="Personalization Settings"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </div>

      {/* Greeting and Persona Bar */}
      <div className="greeting-card">
        <div className="greeting-text">
          <h2 className="greeting-heading">
            {getGreeting()}! <span className="greeting-wave">👋</span>
          </h2>
          <p className="greeting-datetime">
            <span>{formattedDate}</span>
            <span className="bullet-sep">•</span>
            <span>{formattedTime} IST</span>
          </p>
        </div>

        {/* Persona Tag */}
        <button
          className="persona-badge"
          onClick={onOpenSettings}
          title="Click to change your personalization persona"
        >
          <span className="persona-emoji">{personaInfo.icon}</span>
          <span className="persona-text">{personaInfo.label}</span>
          <Sparkles size={12} className="persona-sparkle" />
        </button>
      </div>
    </header>
  );
}
