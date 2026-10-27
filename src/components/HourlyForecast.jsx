import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { convertTemp } from '../services/weatherService';

export default function HourlyForecast({ hourly = [], unit = 'C' }) {
  if (!hourly || hourly.length === 0) return null;

  return (
    <section className="dashboard-section" aria-label="Hourly Weather Forecast">
      <div className="section-title-row">
        <div className="title-with-icon">
          <Clock size={18} className="section-title-icon" />
          <h3 className="section-heading">24-Hour Forecast</h3>
        </div>
        <span className="section-subtitle-tag">Hourly Nowcast</span>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="hourly-scroll-container">
        {hourly.map((item, idx) => {
          const isNow = item.time === 'Now';
          const temp = convertTemp(item.temp, unit);

          return (
            <div
              key={`${item.rawTime}-${idx}`}
              className={`hourly-card ${isNow ? 'is-now-card' : ''}`}
            >
              <div className="hourly-time">
                {item.time}
                {isNow && <span className="now-dot" />}
              </div>

              <div className="hourly-icon-wrap">
                <WeatherIcon code={item.code} isDay={item.isDay} size={28} />
              </div>

              <div className="hourly-temp">
                {temp}°{unit}
              </div>

              {/* Rain Chance indicator bar */}
              <div className="hourly-rain-chip" title={`Precipitation probability: ${item.pop}%`}>
                <Droplets size={11} className="rain-drop-mini" />
                <span>{item.pop}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
