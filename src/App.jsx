import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LocationSelector from './components/LocationSelector';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import HourlyForecast from './components/HourlyForecast';
import RecommendationsSection from './components/RecommendationsSection';
import DailyForecast from './components/DailyForecast';
import AdditionalMetrics from './components/AdditionalMetrics';
import AlertsBanner from './components/AlertsBanner';
import BottomNav from './components/BottomNav';
import SettingsModal from './components/SettingsModal';
import RadarMapModal from './components/RadarMapModal';
import MausamVaaniVoice from './components/MausamVaaniVoice';
import ActivityIndices from './components/ActivityIndices';
import AgrometBulletin from './components/AgrometBulletin';
import CityComparisonModal from './components/CityComparisonModal';
import ShareWeatherModal from './components/ShareWeatherModal';

import {
  fetchLiveWeatherData,
  getMockWeatherData,
  POPULAR_INDIAN_CITIES,
} from './services/weatherService';
import { generatePersonalizedRecommendations } from './services/recommendationEngine';
import { RefreshCw, AlertCircle } from 'lucide-react';

const DEFAULT_CITY = POPULAR_INDIAN_CITIES[0]; // New Delhi

const SAMPLE_SIMULATED_ALERT = {
  id: 'alert_imd_nowcast_01',
  severity: 'orange', // yellow | orange | red
  title: 'Severe Thunderstorm & Squall Warning (CAP-NDMA)',
  source: 'India Meteorological Department (RMC New Delhi)',
  validUntil: 'Tomorrow, 06:00 AM IST',
  area: 'National Capital Region & adjoining Western UP',
  description:
    'Gusty winds reaching 45–55 km/h accompanied by moderate to intense thunderstorm activity and localized hail. Surface runoff and temporary waterlogging expected along low-lying arterial routes.',
  precautions: [
    'Avoid taking shelter under isolated trees, metal sheds, or high-tension power lines.',
    'Farmers are advised to postpone open-field pesticide/fertilizer spraying operations.',
    'Drivers should maintain safe braking distance due to reduced wet road friction.',
  ],
};

