import React, { useState, useEffect } from 'react';
import { X, Scale, Plus, Trash2, ArrowRight, Droplets, Wind, CloudRain, Activity } from 'lucide-react';
import { POPULAR_INDIAN_CITIES, fetchLiveWeatherData, convertTemp, getWeatherConditionInfo } from '../services/weatherService';
import WeatherIcon from './WeatherIcon';

export default function CityComparisonModal({ isOpen, onClose, currentCity, unit = 'C' }) {
  const [selectedCities, setSelectedCities] = useState([
    currentCity || POPULAR_INDIAN_CITIES[0],
    POPULAR_INDIAN_CITIES[1], // Mumbai
  ]);
  const [comparisonData, setComparisonData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const dataMap = {};

      for (const city of selectedCities) {
        try {
          const res = await fetchLiveWeatherData(city.lat, city.lon, city.name);
          dataMap[city.name] = res;
        } catch (e) {
          console.error(e);
        }
      }

      if (isMounted) {
        setComparisonData(dataMap);
        setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedCities]);

  if (!isOpen) return null;

  const handleAddCity = (cityName) => {
    const found = POPULAR_INDIAN_CITIES.find((c) => c.name === cityName);
    if (found && !selectedCities.some((c) => c.name === found.name) && selectedCities.length < 3) {
      setSelectedCities([...selectedCities, found]);
    }
  };

  const handleRemoveCity = (cityName) => {
    if (selectedCities.length > 1) {
      setSelectedCities(selectedCities.filter((c) => c.name !== cityName));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="comparison-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Compare Cities Weather"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <Scale size={20} className="text-primary" />
            <h3 className="modal-title">Multi-City Weather Comparator</h3>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close comparison">
            <X size={20} />
          </button>
        </div>

        <div className="comparison-body">
          {/* City Selection Bar */}
          <div className="comparison-city-selector-bar">
            <span className="selector-label">Add City to Compare:</span>
            <div className="city-pill-options">
              {POPULAR_INDIAN_CITIES.slice(0, 6).map((city) => {
                const isSelected = selectedCities.some((c) => c.name === city.name);
                return (
                  <button
                    key={city.name}
                    className={`comparison-add-chip ${isSelected ? 'disabled' : ''}`}
                    disabled={isSelected || selectedCities.length >= 3}
                    onClick={() => handleAddCity(city.name)}
                  >
                    <Plus size={12} /> {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="comparison-loading">
              <div className="spinner" />
              <span>Fetching live atmospheric telemetry...</span>
            </div>
          ) : (
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    {selectedCities.map((c) => (
                      <th key={c.name} className="city-header-cell">
                        <div className="city-head-title">
                          <span>{c.name}</span>
                          {selectedCities.length > 1 && (
                            <button
                              className="remove-comp-city-btn"
                              onClick={() => handleRemoveCity(c.name)}
                              title="Remove city"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <span className="city-head-sub">{c.state}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Condition Row */}
                  <tr>
                    <td className="row-label">Condition</td>
                    {selectedCities.map((c) => {
                      const data = comparisonData[c.name];
                      if (!data) return <td key={c.name}>—</td>;
                      const cond = getWeatherConditionInfo(data.current.weatherCode, data.current.isDay);
                      return (
                        <td key={c.name}>
                          <div className="comp-cell-flex">
                            <WeatherIcon code={data.current.weatherCode} size={20} />
                            <span>{cond.label}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Temperature Row */}
                  <tr>
                    <td className="row-label">Temperature</td>
                    {selectedCities.map((c) => {
                      const data = comparisonData[c.name];
                      if (!data) return <td key={c.name}>—</td>;
                      return (
                        <td key={c.name} className="temp-comp-cell">
                          <strong>{convertTemp(data.current.temperature, unit)}°{unit}</strong>
                          <span className="sub-feels">Feels {convertTemp(data.current.apparentTemperature, unit)}°</span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Rain Probability Row */}
                  <tr>
                    <td className="row-label">Rain Chance</td>
                    {selectedCities.map((c) => {
                      const data = comparisonData[c.name];
                      if (!data) return <td key={c.name}>—</td>;
                      return (
                        <td key={c.name}>
                          <div className="comp-bar-cell">
                            <span>{data.current.rainProbability}%</span>
                            <div className="mini-bar">
                              <div
                                className="mini-bar-fill rain-fill"
                                style={{ width: `${data.current.rainProbability}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Humidity Row */}
                  <tr>
                    <td className="row-label">Humidity</td>
                    {selectedCities.map((c) => {
                      const data = comparisonData[c.name];
                      if (!data) return <td key={c.name}>—</td>;
                      return <td key={c.name}>{data.current.humidity}%</td>;
                    })}
                  </tr>

                  {/* Wind Row */}
                  <tr>
                    <td className="row-label">Wind Speed</td>
                    {selectedCities.map((c) => {
                      const data = comparisonData[c.name];
                      if (!data) return <td key={c.name}>—</td>;
                      return <td key={c.name}>{data.current.windSpeed} km/h</td>;
                    })}
                  </tr>

                  {/* Air Quality (AQI) Row */}
                  <tr>
                    <td className="row-label">Air Quality (AQI)</td>
                    {selectedCities.map((c) => {
                      const data = comparisonData[c.name];
                      if (!data) return <td key={c.name}>—</td>;
                      return (
                        <td key={c.name}>
                          <span
                            className="comp-aqi-pill"
                            style={{
                              backgroundColor: `${data.aqi?.status?.color || '#0284c7'}18`,
                              color: data.aqi?.status?.color || '#0284c7',
                              borderColor: `${data.aqi?.status?.color || '#0284c7'}40`,
                            }}
                          >
                            {data.aqi?.score || '—'} ({data.aqi?.status?.label || 'Moderate'})
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
