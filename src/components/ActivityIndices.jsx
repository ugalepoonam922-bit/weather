import React from 'react';
import { Activity, Shirt, Car, Bike, Sparkles, Dumbbell } from 'lucide-react';
import { calculateActivityIndices } from '../services/weatherService';

const ICON_MAP = {
  Activity: Dumbbell,
  Shirt: Shirt,
  Car: Car,
  Bike: Bike,
  Sparkles: Sparkles,
};

export default function ActivityIndices({ weather }) {
  if (!weather || !weather.current) return null;

  const activities = calculateActivityIndices(weather);

  return (
    <section className="dashboard-section" aria-label="Lifestyle & Outdoor Activities">
      <div className="section-title-row">
        <div className="title-with-icon">
          <Activity size={18} className="section-title-icon text-indigo" />
          <h3 className="section-heading">Lifestyle & Outdoor Index</h3>
        </div>
        <span className="section-subtitle-tag">Daily Planning</span>
      </div>

      <div className="activity-grid">
        {activities.map((item) => {
          const IconComp = ICON_MAP[item.icon] || Activity;

          return (
            <div key={item.id} className="activity-card">
              <div className="activity-card-header">
                <div className="activity-icon-wrap">
                  <IconComp size={16} />
                </div>
                <span
                  className="activity-status-badge"
                  style={{
                    backgroundColor: `${item.status.color}18`,
                    color: item.status.color,
                    borderColor: `${item.status.color}40`,
                  }}
                >
                  {item.status.text}
                </span>
              </div>

              <div className="activity-info-row">
                <h4 className="activity-name">{item.name}</h4>
                <span className="activity-score" style={{ color: item.status.color }}>
                  {item.score}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="activity-progress-track">
                <div
                  className="activity-progress-fill"
                  style={{
                    width: `${item.score}%`,
                    backgroundColor: item.status.color,
                  }}
                />
              </div>

              <p className="activity-advice">{item.advice}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
