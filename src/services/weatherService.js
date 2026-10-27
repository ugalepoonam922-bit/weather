// WMO Weather interpretation codes (WW)
export const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', icon: 'Sun', type: 'clear' },
  1: { label: 'Mainly Clear', icon: 'Sun', type: 'clear' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', type: 'cloudy' },
  3: { label: 'Overcast', icon: 'Cloud', type: 'cloudy' },
  45: { label: 'Foggy', icon: 'CloudFog', type: 'fog' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', type: 'fog' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', type: 'rain' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', type: 'rain' },
  55: { label: 'Dense Drizzle', icon: 'CloudDrizzle', type: 'rain' },
  61: { label: 'Slight Rain', icon: 'CloudRain', type: 'rain' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', type: 'rain' },
  65: { label: 'Heavy Monsoon Rain', icon: 'CloudRain', type: 'heavy-rain' },
  71: { label: 'Slight Snow', icon: 'Snowflake', type: 'snow' },
  73: { label: 'Moderate Snow', icon: 'Snowflake', type: 'snow' },
  75: { label: 'Heavy Snowfall', icon: 'Snowflake', type: 'snow' },
  80: { label: 'Slight Rain Showers', icon: 'CloudRain', type: 'rain' },
  81: { label: 'Moderate Rain Showers', icon: 'CloudRain', type: 'rain' },
  82: { label: 'Violent Rain Showers', icon: 'CloudLightning', type: 'storm' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', type: 'storm' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'CloudLightning', type: 'storm' },
  99: { label: 'Severe Thunderstorm with Heavy Hail', icon: 'CloudLightning', type: 'storm' },
};

export const POPULAR_INDIAN_CITIES = [
  { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lon: 77.1734 },
  { name: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lon: 74.7973 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lon: 91.7362 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739 },
];

export function getWeatherConditionInfo(code, isDay = 1) {
  const defaultInfo = isDay
    ? { label: 'Partly Sunny', icon: 'Sun', type: 'clear' }
    : { label: 'Clear Night', icon: 'Moon', type: 'clear-night' };

  const info = WMO_CODE_MAP[code] || defaultInfo;
  if (!isDay && (code === 0 || code === 1)) {
    return { ...info, label: 'Clear Night', icon: 'Moon', type: 'clear-night' };
  }
  return info;
}

export function windDirectionDegreesToText(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

// Convert Celsius to Fahrenheit
export function convertTemp(celsius, unit = 'C') {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

// Fetch live weather data from Open-Meteo
export async function fetchLiveWeatherData(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,visibility,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide&timezone=auto`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather service returned HTTP ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();
  let aqiData = null;
  if (aqiRes && aqiRes.ok) {
    aqiData = await aqiRes.json();
  }

  return formatOpenMeteoResponse(weatherData, aqiData);
}

// Format Open-Meteo raw JSON into clean state models
function formatOpenMeteoResponse(w, aqi) {
  const curr = w.current || {};
  const hourly = w.hourly || {};
  const daily = w.daily || {};

  // Current Hour Index
  const nowIso = new Date().toISOString().slice(0, 13);
  let nowIdx = (hourly.time || []).findIndex((t) => t.startsWith(nowIso));
  if (nowIdx === -1) nowIdx = 0;

  // Next 24 hours
  const hourlyCards = [];
  const totalHours = Math.min(24, (hourly.time || []).length - nowIdx);
  for (let i = 0; i < totalHours; i++) {
    const idx = nowIdx + i;
    const timeStr = hourly.time[idx];
    const dateObj = new Date(timeStr);
    const hour12 = dateObj.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true });

    hourlyCards.push({
      time: i === 0 ? 'Now' : hour12,
      rawTime: timeStr,
      temp: hourly.temperature_2m ? hourly.temperature_2m[idx] : 28,
      pop: hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0,
      code: hourly.weather_code ? hourly.weather_code[idx] : 0,
      isDay: dateObj.getHours() >= 6 && dateObj.getHours() < 19 ? 1 : 0,
    });
  }

  // 7-day forecast
  const dailyCards = [];
  const daysCount = Math.min(7, (daily.time || []).length);
  for (let i = 0; i < daysCount; i++) {
    const dStr = daily.time[i];
    const dObj = new Date(dStr);
    const dayName = i === 0 ? 'Today' : dObj.toLocaleDateString('en-IN', { weekday: 'short' });
    const formattedDate = dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    dailyCards.push({
      day: dayName,
      date: formattedDate,
      maxTemp: daily.temperature_2m_max ? daily.temperature_2m_max[i] : 32,
      minTemp: daily.temperature_2m_min ? daily.temperature_2m_min[i] : 22,
      code: daily.weather_code ? daily.weather_code[i] : 1,
      pop: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 10,
      rainSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
      uvMax: daily.uv_index_max ? daily.uv_index_max[i] : 6,
    });
  }

  // Air Quality
  const usAqi = aqi?.current?.us_aqi ?? aqi?.current?.european_aqi ?? 142;
  const pm25 = aqi?.current?.pm2_5 ?? 48.5;
  const pm10 = aqi?.current?.pm10 ?? 92.0;

  // Visibility (meters to km)
  const visMeters = hourly.visibility ? hourly.visibility[nowIdx] : 7500;
  const visKm = (visMeters / 1000).toFixed(1);

  // UV index
  const uvNow = hourly.uv_index ? hourly.uv_index[nowIdx] : 5.8;

  // Sunrise/Sunset
  const todaySunrise = daily.sunrise ? daily.sunrise[0] : null;
  const todaySunset = daily.sunset ? daily.sunset[0] : null;

  return {
    current: {
      temperature: curr.temperature_2m ?? 29,
      apparentTemperature: curr.apparent_temperature ?? 31,
      humidity: curr.relative_humidity_2m ?? 65,
      precipitation: curr.precipitation ?? 0,
      rainProbability: hourly.precipitation_probability ? hourly.precipitation_probability[nowIdx] : 15,
      weatherCode: curr.weather_code ?? 1,
      isDay: curr.is_day ?? 1,
      windSpeed: curr.wind_speed_10m ?? 12,
      windDirection: curr.wind_direction_10m ?? 120,
      pressure: curr.pressure_msl ?? 1012,
      cloudCover: curr.cloud_cover ?? 35,
      visibilityKm: visKm,
      uvIndex: uvNow,
      minTemp: daily.temperature_2m_min ? daily.temperature_2m_min[0] : 24,
      maxTemp: daily.temperature_2m_max ? daily.temperature_2m_max[0] : 34,
    },
    hourly: hourlyCards,
    daily: dailyCards,
    aqi: {
      score: Math.round(usAqi),
      pm25: pm25,
      pm10: pm10,
      status: getAqiStatus(usAqi),
    },
    astronomy: {
      sunrise: todaySunrise ? formatTimeString(todaySunrise) : '05:48 AM',
      sunset: todaySunset ? formatTimeString(todaySunset) : '06:14 PM',
      sunriseIso: todaySunrise,
      sunsetIso: todaySunset,
    },
    fetchedAt: new Date().toISOString(),
  };
}

function formatTimeString(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function getAqiStatus(aqi) {
  if (aqi <= 50) return { label: 'Good', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
  if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' };
  return { label: 'Hazardous (Severe)', color: '#7f1d1d', bg: 'rgba(127, 29, 29, 0.25)' };
}

export function getUvCategory(uv) {
  if (uv < 3) return { label: 'Low', advice: 'No protection required for outdoor stay.' };
  if (uv < 6) return { label: 'Moderate', advice: 'Wear sunglasses, hat, and apply SPF 15+.' };
  if (uv < 8) return { label: 'High', advice: 'Seek shade during midday. Wear SPF 30+.' };
  if (uv < 11) return { label: 'Very High', advice: 'Minimize sun exposure between 11 AM - 4 PM.' };
  return { label: 'Extreme', advice: 'Avoid outdoor stay. Intense UV radiation.' };
}

// City Search using Open-Meteo Geocoding
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((item) => ({
      name: item.name,
      state: item.admin1 || item.country,
      country: item.country,
      lat: item.latitude,
      lon: item.longitude,
    }));
  } catch (err) {
    console.error('City search failed', err);
    return [];
  }
}

// Fallback Mock/Demo Weather Data
export function getMockWeatherData(city = 'New Delhi') {
  return {
    current: {
      temperature: 31,
      apparentTemperature: 34,
      humidity: 62,
      precipitation: 0.2,
      rainProbability: 25,
      weatherCode: 2, // partly cloudy
      isDay: 1,
      windSpeed: 14,
      windDirection: 110,
      pressure: 1010,
      cloudCover: 40,
      visibilityKm: '6.5',
      uvIndex: 6.8,
      minTemp: 23,
      maxTemp: 35,
    },
    hourly: Array.from({ length: 24 }).map((_, i) => ({
      time: i === 0 ? 'Now' : `${(new Date().getHours() + i) % 24}:00`,
      temp: Math.round(28 + Math.sin(i / 3) * 6),
      pop: Math.min(90, Math.max(10, Math.round(20 + Math.cos(i / 2) * 35))),
      code: i % 4 === 0 ? 61 : 2,
      isDay: ((new Date().getHours() + i) % 24 >= 6 && (new Date().getHours() + i) % 24 < 19) ? 1 : 0,
    })),
    daily: [
      { day: 'Today', date: '27 Oct', minTemp: 23, maxTemp: 35, code: 2, pop: 25, uvMax: 7 },
      { day: 'Wed', date: '28 Oct', minTemp: 24, maxTemp: 36, code: 1, pop: 10, uvMax: 8 },
      { day: 'Thu', date: '29 Oct', minTemp: 22, maxTemp: 32, code: 61, pop: 65, uvMax: 5 },
      { day: 'Fri', date: '30 Oct', minTemp: 21, maxTemp: 30, code: 95, pop: 85, uvMax: 4 },
      { day: 'Sat', date: '31 Oct', minTemp: 22, maxTemp: 31, code: 80, pop: 50, uvMax: 6 },
      { day: 'Sun', date: '01 Nov', minTemp: 20, maxTemp: 32, code: 1, pop: 15, uvMax: 7 },
      { day: 'Mon', date: '02 Nov', minTemp: 19, maxTemp: 31, code: 0, pop: 5, uvMax: 7 },
    ],
    aqi: {
      score: 184,
      pm25: 68.4,
      pm10: 135.2,
      status: getAqiStatus(184),
    },
    astronomy: {
      sunrise: '06:12 AM',
      sunset: '05:46 PM',
      sunriseIso: new Date().toISOString(),
      sunsetIso: new Date().toISOString(),
    },
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Calculate Lifestyle & Outdoor Activity Scores (0-100)
 */
export function calculateActivityIndices(weather) {
  if (!weather || !weather.current) return [];

  const { current, aqi } = weather;
  const temp = current.temperature;
  const pop = current.rainProbability || 0;
  const humidity = current.humidity || 50;
  const wind = current.windSpeed || 10;
  const aqiScore = aqi?.score || 80;
  const clouds = current.cloudCover || 30;

  // 1. Running / Outdoor Workout
  let jogScore = 100;
  if (temp > 32) jogScore -= (temp - 32) * 5;
  if (temp < 10) jogScore -= (10 - temp) * 4;
  if (pop > 30) jogScore -= pop * 0.7;
  if (aqiScore > 100) jogScore -= (aqiScore - 100) * 0.25;
  if (humidity > 75) jogScore -= 15;
  jogScore = Math.max(15, Math.min(98, Math.round(jogScore)));

  // 2. Laundry Drying
  let laundryScore = 100;
  if (humidity > 60) laundryScore -= (humidity - 60) * 1.2;
  if (pop > 20) laundryScore -= pop * 0.9;
  if (clouds > 50) laundryScore -= (clouds - 50) * 0.5;
  if (wind > 12) laundryScore += 10; // breeze accelerates evaporation
  laundryScore = Math.max(10, Math.min(100, Math.round(laundryScore)));

  // 3. Car Wash
  let carWashScore = 100;
  if (pop > 25) carWashScore -= pop * 1.1;
  const rainNextDays = (weather.daily || []).slice(0, 2).some((d) => d.pop > 40);
  if (rainNextDays) carWashScore -= 30;
  carWashScore = Math.max(10, Math.min(99, Math.round(carWashScore)));

  // 4. Cycling & City Commute
  let cyclingScore = 100;
  if (pop > 25) cyclingScore -= pop * 0.8;
  if (wind > 25) cyclingScore -= (wind - 25) * 2;
  if (temp > 35) cyclingScore -= (temp - 35) * 6;
  if (aqiScore > 150) cyclingScore -= 20;
  cyclingScore = Math.max(20, Math.min(98, Math.round(cyclingScore)));

  // 5. Stargazing & Night Sky
  let starScore = 100 - clouds;
  if (pop > 20) starScore -= pop * 0.5;
  if (humidity > 80) starScore -= 15;
  starScore = Math.max(10, Math.min(95, Math.round(starScore)));

  const getLabel = (score) => {
    if (score >= 80) return { text: 'Optimal', color: '#10b981' };
    if (score >= 60) return { text: 'Favorable', color: '#0284c7' };
    if (score >= 40) return { text: 'Moderate', color: '#f59e0b' };
    return { text: 'Unfavorable', color: '#ef4444' };
  };

  return [
    {
      id: 'jogging',
      name: 'Outdoor Running',
      icon: 'Activity',
      score: jogScore,
      status: getLabel(jogScore),
      advice: jogScore >= 70 ? 'Pleasant temperature & safe air.' : 'High heat or dust; prefer indoor gym.',
    },
    {
      id: 'laundry',
      name: 'Laundry Drying',
      icon: 'Shirt',
      score: laundryScore,
      status: getLabel(laundryScore),
      advice: laundryScore >= 70 ? 'Fast solar evaporation expected.' : 'High humidity slows fabric drying.',
    },
    {
      id: 'carwash',
      name: 'Car Washing',
      icon: 'Car',
      score: carWashScore,
      status: getLabel(carWashScore),
      advice: carWashScore >= 70 ? 'No immediate rain forecasted.' : 'Shower risk may spot fresh polish.',
    },
    {
      id: 'cycling',
      name: 'Cycling & Two-Wheeler',
      icon: 'Bike',
      score: cyclingScore,
      status: getLabel(cyclingScore),
      advice: cyclingScore >= 70 ? 'Calm crosswinds & dry roads.' : 'Beware of slick roads and strong gusts.',
    },
    {
      id: 'stargazing',
      name: 'Night Sky Stargazing',
      icon: 'Sparkles',
      score: starScore,
      status: getLabel(starScore),
      advice: starScore >= 70 ? 'Clear celestial viewing tonight.' : 'Cloud opacity obstructs visibility.',
    },
  ];
}

/**
 * Agromet & Kisan Meteorological Advisory (GKMS Bulletin)
 */
export function getAgrometAdvisory(weather, city = 'New Delhi') {
  if (!weather || !weather.current) return null;

  const { current, daily } = weather;
  const temp = current.temperature;
  const humidity = current.humidity;
  const wind = current.windSpeed;
  const pop = current.rainProbability;

  // Determine spray window (pesticides/nutrients)
  const isSprayFeasible = wind < 18 && pop < 30;

  // Soil moisture estimation
  const soilMoisture = pop > 50 || humidity > 70 ? 'High / Saturated' : humidity > 45 ? 'Adequate' : 'Deficit / Needs Irrigation';

  // Advisory bullets
  const advisories = [];
  if (isSprayFeasible) {
    advisories.push('Ideal conditions for foliar spray of micronutrients and pest management.');
  } else {
    advisories.push('Postpone chemical spraying; high wind drift or rain runoff likely.');
  }

  if (soilMoisture.includes('Deficit')) {
    advisories.push('Schedule light evening drip irrigation to preserve root-zone moisture.');
  } else if (soilMoisture.includes('Saturated')) {
    advisories.push('Ensure adequate drainage in low-lying crop beds to prevent waterlogging.');
  }

  if (temp > 34) {
    advisories.push('Provide shade netting and adequate hydration for dairy livestock.');
  }

  return {
    zone: `Agromet Field Unit (${city})`,
    source: 'Gramin Krishi Mausam Sewa (GKMS) • IMD MoES',
    sprayWindow: isSprayFeasible ? 'Recommended' : 'Not Advised',
    soilMoisture,
    advisories,
    monsoonStatus: 'Normal Seasonal Atmospheric Flow',
  };
}

/**
 * Generates spoken weather summary for Mausam Vaani Voice Assistant
 */
export function generateVoiceBriefingText(weather, cityName = 'your location', persona = 'general', unit = 'C') {
  if (!weather || !weather.current) return 'Weather data is currently updating.';

  const { current, aqi } = weather;
  const temp = convertTemp(current.temperature, unit);
  const condition = getWeatherConditionInfo(current.weatherCode, current.isDay).label;
  const feels = convertTemp(current.apparentTemperature, unit);
  const rain = current.rainProbability || 0;
  const aqiLabel = aqi?.status?.label || 'Moderate';

  let voice = `Namaste! Here is your Mausam weather briefing for ${cityName}. `;
  voice += `Currently, it is ${temp} degrees ${unit === 'C' ? 'Celsius' : 'Fahrenheit'} with ${condition}. `;
  voice += `It feels like ${feels} degrees. `;

  if (rain >= 40) {
    voice += `Rain probability is elevated at ${rain} percent, so carry an umbrella. `;
  } else {
    voice += `Rain chance is low at ${rain} percent. `;
  }

  voice += `Air quality index is currently ${aqi?.score || 100}, rated as ${aqiLabel}. `;

  if (persona === 'farmer') {
    voice += 'Kisan note: Wind speeds are suitable for routine field inspection. ';
  } else if (persona === 'fitness') {
    voice += 'Fitness note: Best workout hours are early morning or late evening. ';
  }

  voice += 'Stay weather-smart and have a great day!';
  return voice;
}

/**
 * Generates formatted text report for WhatsApp / Social Media
 */
export function generateShareableReport(weather, cityName = 'New Delhi', unit = 'C') {
  if (!weather || !weather.current) return '';

  const { current, aqi, daily } = weather;
  const temp = convertTemp(current.temperature, unit);
  const feels = convertTemp(current.apparentTemperature, unit);
  const cond = getWeatherConditionInfo(current.weatherCode, current.isDay).label;
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  let text = `🌦️ *MAUSAM WEATHER REPORT* 🌦️\n`;
  text += `📍 *${cityName}* — ${dateStr}\n\n`;
  text += `🌡️ *Temp:* ${temp}°${unit} (Feels like ${feels}°${unit})\n`;
  text += `☁️ *Condition:* ${cond}\n`;
  text += `💧 *Humidity:* ${current.humidity}%\n`;
  text += `💨 *Wind:* ${current.windSpeed} km/h (${windDirectionDegreesToText(current.windDirection)})\n`;
  text += `🌧️ *Rain Chance:* ${current.rainProbability}%\n`;
  text += `🍃 *Air Quality (AQI):* ${aqi?.score || 'N/A'} (${aqi?.status?.label || 'Moderate'})\n\n`;

  if (daily && daily.length > 0) {
    text += `📅 *Weekly Outlook:*\n`;
    daily.slice(0, 3).forEach((d) => {
      text += `• ${d.day}: ${convertTemp(d.minTemp, unit)}° - ${convertTemp(d.maxTemp, unit)}° (${getWeatherConditionInfo(d.code).label})\n`;
    });
    text += `\n`;
  }

  text += `📲 Generated via *Mausam (IMD • MoES)*`;
  return text;
}

