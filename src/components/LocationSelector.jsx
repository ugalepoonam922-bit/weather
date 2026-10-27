import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Star, X, Loader2 } from 'lucide-react';
import { searchCities, POPULAR_INDIAN_CITIES } from '../services/weatherService';

export default function LocationSelector({
  currentCity,
  onSelectCity,
  onUseGpsLocation,
  isGpsLoading,
  gpsError,
  favorites,
  onToggleFavorite,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced Search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const matches = await searchCities(query);
      setResults(matches);
      setIsSearching(false);
      setIsOpen(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const isCurrentFavorite = favorites.some(
    (f) => f.name.toLowerCase() === (currentCity?.name || '').toLowerCase()
  );

  return (
    <section className="location-section" aria-label="Location Selector">
      {/* Search Bar Container */}
      <div className="search-container" ref={dropdownRef}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search city, district or state (e.g., Pune, Shimla, Jaipur)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(results.length > 0)}
          />
          {query && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {/* GPS Auto-detect button */}
          <button
            className={`gps-btn ${isGpsLoading ? 'loading' : ''}`}
            onClick={onUseGpsLocation}
            title="Use current GPS location"
            aria-label="Use current location"
            disabled={isGpsLoading}
          >
            {isGpsLoading ? (
              <Loader2 size={16} className="spin-icon" />
            ) : (
              <Navigation size={16} />
            )}
            <span className="gps-btn-text">GPS</span>
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (results.length > 0 || isSearching) && (
          <div className="search-dropdown">
            {isSearching && (
              <div className="search-status">
                <Loader2 size={14} className="spin-icon" />
                <span>Searching locations across India & globe...</span>
              </div>
            )}
            {!isSearching && results.length === 0 && (
              <div className="search-status">No matching locations found</div>
            )}
            {results.map((item, idx) => (
              <button
                key={`${item.name}-${item.lat}-${idx}`}
                className="search-result-item"
                onClick={() => handleSelect(item)}
              >
                <MapPin size={16} className="pin-icon" />
                <div className="result-text">
                  <span className="result-city">{item.name}</span>
                  <span className="result-state">
                    {[item.state, item.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* GPS Permission Error Notice if triggered */}
      {gpsError && (
        <div className="gps-error-banner">
          <span>⚠️ {gpsError}</span>
          <span className="gps-error-hint">Using manual city search instead.</span>
        </div>
      )}

      {/* Current Location Badge & Favorites Quick Bar */}
      <div className="location-chips-row">
        <div className="current-location-chip">
          <MapPin size={14} className="loc-dot-icon" />
          <span className="current-loc-name">
            {currentCity?.name || 'New Delhi'}
            {currentCity?.state ? `, ${currentCity.state}` : ''}
          </span>
          <button
            className={`star-fav-btn ${isCurrentFavorite ? 'is-fav' : ''}`}
            onClick={() => onToggleFavorite(currentCity)}
            title={isCurrentFavorite ? 'Remove from favorites' : 'Save to favorite locations'}
            aria-label="Toggle favorite"
          >
            <Star size={14} fill={isCurrentFavorite ? '#f59e0b' : 'none'} />
          </button>
        </div>

        {/* Quick jump favorites */}
        <div className="quick-cities-scroll">
          {favorites.map((fav) => (
            <button
              key={fav.name}
              className={`city-pill ${
                (currentCity?.name || '').toLowerCase() === fav.name.toLowerCase() ? 'active' : ''
              }`}
              onClick={() => onSelectCity(fav)}
            >
              {fav.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
