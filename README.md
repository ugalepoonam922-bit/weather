# मौसम (MAUSAM) — Personalized Weather Mobile Application Homepage

A modern, responsive, and personalized weather homepage built for the **Mausam mobile application** in collaboration with design paradigms from the **India Meteorological Department (IMD)** and the **Ministry of Earth Sciences (MoES)**.

This application provides hyper-local, real-time meteorological insights, nowcasts, persona-tailored agro-climatic and lifestyle advisories, and severe weather alerting protocols through a clean, intuitive, and mobile-optimized interface.

---

## 🌟 Key Features

### 1. Personalized Welcome & Greeting Section
- **Dynamic Time-Aware Greetings**: Displays context-aware greetings ("Good Morning", "Good Afternoon", "Good Evening") coupled with live-updating Indian Standard Time (IST) and date.
- **Persona Status Badge**: Prominently highlights the active user persona (e.g., *Farmer / Kisan*, *Daily Commuter*, *Outdoor Fitness*, *Health Sensitive*, *General Citizen*).
- **Instant Controls**: Quick toggles for temperature units (°C / °F) and Dark/Light visual themes.

### 2. Location Intelligence & Search
- **Debounced Instant Search**: Type-ahead autocomplete across major Indian cities and international locations with state/country hierarchy.
- **GPS Location Detection**: High-accuracy HTML5 Geolocation with graceful timeout and friendly permission denial messaging.
- **Quick-Access Favorite Chips**: One-tap carousel to switch between saved locations, with easy bookmarking/unbookmarking.

### 3. Main Current Weather Hero Card
- **Dynamic Atmosphere Canvas**: Real-time adaptive color grading and gradient glow reflecting weather condition (Clear, Cloudy, Rainy, Stormy, Foggy) and diurnal phase (Day/Night).
- **Comprehensive Telemetry**:
  - Live temperature in °C or °F.
  - Feels-like apparent temperature.
  - Daily minimum and maximum temperatures.
  - Relative humidity percentage.
  - Wind speed (km/h) and compass direction (e.g., WNW, NE).
  - Precipitation probability (PoP %).
  - Direct pull-to-refresh / instant sync button.

### 4. 24-Hour Hourly Nowcast Carousel
- Horizontally scrollable 24-hour forecast track.
- Visual distinction highlighting the **Current Hour**.
- Displays hour, weather condition icon, temperature, and precipitation chance.

### 5. AI-Powered Personalized Recommendations Engine
- Evaluates real-time sensor metrics against the user's selected persona:
  - **Precipitation**: Recommends umbrellas, warns of road waterlogging.
  - **High Heat / High Humidity**: Hydration schedules, peak UV shade warnings.
  - **Cold / Wind**: Layering and thermal insulation advice.
  - **Agriculture (Kisan)**: Wind speed spray windows, sowing moisture checks, field drainage advisories.
  - **Commuter**: 4-hour rain departure advisories, road friction warnings.
  - **Fitness / Athletics**: Optimal morning/evening outdoor workout windows.
  - **Health Sensitive**: Air quality masks for elevated PM2.5/PM10, humidity respiratory cautions.
- **Explainable Reasoning ("Shown because: ...")**: Transparent tags explaining the exact meteorological condition that triggered each recommendation.

### 6. 7-Day Extended Trend Forecast
- Day name, date, condition icon, and text description.
- **Proportional Min–Max Temperature Range Bars**: Visualizes weekly temperature fluctuation spans at a glance.

### 7. Atmospheric Telemetry & Sensor Cards
- **Solar Arc Visualizer**: Dynamic trajectory arc tracking elapsed daylight between sunrise (~06:00 AM) and sunset (~06:15 PM).
- **Air Quality Index (AQI)**: Indian National Air Quality Index (NAQI) scoring with pollutant indicators (PM2.5, PM10) and health category tags.
- **UV Radiation Index**: Numeric index with WHO exposure risk level and protective recommendations.
- **Visibility & Cloud Cover**: Distance in kilometers with haze/fog classification.
- **Barometric Pressure**: Atmospheric surface pressure in hectopascals (hPa).
- **Precipitation Probability**: Expected precipitation intensity and accumulation forecast.

