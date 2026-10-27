import React from 'react';
import {
  Sparkles,
  Umbrella,
  Droplets,
  Shirt,
  ShieldAlert,
  SunDim,
  Sprout,
  Wheat,
  Activity,
  Car,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP = {
  Umbrella,
  Droplets,
  Shirt,
  ShieldAlert,
  SunDim,
  Sprout,
  Wheat,
  Activity,
  Car,
  Sparkles,
};

const PERSONA_TABS = [
  { id: 'general', label: 'General', icon: '👤' },
  { id: 'farmer', label: 'Farmer', icon: '🌾' },
  { id: 'commuter', label: 'Commuter', icon: '🚆' },
  { id: 'fitness', label: 'Fitness', icon: '🏃' },
  { id: 'health', label: 'Health', icon: '🫁' },
];

export default function RecommendationsSection({
  recommendations = [],
  activePersona,
  onSelectPersona,
}) {
  return (
    <section className="dashboard-section" aria-label="Personalized Weather Recommendations">
      <div className="section-title-row">
        <div className="title-with-icon">
          <Sparkles size={18} className="section-title-icon text-amber" />
          <h3 className="section-heading">Personalized Recommendations</h3>
        </div>
        <span className="section-disclaimer-tag">AI Context Advisory</span>
      </div>

      {/* Persona Quick Switcher Pills */}
      <div className="persona-tabs-row" role="tablist" aria-label="Select persona profile">
        {PERSONA_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activePersona === tab.id}
            className={`persona-tab-chip ${activePersona === tab.id ? 'active' : ''}`}
            onClick={() => onSelectPersona(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="recommendations-list">
        {recommendations.length === 0 ? (
          <div className="empty-rec-state">
            <CheckCircle2 size={32} className="text-emerald" />
            <p>Weather conditions are stable. No special precautions required at this time.</p>
          </div>
        ) : (
          recommendations.map((rec) => {
            const Icon = ICON_MAP[rec.icon] || Sparkles;
            const urgencyClass = `urgency-${rec.urgency}`;

            return (
              <div key={rec.id} className={`recommendation-card ${urgencyClass}`}>
                <div className="rec-top-row">
                  <div className="rec-icon-wrapper">
                    <Icon size={20} />
                  </div>
                  <div className="rec-meta">
                    <h4 className="rec-title">{rec.title}</h4>
                    <span className={`rec-badge ${rec.urgency}`}>
                      {rec.urgency === 'high'
                        ? 'High Priority'
                        : rec.urgency === 'medium'
                        ? 'Suggested'
                        : 'Routine'}
                    </span>
                  </div>
                </div>

                <p className="rec-description">{rec.description}</p>

                {/* Algorithmic Explainability Footer */}
                <div className="rec-explain-footer">
                  <HelpCircle size={12} className="explain-icon" />
                  <span className="explain-text">
                    <strong>Shown because:</strong> {rec.reason}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