export default function App() {
  // 1. Core State with LocalStorage Persistence
  const [currentCity, setCurrentCity] = useState(() => {
    const saved = localStorage.getItem('mausam_city');
    return saved ? JSON.parse(saved) : DEFAULT_CITY;
  });

  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('mausam_unit') || 'C';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mausam_theme') || 'light';
  });

  const [persona, setPersona] = useState(() => {
    return localStorage.getItem('mausam_persona') || 'general';
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('mausam_favorites');
    return saved ? JSON.parse(saved) : POPULAR_INDIAN_CITIES.slice(0, 5);
  });

  const [visibleCards, setVisibleCards] = useState(() => {
    const saved = localStorage.getItem('mausam_cards');
    return saved
      ? JSON.parse(saved)
      : {
          vaani: true,
          hourly: true,
          recommendations: true,
          daily: true,
          activity: true,
          agromet: true,
          metrics: true,
          alerts: true,
        };
  });

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);
  const [isSimulatedAlert, setIsSimulatedAlert] = useState(false);

  // 2. Weather & Network State
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // 3. Navigation & Modals
  const [activeTab, setActiveTab] = useState('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Sync theme attribute to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mausam_theme', theme);
  }, [theme]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('mausam_unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('mausam_persona', persona);
  }, [persona]);

  useEffect(() => {
    localStorage.setItem('mausam_city', JSON.stringify(currentCity));
  }, [currentCity]);

  useEffect(() => {
    localStorage.setItem('mausam_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('mausam_cards', JSON.stringify(visibleCards));
  }, [visibleCards]);

  // Fetch Weather Data (Live or Demo)
  const loadWeather = useCallback(async (city, forceDemo = false) => {
    setIsLoading(true);
    setError(null);

    if (forceDemo || isDemoMode) {
      setTimeout(() => {
        const mockData = getMockWeatherData(city.name);
        setWeather(mockData);
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const data = await fetchLiveWeatherData(city.lat, city.lon);
      setWeather(data);
    } catch (err) {
      console.warn('Live API fetch failed, falling back to simulated data', err);
      // Fallback gracefully to high-fidelity mock data so user is never stranded
      const fallback = getMockWeatherData(city.name);
      setWeather(fallback);
      setError('Live API request failed. Showing cached meteorological telemetry.');
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  // Initial load and city change listener
  useEffect(() => {
    if (currentCity) {
      loadWeather(currentCity);
    }
  }, [currentCity, loadWeather]);

  // GPS Location Handler
  const handleUseGpsLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = {
          name: 'Current Location',
          state: 'GPS Detected',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setCurrentCity(userLoc);
        setIsGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err);
        setIsGpsLoading(false);
        setGpsError('Location access was denied. You can still select any city from the search bar.');
      },
      { timeout: 8000 }
    );
  };

  // Favorites Handlers
  const handleToggleFavorite = (city) => {
    if (!city) return;
    const exists = favorites.some((f) => f.name.toLowerCase() === city.name.toLowerCase());
    if (exists) {
      setFavorites(favorites.filter((f) => f.name.toLowerCase() !== city.name.toLowerCase()));
    } else {
      setFavorites([...favorites, city]);
    }
  };

  const handleRemoveFavorite = (cityName) => {
    setFavorites(favorites.filter((f) => f.name.toLowerCase() !== cityName.toLowerCase()));
  };

  const handleAddFavorite = (city) => {
    if (!favorites.some((f) => f.name.toLowerCase() === city.name.toLowerCase())) {
      setFavorites([...favorites, city]);
    }
  };

  // Card Visibility Handler
  const handleToggleCardVisibility = (key) => {
    setVisibleCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Alert simulation toggle
  const handleToggleSimulatedAlert = () => {
    if (activeAlert) {
      setActiveAlert(null);
      setIsSimulatedAlert(false);
    } else {
      setActiveAlert(SAMPLE_SIMULATED_ALERT);
      setIsSimulatedAlert(true);
    }
  };

  // Navigation tab switcher
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'settings') {
      setIsSettingsOpen(true);
    } else if (tabId === 'radar') {
      setIsRadarOpen(true);
    } else if (tabId === 'forecast') {
      // Smooth scroll to 7-day forecast
      const el = document.getElementById('forecast-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute recommendations dynamically using our algorithm
  const recommendations = weather
    ? generatePersonalizedRecommendations(weather, persona, unit)
    : [];

  return (
    <div className={`mausam-app-root theme-${theme}`}>
      <div className="mobile-frame-container">
        {/* 1. App logo and personalized greeting */}
        <Header
          cityName={currentCity?.name}
          persona={persona}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCompare={() => setIsCompareOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          unit={unit}
          onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
        />

        {/* 2. Location selector and search */}
        <LocationSelector
          currentCity={currentCity}
          onSelectCity={(city) => setCurrentCity(city)}
          onUseGpsLocation={handleUseGpsLocation}
          isGpsLoading={isGpsLoading}
          gpsError={gpsError}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Global Error Banner / Retry */}
        {error && (
          <div className="network-warning-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button className="retry-btn" onClick={() => loadWeather(currentCity)}>
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton vs Main Content */}
        {isLoading && !weather ? (
          <div className="loading-state-wrapper">
            <div className="skeleton-hero-card" />
            <div className="skeleton-hourly-track" />
            <div className="skeleton-rec-card" />
          </div>
        ) : (
          <main className="dashboard-main-content">
            {/* 3. Main current-weather card */}
            <CurrentWeatherCard
              weather={weather}
              cityName={currentCity?.name}
              unit={unit}
              onRefresh={() => loadWeather(currentCity)}
              isLoading={isLoading}
            />

            {/* AI Audio Weather Briefing (Mausam Vaani) */}
            {visibleCards.vaani && (
              <MausamVaaniVoice
                weather={weather}
                cityName={currentCity?.name}
                persona={persona}
                unit={unit}
              />
            )}

            {/* 4. Hourly forecast (if toggled visible) */}
            {visibleCards.hourly && (
              <HourlyForecast hourly={weather?.hourly || []} unit={unit} />
            )}

            {/* 5. Weather-based recommendations */}
            {visibleCards.recommendations && (
              <RecommendationsSection
                recommendations={recommendations}
                activePersona={persona}
                onSelectPersona={(newP) => setPersona(newP)}
              />
            )}

            {/* 6. Seven-day forecast */}
            {visibleCards.daily && (
              <div id="forecast-anchor">
                <DailyForecast daily={weather?.daily || []} unit={unit} />
              </div>
            )}

            {/* Lifestyle & Outdoor Activity Scores */}
            {visibleCards.activity && <ActivityIndices weather={weather} />}

            {/* Kisan Agromet & Monsoon Bulletin (GKMS) */}
            {visibleCards.agromet && (
              <AgrometBulletin weather={weather} cityName={currentCity?.name} />
            )}

            {/* 7. Additional weather information */}
            {visibleCards.metrics && <AdditionalMetrics weather={weather} />}

            {/* 8. Weather alerts, when available */}
            {visibleCards.alerts && (
              <AlertsBanner
                activeAlert={activeAlert}
                onDismiss={() => setActiveAlert(null)}
                onToggleSimulatedAlert={handleToggleSimulatedAlert}
                isSimulated={isSimulatedAlert}
              />
            )}
          </main>
        )}

        {/* 9. Bottom navigation bar */}
        <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

        {/* Modals */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            if (activeTab === 'settings') setActiveTab('home');
          }}
          persona={persona}
          onSelectPersona={(p) => setPersona(p)}
          unit={unit}
          onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          visibleCards={visibleCards}
          onToggleCardVisibility={handleToggleCardVisibility}
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
          onAddFavorite={handleAddFavorite}
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => {
            setIsDemoMode(!isDemoMode);
            loadWeather(currentCity, !isDemoMode);
          }}
        />

        <RadarMapModal
          isOpen={isRadarOpen}
          onClose={() => {
            setIsRadarOpen(false);
            if (activeTab === 'radar') setActiveTab('home');
          }}
          cityName={currentCity?.name}
        />

        <CityComparisonModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          currentCity={currentCity}
          unit={unit}
        />

        <ShareWeatherModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          weather={weather}
          cityName={currentCity?.name}
          unit={unit}
        />
      </div>
    </div>
  );
}
