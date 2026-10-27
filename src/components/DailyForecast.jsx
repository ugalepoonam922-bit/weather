import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { convertTemp, getWeatherConditionInfo } from '../services/weatherService';

export default function DailyForecast({ daily = [], unit = 'C' }) {
  if (!daily || daily.length === 0) return null;

  // Calculate weekly overall min and max for proportional range bar
  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const tempSpan = Math.max(1, weekMax - weekMin);

  return (
    <section className="dashboard-section" aria-label="7-Day Weather Forecast">
      <div className="section-title-row">
        <div className="title-with-icon">
          <Calendar size={18} className="section-title-icon" />
          <h3 className="section-heading">7-Day Extended Forecast</h3>
        </div>
        <span className="section-subtitle-tag">Weekly Trend</span>
      </div>

      <div className="daily-forecast-card">
        {daily.map((dayItem, idx) => {
          const condition = getWeatherConditionInfo(dayItem.code, 1);
          const minT = convertTemp(dayItem.minTemp, unit);
          const maxT = convertTemp(dayItem.maxTemp, unit);

          // Bar calculation percentages
          const leftPercent = Math.max(0, ((dayItem.minTemp - weekMin) / tempSpan) * 100);
          const widthPercent = Math.min(
            100,
            Math.max(15, ((dayItem.maxTemp - dayItem.minTemp) / tempSpan) * 100)
          );

          return (
            <div key={`${dayItem.date}-${idx}`} className="daily-row-item">
              {/* Day & Date */}
              <div className="daily-day-col">
                <span className="daily-day-name">{dayItem.day}</span>
                <span className="daily-date-sub">{dayItem.date}</span>
              </div>

              {/* Condition Icon & Label */}
              <div className="daily-condition-col">
                <WeatherIcon code={dayItem.code} isDay={1} size={22} />
                <span className="daily-condition-label">{condition.label}</span>
                {dayItem.pop > 20 && (
                  <span className="daily-pop-tag">
                    <Droplets size={10} /> {dayItem.pop}%
                  </span>
                )}
              </div>

              {/* Temperature Bar */}
              <div className="daily-temp-bar-col">
                <span className="temp-val-min">{minT}°</span>
                <div className="temp-track-bg">
                  <div
                    className="temp-range-bar"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>
                <span className="temp-val-max">{maxT}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
