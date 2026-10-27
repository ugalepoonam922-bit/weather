import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  CloudRain,
  Gauge,
  ArrowUp,
  ArrowDown,
  Eye,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  convertTemp,
  getWeatherConditionInfo,
  windDirectionDegreesToText,
} from '../services/weatherService';

export default function CurrentWeatherCard({
  weather,
  cityName,
  unit = 'C',
  onRefresh,
  isLoading,
}) {
  if (!weather || !weather.current) return null;

  const { current } = weather;
  const temp = convertTemp(current.temperature, unit);
  const feelsLike = convertTemp(current.apparentTemperature, unit);
  const minTemp = convertTemp(current.minTemp, unit);
  const maxTemp = convertTemp(current.maxTemp, unit);

  const conditionInfo = getWeatherConditionInfo(current.weatherCode, current.isDay);
  const windDirText = windDirectionDegreesToText(current.windDirection);

  // Dynamic card theme class based on weather type and day/night
  const cardThemeClass = `weather-card-${conditionInfo.type} ${current.isDay ? 'is-day' : 'is-night'}`;

  return (
    <section className="current-weather-section" aria-label="Current Weather Information">
      <div className={`current-weather-card ${cardThemeClass}`}>
        {/* Background Ambient Glow & Clouds */}
        <div className="card-ambient-glow" />
        <div className="card-texture-overlay" />

        {/* Card Header: Location & Condition Badge */}
        <div className="weather-card-header">
          <div className="location-info">
            <span className="live-indicator">
              <span className="live-dot" /> LIVE OBSERVATION
            </span>
            <h3 className="card-location-title">{cityName}</h3>
          </div>

          <div className="condition-badge">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              size={24}
              className="badge-icon"
            />
            <span className="condition-text">{conditionInfo.label}</span>
          </div>
        </div>

        {/* Main Temperature & Visuals */}
        <div className="weather-main-row">
          <div className="temp-display-group">
            <div className="temp-number-row">
              <span className="hero-temp">{temp}</span>
              <span className="temp-unit-symbol">°{unit}</span>
            </div>
            <div className="feels-like-label">
              Feels like <strong>{feelsLike}°{unit}</strong>
            </div>
          </div>

          {/* Large Animated Weather Icon */}
          <div className="hero-icon-container">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              size={92}
              className="hero-weather-icon"
            />
          </div>
        </div>

        {/* Min / Max Temp Range Pill */}
        <div className="min-max-pill">
          <span className="range-item">
            <ArrowDown size={14} className="temp-down-icon" /> Min {minTemp}°{unit}
          </span>
          <span className="range-divider">•</span>
          <span className="range-item">
            <ArrowUp size={14} className="temp-up-icon" /> Max {maxTemp}°{unit}
          </span>
        </div>

        {/* Quick Telemetry Grid (4 items) */}
        <div className="quick-metrics-grid">
          {/* Humidity */}
          <div className="metric-cell">
            <div className="metric-icon-wrap blue">
              <Droplets size={16} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Humidity</span>
              <span className="metric-val">{current.humidity}%</span>
            </div>
          </div>

          {/* Wind Speed & Direction */}
          <div className="metric-cell">
            <div className="metric-icon-wrap teal">
              <Wind size={16} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Wind</span>
              <span className="metric-val">
                {current.windSpeed} km/h <small>{windDirText}</small>
              </span>
            </div>
          </div>

          {/* Rain Probability */}
          <div className="metric-cell">
            <div className="metric-icon-wrap indigo">
              <CloudRain size={16} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Rain Chance</span>
              <span className="metric-val">{current.rainProbability}%</span>
            </div>
          </div>

          {/* Atmospheric Pressure */}
          <div className="metric-cell">
            <div className="metric-icon-wrap amber">
              <Gauge size={16} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Pressure</span>
              <span className="metric-val">{Math.round(current.pressure)} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
