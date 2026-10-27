import React, { useState } from 'react';
import { Sprout, Wind, Droplet, ShieldCheck, AlertCircle, Compass, ChevronRight } from 'lucide-react';
import { getAgrometAdvisory } from '../services/weatherService';

export default function AgrometBulletin({ weather, cityName }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const advisory = getAgrometAdvisory(weather, cityName);

  if (!advisory) return null;

  return (
    <section className="dashboard-section agromet-section" aria-label="Gramin Krishi Mausam Sewa Agromet Bulletin">
      <div className="section-title-row">
        <div className="title-with-icon">
          <Sprout size={18} className="section-title-icon text-emerald" />
          <h3 className="section-heading">Kisan Agromet & Monsoon Bulletin</h3>
        </div>
        <span className="section-subtitle-tag green-tag">GKMS • IMD</span>
      </div>

      <div className="agromet-card">
        <div className="agromet-top">
          <div className="agromet-badge-group">
            <span className="agromet-pill">🌾 Agro-Climatic Advisory</span>
            <span className="agromet-source">{advisory.zone}</span>
          </div>
          <span className="agromet-moisture-tag">
            Soil Moisture: <strong>{advisory.soilMoisture}</strong>
          </span>
        </div>

        <div className="agromet-metrics-row">
          <div className="agromet-metric-box">
            <span className="metric-label">Spray Window (Foliar)</span>
            <span className={`metric-val ${advisory.sprayWindow === 'Recommended' ? 'text-emerald' : 'text-amber'}`}>
              {advisory.sprayWindow}
            </span>
          </div>

          <div className="agromet-metric-box">
            <span className="metric-label">Atmospheric Tracking</span>
            <span className="metric-val text-primary">{advisory.monsoonStatus}</span>
          </div>
        </div>

        <div className="agromet-advisories-list">
          {advisory.advisories.map((adv, idx) => (
            <div key={idx} className="agromet-bullet-item">
              <ShieldCheck size={14} className="text-emerald flex-shrink-0" />
              <span>{adv}</span>
            </div>
          ))}
        </div>

        <div className="agromet-footer">
          <span className="agromet-footnote">
            Official Bulletin issued under Gramin Krishi Mausam Sewa (GKMS), India Meteorological Department.
          </span>
        </div>
      </div>
    </section>
  );
}