### 8. Severe Weather Alert Banner (CAP Protocol Compliant)
- Designed according to **Common Alerting Protocol (CAP)** standards followed by NDMA and IMD.
- Color-coded severity tiers: **Yellow (Watch)**, **Orange (Alert)**, and **Red (Warning)**.
- Detailed precaution list and validity timestamps.
- Built-in **"Test Alert Protocol"** simulator allowing safety drills and UI validation without generating false alarms in live data mode.

### 9. Bottom Navigation & Feature Modals
- Four-tab mobile navigation bar: **Home**, **Forecast**, **Radar / Map**, and **Personalize**.
- **Interactive Doppler Radar Simulation Modal**: Animates simulated dBZ precipitation reflectivity and wind streamlines over the Indian subcontinent.
- **Personalization & Settings Modal**:
  - Persona selection.
  - Default city and favorite location management.
  - Metric/Imperial unit toggle (°C / °F).
  - Light/Dark mode switcher.
  - Section visibility toggles (customize what appears on the homepage).
  - Live data vs. Offline Demo Mode toggle.

---

## 🏛️ Exact Layout Ordering

The homepage strictly follows the standardized 9-section hierarchy:
1. **App logo and personalized greeting** (`Header.jsx`)
2. **Location selector and search** (`LocationSelector.jsx`)
3. **Main current-weather card** (`CurrentWeatherCard.jsx`)
4. **Hourly forecast** (`HourlyForecast.jsx`)
5. **Weather-based recommendations** (`RecommendationsSection.jsx`)
6. **Seven-day forecast** (`DailyForecast.jsx`)
7. **Additional weather information** (`AdditionalMetrics.jsx`)
8. **Weather alerts, when available** (`AlertsBanner.jsx`)
9. **Bottom navigation bar** (`BottomNav.jsx`)

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) via [Vite 6/8](https://vitejs.dev/) |
| **Styling** | Custom Vanilla CSS Design System with Glassmorphism, CSS Variables, and Mobile Ergonomics |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Typography** | Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit) for headings & [Inter](https://fonts.google.com/specimen/Inter) for data) |
| **Data Provider** | [Open-Meteo](https://open-meteo.com/) High-Resolution Weather & Air Quality APIs (Zero-key, free for public/educational use) |
| **State & Storage** | React `useState`/`useEffect` with browser `localStorage` persistence |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Installation

1. Navigate to the project directory:
   ```bash
   cd weather
   ```

2. Install dependencies (already pre-installed if cloned locally):
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` (or the URL shown in your terminal).

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
weather/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AdditionalMetrics.jsx     # Solar arc, AQI, UV index, pressure, visibility
│   │   ├── AlertsBanner.jsx          # CAP-compliant weather warnings & test simulation
│   │   ├── BottomNav.jsx             # Mobile bottom navigation bar
│   │   ├── CurrentWeatherCard.jsx    # Hero card with adaptive weather theme & telemetry
│   │   ├── DailyForecast.jsx         # 7-day extended forecast with temp range bars
│   │   ├── Header.jsx                # MoES/IMD branding, greeting, time, quick toggles
│   │   ├── HourlyForecast.jsx        # 24-hour horizontal scrolling carousel
│   │   ├── LocationSelector.jsx      # City search, autocomplete, GPS, favorites
│   │   ├── RadarMapModal.jsx         # Doppler radar & wind streamline animation
│   │   ├── RecommendationsSection.jsx # Explainable persona recommendations
│   │   ├── SettingsModal.jsx         # Personalization & layout customization
│   │   └── WeatherIcon.jsx           # Condition-code-to-icon mapper
│   ├── services/
│   │   ├── recommendationEngine.js   # Rule-based explainable recommendation logic
│   │   └── weatherService.js         # Open-Meteo API, Geocoding, WMO codes, Mock fallback
│   ├── App.jsx                       # Main application state & 9-section layout orchestrator
│   ├── index.css                     # Comprehensive design system stylesheet
│   └── main.jsx                      # React entrypoint
├── index.html                        # App title, SEO metadata & Google Fonts
├── package.json
└── README.md
```

---

## 🌐 Weather API Integration & Offline Fallback

- **Live Data**: Uses Open-Meteo's open meteorological data pipeline. No API keys are required, preventing accidental leaks in client code.
- **Air Quality**: Integrates CAMS European Centre & IMD Indian Air Quality models via Open-Meteo Air Quality API.
- **Offline / Resilient Fallback**: If network requests fail or offline mode is toggled, a robust simulated data generator creates mathematically consistent, diurnal temperature and solar curves with realistic weather patterns.
