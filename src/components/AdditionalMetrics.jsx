import React from 'react';
import {
  Sunrise,
  Sunset,
  Wind,
  SunDim,
  Eye,
  Gauge,
  CloudRain,
  Activity,
  Info,
} from 'lucide-react';
import { getUvCategory } from '../services/weatherService';

export default function AdditionalMetrics({ weather }) {
  if (!weather || !weather.current) return null;

  const { current, aqi, astronomy } = weather;
  const uvInfo = getUvCategory(current.uvIndex || 0);

  // Calculate Sun Arc Position (Percentage of day elapsed)
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sunriseMinutes = 6 * 60; // ~06:00 AM
  const sunsetMinutes = 18 * 60 + 15; // ~06:15 PM
  const totalDayMinutes = sunsetMinutes - sunriseMinutes;
  let sunProgress = 0;
  if (currentMinutes > sunriseMinutes && currentMinutes < sunsetMinutes) {
    sunProgress = Math.min(100, Math.max(0, ((currentMinutes - sunriseMinutes) / totalDayMinutes) * 100));
  } else if (currentMinutes >= sunsetMinutes) {
    sunProgress = 100;
  }

  return (
    <section className="dashboard-section" aria-label="Additional Weather Details">
      <div className="section-title-row">
        <div className="title-with-icon">
          <Activity size={18} className="section-title-icon text-cyan" />
          <h3 className="section-heading">Detailed Atmospheric Metrics</h3>
        </div>
        <span className="section-subtitle-tag">Sensor Telemetry</span>
      </div>

      <div className="additional-metrics-grid">
        {/* 1. Sunrise & Sunset Solar Arc */}
        <div className="metric-card sunrise-sunset-card">
          <div className="metric-card-top">
            <span className="metric-card-title">Solar Cycle</span>
            <Sunrise size={18} className="text-amber" />
          </div>

          <div className="solar-arc-visual">
            <div className="solar-arc-path">
              <div
                className="solar-sun-dot"
                style={{
                  left: `${sunProgress}%`,
                  bottom: `${Math.sin((sunProgress / 100) * Math.PI) * 45}px`,
                }}
                title={`Sun position: ${Math.round(sunProgress)}% of daylight elapsed`}
              />
            </div>
            <div className="solar-horizon-line" />
          </div>

          <div className="solar-times-row">
            <div className="time-col">
              <div className="time-label">
                <Sunrise size={14} className="text-amber" /> Sunrise
              </div>
              <div className="time-val">{astronomy.sunrise}</div>
            </div>
            <div className="time-col text-right">
              <div className="time-label">
                <Sunset size={14} className="text-orange" /> Sunset
              </div>
              <div className="time-val">{astronomy.sunset}</div>
            </div>
          </div>
        </div>

        {/* 2. Air Quality Index (AQI) */}
        <div className="metric-card aqi-card">
          <div className="metric-card-top">
            <span className="metric-card-title">Air Quality Index (AQI)</span>
            <span
              className="aqi-status-pill"
              style={{ backgroundColor: aqi.status.bg, color: aqi.status.color }}
            >
              {aqi.status.label}
            </span>
          </div>

          <div className="aqi-score-row">
            <span className="aqi-big-score" style={{ color: aqi.status.color }}>
              {aqi.score}
            </span>
            <div className="aqi-sub-details">
              <span>PM2.5: <strong>{aqi.pm25.toFixed(1)} µg/m³</strong></span>
              <span>PM10: <strong>{aqi.pm10.toFixed(1)} µg/m³</strong></span>
            </div>
          </div>

          {/* AQI Gradient Spectrum Bar */}
          <div className="aqi-spectrum-bar">
            <div
              className="aqi-indicator-arrow"
              style={{ left: `${Math.min(100, (aqi.score / 350) * 100)}%` }}
            />
          </div>
          <div className="spectrum-labels">
            <span>Good (0)</span>
            <span>Moderate (100)</span>
            <span>Poor (200)</span>
            <span>Severe (300+)</span>
          </div>
        </div>

        {/* 3. UV Index */}
        <div className="metric-card uv-card">
          <div className="metric-card-top">
            <span className="metric-card-title">UV Index</span>
            <SunDim size={18} className="text-amber" />
          </div>

          <div className="metric-val-main">
            <span className="metric-val-number">{(current.uvIndex || 0).toFixed(1)}</span>
            <span className="metric-val-sub">{uvInfo.label}</span>
          </div>

          <div className="metric-progress-track">
            <div
              className="metric-progress-fill uv-fill"
              style={{ width: `${Math.min(100, ((current.uvIndex || 0) / 12) * 100)}%` }}
            />
          </div>

          <p className="metric-tip-text">{uvInfo.advice}</p>
        </div>

        {/* 4. Visibility */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-title">Surface Visibility</span>
            <Eye size={18} className="text-teal" />
          </div>

          <div className="metric-val-main">
            <span className="metric-val-number">{current.visibilityKm}</span>
            <span className="metric-val-unit">km</span>
          </div>

          <div className="metric-progress-track">
            <div
              className="metric-progress-fill visibility-fill"
              style={{ width: `${Math.min(100, (parseFloat(current.visibilityKm) / 10) * 100)}%` }}
            />
          </div>

          <p className="metric-tip-text">
            {parseFloat(current.visibilityKm) >= 8
              ? 'Clear horizon. Ideal for aviation & highway driving.'
              : 'Moderate haze or fog present. Maintain vehicle distance.'}
          </p>
        </div>

        {/* 5. Atmospheric Pressure */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-title">Barometric Pressure</span>
            <Gauge size={18} className="text-indigo" />
          </div>

          <div className="metric-val-main">
            <span className="metric-val-number">{Math.round(current.pressure)}</span>
            <span className="metric-val-unit">hPa</span>
          </div>

          <div className="metric-progress-track">
            <div
              className="metric-progress-fill pressure-fill"
              style={{
                width: `${Math.min(100, Math.max(0, ((current.pressure - 980) / 50) * 100))}%`,
              }}
            />
          </div>

          <p className="metric-tip-text">
            {current.pressure >= 1013
              ? 'High pressure zone: Stable, fair weather expected.'
              : 'Low pressure system: Cloud buildup and rain possible.'}
          </p>
        </div>

        {/* 6. Precipitation & Rain Volume */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-title">Rain Probability</span>
            <CloudRain size={18} className="text-blue" />
          </div>

          <div className="metric-val-main">
            <span className="metric-val-number">{current.rainProbability}</span>
            <span className="metric-val-unit">%</span>
          </div>

          <div className="metric-progress-track">
            <div
              className="metric-progress-fill rain-fill"
              style={{ width: `${current.rainProbability}%` }}
            />
          </div>

          <p className="metric-tip-text">
            Precipitation rate: <strong>{current.precipitation || 0} mm/h</strong>. Cloud cover:{' '}
            <strong>{current.cloudCover}%</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
