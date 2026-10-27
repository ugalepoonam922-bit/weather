/**
 * Mausam Personalized Weather Recommendation Engine
 * Evaluates real-time weather telemetry against user persona and context
 * with transparent explainability tags ("Shown because: ...")
 */

export function generatePersonalizedRecommendations(weather, persona = 'general', unit = 'C') {
  if (!weather || !weather.current) return [];

  const { current, hourly, aqi } = weather;
  const tempC = current.temperature;
  const apparentTempC = current.apparentTemperature;
  const rainProb = current.rainProbability;
  const uv = current.uvIndex || 0;
  const windKm = current.windSpeed || 0;
  const aqiScore = aqi?.score || 100;
  const humidity = current.humidity || 50;

  // Check hourly rain trend (next 6 hours)
  const next6h = (hourly || []).slice(0, 6);
  const maxRainNext6h = next6h.reduce((max, h) => Math.max(max, h.pop || 0), rainProb);
  const rainComingSoon = maxRainNext6h >= 45;

  const recommendations = [];

  // 1. Rain / Umbrella Advisory
  if (rainComingSoon) {
    recommendations.push({
      id: 'rec_umbrella',
      title: 'Keep an Umbrella Handy',
      description: `Elevated precipitation chance (${maxRainNext6h}%) expected within the next 4–6 hours. Keep rain gear or an umbrella accessible when leaving.`,
      icon: 'Umbrella',
      category: 'commute',
      urgency: maxRainNext6h > 70 ? 'high' : 'medium',
      reason: `Rain probability peaks at ${maxRainNext6h}% in the upcoming forecast window.`,
      personaWeight: persona === 'commuter' ? 1.5 : 1.0,
    });
  }

  // 2. Heat / Hydration Advisory
  if (apparentTempC >= 34 || tempC >= 33) {
    recommendations.push({
      id: 'rec_hydration',
      title: 'Stay Hydrated & Seek Shade',
      description: `Feels-like temperature is hovering near ${Math.round(apparentTempC)}°C with ${humidity}% humidity. Drink plenty of water and avoid continuous sun exposure.`,
      icon: 'Droplets',
      category: 'health',
      urgency: apparentTempC >= 38 ? 'high' : 'medium',
      reason: `Heat index feels like ${Math.round(apparentTempC)}°C under high humidity (${humidity}%).`,
      personaWeight: persona === 'fitness' ? 1.4 : 1.0,
    });
  } else if (tempC <= 14) {
    // Cold Weather Advisory
    recommendations.push({
      id: 'rec_jacket',
      title: 'Warm Layer Recommended',
      description: `Current temperature is ${Math.round(tempC)}°C with cooler winds (${windKm} km/h). Carry a light jacket or windbreaker for morning/evening hours.`,
      icon: 'Shirt',
      category: 'health',
      urgency: tempC <= 8 ? 'high' : 'medium',
      reason: `Ambient temperature drops to ${Math.round(tempC)}°C with significant wind chill.`,
      personaWeight: 1.0,
    });
  }

  // 3. Air Quality Health Advisory
  if (aqiScore >= 160) {
    recommendations.push({
      id: 'rec_aqi',
      title: 'Air Quality Precaution (N95 Mask)',
      description: `AQI is recorded at ${aqiScore} (${aqi?.status?.label || 'Unhealthy'}). Sensitive groups should limit heavy outdoor exertion and wear protective masks.`,
      icon: 'ShieldAlert',
      category: 'health',
      urgency: aqiScore >= 200 ? 'high' : 'medium',
      reason: `Air Quality Index is ${aqiScore} (PM2.5: ${aqi?.pm25?.toFixed(1) || 'elevated'} µg/m³).`,
      personaWeight: persona === 'health' ? 1.8 : 1.1,
    });
  }

  // 4. UV Protection Advisory
  if (uv >= 6.0 && current.isDay) {
    recommendations.push({
      id: 'rec_uv',
      title: 'High UV Radiation: Sun Protection',
      description: `Solar UV Index is ${uv.toFixed(1)} (Very High). Apply broad-spectrum SPF 30+ sunscreen, wear protective sunglasses, and avoid peak midday glare.`,
      icon: 'SunDim',
      category: 'health',
      urgency: uv >= 8 ? 'high' : 'medium',
      reason: `Solar UV Index measures ${uv.toFixed(1)} during daylight peak hours.`,
      personaWeight: persona === 'fitness' ? 1.3 : 1.0,
    });
  }

  // 5. Persona-Specific Tailored Advisories
  if (persona === 'farmer') {
    if (windKm <= 15 && !rainComingSoon) {
      recommendations.push({
        id: 'rec_farmer_spray',
        title: 'Favorable Spraying & Field Operations Window',
        description: `Current wind speed is moderate (${windKm} km/h) with low precipitation risk (${rainProb}%). Suitable for foliar spraying, irrigation, and field scouting.`,
        icon: 'Sprout',
        category: 'agriculture',
        urgency: 'info',
        reason: 'Selected Persona: Farmer / Agriculturalist + Favorable low-wind conditions.',
        personaWeight: 2.0,
      });
    } else if (rainComingSoon) {
      recommendations.push({
        id: 'rec_farmer_harvest',
        title: 'Safeguard Harvested Produce & Grains',
        description: `Upcoming rainfall (${maxRainNext6h}%) likely. Secure open harvested crops in drying yards and postpone planned fertilizer applications to prevent runoff.`,
        icon: 'Wheat',
        category: 'agriculture',
        urgency: 'high',
        reason: 'Selected Persona: Farmer + Rain forecast in next 6 hours.',
        personaWeight: 2.0,
      });
    }
  } else if (persona === 'fitness') {
    // Fitness timing recommendation
    const bestHour = (hourly || []).slice(0, 14).find((h) => h.temp <= 27 && (h.pop || 0) < 30);
    recommendations.push({
      id: 'rec_fitness_window',
      title: 'Optimal Outdoor Workout Window',
      description: bestHour
        ? `Ideal outdoor jogging/cycling time around ${bestHour.time} (${Math.round(bestHour.temp)}°C, comfortable humidity, low precipitation).`
        : 'Evening hours after sunset offer cooler ambient temperatures for running.',
      icon: 'Activity',
      category: 'lifestyle',
      urgency: 'info',
      reason: 'Selected Persona: Outdoor Fitness + Temperature & Precipitation comfort curve.',
      personaWeight: 2.0,
    });
  } else if (persona === 'commuter') {
    // Commute advisory
    if (rainComingSoon || windKm > 25) {
      recommendations.push({
        id: 'rec_commute_traffic',
        title: 'Anticipate Wet Roads & Traffic Delays',
        description: `Wet surface conditions and possible waterlogging may slow arterial traffic. Allow 15–20 minutes extra transit buffer.`,
        icon: 'Car',
        category: 'commute',
        urgency: 'medium',
        reason: 'Selected Persona: Daily Commuter + Precipitation radar probability.',
        personaWeight: 2.0,
      });
    }
  }

  // General lifestyle fallback if few recommendations
  if (recommendations.length < 2) {
    recommendations.push({
      id: 'rec_pleasant',
      title: 'Pleasant Outdoor Conditions',
      description: `Mild temperature (${Math.round(tempC)}°C) and clear skies. Excellent weather for outdoor strolls, errands, and natural ventilation.`,
      icon: 'Sparkles',
      category: 'lifestyle',
      urgency: 'info',
      reason: 'General profile + Mild weather parameters across all indices.',
      personaWeight: 1.0,
    });
  }

  // Sort by (Urgency tier + Persona weight)
  const urgencyWeight = { high: 3, medium: 2, info: 1 };
  recommendations.sort((a, b) => {
    const scoreA = (urgencyWeight[a.urgency] || 1) * a.personaWeight;
    const scoreB = (urgencyWeight[b.urgency] || 1) * b.personaWeight;
    return scoreB - scoreA;
  });

  return recommendations;
}
