import React from 'react';
import {
  X,
  Sliders,
  Moon,
  Sun,
  Thermometer,
  Eye,
  MapPin,
  Trash2,
  Database,
  Check,
  User,
} from 'lucide-react';
import { POPULAR_INDIAN_CITIES } from '../services/weatherService';

export default function SettingsModal({
  isOpen,
  onClose,
  persona,
  onSelectPersona,
  unit,
  onToggleUnit,
  theme,
  onToggleTheme,
  visibleCards,
  onToggleCardVisibility,
  favorites,
  onRemoveFavorite,
  onAddFavorite,
  isDemoMode,
  onToggleDemoMode,
}) {
  if (!isOpen) return null;

  const personas = [
    {
      id: 'general',
      title: 'General Citizen',
      desc: 'Balanced overview for daily commuting, weather outlook, and routine chores.',
      icon: '👤',
    },
    {
      id: 'farmer',
      title: 'Farmer / Agriculturalist',
      desc: 'Highlights precipitation timing, wind speeds for spraying, and sowing windows.',
      icon: '🌾',
    },
    {
      id: 'commuter',
      title: 'Daily Commuter',
      desc: 'Focuses on 4-hour rain nowcasts, waterlogging delays, and road visibility.',
      icon: '🚆',
    },
    {
      id: 'fitness',
      title: 'Outdoor Fitness & Sports',
      desc: 'Prioritizes UV index alerts, peak heat index, and optimal morning/evening workout hours.',
      icon: '🏃',
    },
    {
      id: 'health',
      title: 'Health & Air Quality Sensitive',
      desc: 'Prioritizes PM2.5 / PM10 counts, pollen, humidity, and respiratory protection advice.',
      icon: '🫁',
    },
  ];

  const cardToggles = [
    { key: 'vaani', label: 'मौसम वाणी (AI Audio Weather Briefing)' },
    { key: 'hourly', label: '24-Hour Forecast Carousel' },
    { key: 'recommendations', label: 'AI Personalized Recommendations' },
    { key: 'daily', label: '7-Day Extended Trend' },
    { key: 'activity', label: 'Lifestyle & Outdoor Activity Scores' },
    { key: 'agromet', label: 'Kisan Agromet & Monsoon Bulletin (GKMS)' },
    { key: 'metrics', label: 'Detailed Sensor Telemetry (AQI, UV, Solar Arc)' },
    { key: 'alerts', label: 'Severe Weather Warning Banner' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Personalization Settings"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Sliders size={20} className="text-primary" />
            <h3 className="modal-title">Personalization Settings</h3>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {/* 1. Persona Profile Selection */}
          <div className="settings-group">
            <div className="group-label-row">
              <User size={16} className="text-primary" />
              <h4 className="group-label">Tailored Profile / Persona</h4>
            </div>
            <p className="group-hint">
              Controls how the recommendation engine weights rain, heat, wind, and air quality:
            </p>

            <div className="persona-card-grid">
              {personas.map((p) => {
                const isSelected = persona === p.id;
                return (
                  <button
                    key={p.id}
                    className={`persona-selection-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectPersona(p.id)}
                  >
                    <div className="persona-select-top">
                      <span className="persona-card-icon">{p.icon}</span>
                      <span className="persona-card-title">{p.title}</span>
                      {isSelected && <Check size={16} className="selected-check" />}
                    </div>
                    <p className="persona-card-desc">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Units & Theme */}
          <div className="settings-group">
            <h4 className="group-label">Display & Preferences</h4>
            <div className="settings-controls-grid">
              {/* Unit */}
              <div className="control-item">
                <div className="control-text">
                  <span className="control-title">Temperature Unit</span>
                  <span className="control-sub">Current: °{unit}</span>
                </div>
                <button className="toggle-pill-btn" onClick={onToggleUnit}>
                  <span className={unit === 'C' ? 'active' : ''}>°C</span>
                  <span className={unit === 'F' ? 'active' : ''}>°F</span>
                </button>
              </div>

              {/* Theme */}
              <div className="control-item">
                <div className="control-text">
                  <span className="control-title">Interface Theme</span>
                  <span className="control-sub">Mode: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                </div>
                <button className="toggle-pill-btn" onClick={onToggleTheme}>
                  <span className={theme === 'light' ? 'active' : ''}>
                    <Sun size={14} /> Light
                  </span>
                  <span className={theme === 'dark' ? 'active' : ''}>
                    <Moon size={14} /> Dark
                  </span>
                </button>
              </div>

              {/* Demo Mode Toggle */}
              <div className="control-item">
                <div className="control-text">
                  <span className="control-title">Data Mode</span>
                  <span className="control-sub">
                    {isDemoMode ? 'Offline Simulation' : 'Live Open-Meteo API'}
                  </span>
                </div>
                <button
                  className={`status-toggle-btn ${isDemoMode ? 'demo-active' : 'live-active'}`}
                  onClick={onToggleDemoMode}
                >
                  <Database size={14} />
                  <span>{isDemoMode ? 'Demo Mode' : 'Live Mode'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Customize Homepage Layout */}
          <div className="settings-group">
            <div className="group-label-row">
              <Eye size={16} className="text-primary" />
              <h4 className="group-label">Homepage Layout Customizer</h4>
            </div>
            <p className="group-hint">Show or hide specific cards on your dashboard:</p>

            <div className="card-toggle-list">
              {cardToggles.map((item) => (
                <label key={item.key} className="card-toggle-row">
                  <span className="card-toggle-label">{item.label}</span>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={visibleCards[item.key] ?? true}
                    onChange={() => onToggleCardVisibility(item.key)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* 4. Favorite Cities Management */}
          <div className="settings-group">
            <div className="group-label-row">
              <MapPin size={16} className="text-primary" />
              <h4 className="group-label">Saved Favorite Locations ({favorites.length})</h4>
            </div>

            <div className="favorites-list">
              {favorites.map((fav) => (
                <div key={fav.name} className="favorite-item-row">
                  <div className="fav-item-info">
                    <span className="fav-item-name">{fav.name}</span>
                    <span className="fav-item-state">{fav.state || fav.country}</span>
                  </div>
                  <button
                    className="delete-fav-btn"
                    onClick={() => onRemoveFavorite(fav.name)}
                    title="Remove from favorites"
                    aria-label={`Remove ${fav.name} from favorites`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="primary-btn full-width" onClick={onClose}>
            Apply & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
