import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Snowflake,
  Wind,
} from 'lucide-react';
import { getWeatherConditionInfo } from '../services/weatherService';

export default function WeatherIcon({ code = 0, isDay = 1, size = 32, className = '' }) {
  const info = getWeatherConditionInfo(code, isDay);

  let IconComponent = Sun;
  let colorClass = 'icon-sunny';

  switch (info.icon) {
    case 'Sun':
      IconComponent = isDay ? Sun : Moon;
      colorClass = isDay ? 'icon-sunny' : 'icon-moon';
      break;
    case 'Moon':
      IconComponent = Moon;
      colorClass = 'icon-moon';
      break;
    case 'CloudSun':
      IconComponent = isDay ? CloudSun : CloudMoon;
      colorClass = 'icon-partly-cloudy';
      break;
    case 'Cloud':
      IconComponent = Cloud;
      colorClass = 'icon-cloudy';
      break;
    case 'CloudDrizzle':
      IconComponent = CloudDrizzle;
      colorClass = 'icon-rainy';
      break;
    case 'CloudRain':
      IconComponent = CloudRain;
      colorClass = 'icon-rainy';
      break;
    case 'CloudLightning':
      IconComponent = CloudLightning;
      colorClass = 'icon-stormy';
      break;
    case 'CloudFog':
      IconComponent = CloudFog;
      colorClass = 'icon-foggy';
      break;
    case 'Snowflake':
      IconComponent = Snowflake;
      colorClass = 'icon-snowy';
      break;
    default:
      IconComponent = isDay ? Sun : Moon;
      colorClass = isDay ? 'icon-sunny' : 'icon-moon';
  }

  return <IconComponent size={size} className={`weather-icon ${colorClass} ${className}`} />;
}
