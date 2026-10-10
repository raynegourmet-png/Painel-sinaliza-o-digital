import { WeatherLocationPresetId } from '../types/signage';

export interface WeatherLocationPreset {
  id: WeatherLocationPresetId;
  label: string;
  shortCity: string;
  highwayTag: string;
  latitude: number;
  longitude: number;
}

export const WEATHER_LOCATION_PRESETS: WeatherLocationPreset[] = [
  {
    id: 'auto_geo',
    label: 'Geolocalização Automática (GPS / IP da TV)',
    shortCity: 'Manaus, AM',
    highwayTag: 'Localização Dinâmica em Tempo Real',
    latitude: -3.119,
    longitude: -60.0217
  },
  {
    id: 'manaus_br319',
    label: 'Manaus / BR-319 (AM)',
    shortCity: 'Manaus, AM',
    highwayTag: 'BR-319/AM · Km 0 ao Km 198',
    latitude: -3.119,
    longitude: -60.0217
  },
  {
    id: 'humaita_br230',
    label: 'Humaitá / BR-230 e BR-319 (AM)',
    shortCity: 'Humaitá, AM',
    highwayTag: 'Entroncamento BR-319/AM · BR-230/AM',
    latitude: -7.5061,
    longitude: -63.0208
  },
  {
    id: 'labrea_br230',
    label: 'Lábrea / BR-230 Transamazônica (AM)',
    shortCity: 'Lábrea, AM',
    highwayTag: 'BR-230/AM · Subtrecho Lábrea',
    latitude: -7.2586,
    longitude: -64.7975
  },
  {
    id: 'porto_velho_br319',
    label: 'Porto Velho / BR-319 Sul (RO)',
    shortCity: 'Porto Velho, RO',
    highwayTag: 'BR-319/RO · Entroncamento Sul',
    latitude: -8.7619,
    longitude: -63.9039
  },
  {
    id: 'careiro_br319',
    label: 'Careiro Castanho / BR-319 (AM)',
    shortCity: 'Careiro Castanho, AM',
    highwayTag: 'BR-319/AM · Trecho do Meio',
    latitude: -3.8125,
    longitude: -60.3536
  },
  {
    id: 'apui_br230',
    label: 'Apuí / BR-230 Transamazônica (AM)',
    shortCity: 'Apuí, AM',
    highwayTag: 'BR-230/AM · Frente Leste',
    latitude: -7.1967,
    longitude: -59.8914
  }
];

export const QUICK_OVERRIDE_CITIES = [
  { name: 'Manaus', label: 'Manaus / BR-319 (AM)', lat: -3.119, lon: -60.0217 },
  { name: 'Humaitá', label: 'Humaitá / BR-230 e BR-319 (AM)', lat: -7.5061, lon: -63.0208 },
  { name: 'Lábrea', label: 'Lábrea / BR-230 (AM)', lat: -7.2586, lon: -64.7975 },
  { name: 'Porto Velho', label: 'Porto Velho / BR-319 (RO)', lat: -8.7619, lon: -63.9039 },
  { name: 'Careiro Castanho', label: 'Careiro Castanho / BR-319 (AM)', lat: -3.8125, lon: -60.3536 },
  { name: 'Apuí', label: 'Apuí / BR-230 (AM)', lat: -7.1967, lon: -59.8914 }
];

export interface DailyForecastItem {
  dateIso: string;
  weekdayShort: string; // Ex: "Sáb", "Dom", "Seg"
  dayMonth: string; // Ex: "10/10"
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  weatherCode: number;
  conditionLabel: string;
  iconClass: string;
  accentColor: string;
}

export interface HighwayWeatherReport {
  locationLabel: string;
  highwayTag: string;
  sourceType: 'gps' | 'ip' | 'manual';
  currentTemp: number;
  humidity: number;
  windSpeedKmh: number;
  weatherCode: number;
  conditionLabel: string;
  iconClass: string;
  accentColor: string;
  fieldAlert: string;
  updatedAt: string;
  daily: DailyForecastItem[];
}

export function mapWmoCodeToMeta(code: number): {
  label: string;
  iconClass: string;
  accentColor: string;
  fieldAlert: string;
} {
  if (code === 0) {
    return {
      label: 'Céu Limpo / Ensolarado',
      iconClass: 'fa-solid fa-sun text-amber-400 animate-weather-float',
      accentColor: '#FBBF24',
      fieldAlert: 'Condição favorável para pavimentação CBUQ e topografia'
    };
  }
  if (code === 1 || code === 2) {
    return {
      label: 'Parcialmente Nublado',
      iconClass: 'fa-solid fa-cloud-sun text-amber-300 animate-weather-float',
      accentColor: '#FCD34D',
      fieldAlert: 'Condição operacional normal para frentes de terraplenagem e OAE'
    };
  }
  if (code === 3 || code === 45 || code === 48) {
    return {
      label: 'Nublado / Úmido',
      iconClass: 'fa-solid fa-cloud text-slate-300 animate-weather-float',
      accentColor: '#CBD5E1',
      fieldAlert: 'Atenção ao controle de umidade de solo em praças de aterro'
    };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: 'Pancadas de Chuva',
      iconClass: 'fa-solid fa-cloud-showers-heavy text-sky-400 animate-weather-float',
      accentColor: '#38BDF8',
      fieldAlert: 'Monitorar drenagem superficial, taludes e tráfego 4x4 no trecho'
    };
  }
  if (code >= 95) {
    return {
      label: 'Tempestade / Trovoadas',
      iconClass: 'fa-solid fa-cloud-bolt text-purple-300 animate-weather-float',
      accentColor: '#D178FF',
      fieldAlert: 'Alerta QSMS: Suspender atividades em estruturas elevadas e VANT/Drone'
    };
  }
  return {
    label: 'Instável / Chuva Isolada',
    iconClass: 'fa-solid fa-cloud-sun-rain text-sky-300 animate-weather-float',
    accentColor: '#7DD3FC',
    fieldAlert: 'Acompanhamento preventivo das condições de trafegabilidade'
  };
}

export function buildFallbackWeatherReport(
  presetId: WeatherLocationPresetId = 'auto_geo',
  customCityLabel?: string,
  manualOverrideCity?: string
): HighwayWeatherReport {
  const preset =
    WEATHER_LOCATION_PRESETS.find((p) => p.id === presetId) || WEATHER_LOCATION_PRESETS[1];
  const now = new Date();
  const baseCodes = [2, 80, 1, 80, 2, 95, 1];
  const baseMax = [33, 31, 34, 30, 32, 29, 33];
  const baseMin = [24, 23, 24, 23, 24, 22, 24];
  const baseRain = [25, 70, 15, 65, 30, 85, 20];

  const daily: DailyForecastItem[] = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(now);
    d.setDate(now.getDate() + idx);
    const weekdayShort = d
      .toLocaleDateString('pt-BR', { weekday: 'short' })
      .replace('.', '')
      .replace(/^\w/, (c) => c.toUpperCase());
    const dayMonth = d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
    const code = baseCodes[idx % baseCodes.length];
    const meta = mapWmoCodeToMeta(code);

    return {
      dateIso: d.toISOString().slice(0, 10),
      weekdayShort: idx === 0 ? 'Hoje' : weekdayShort,
      dayMonth,
      tempMax: baseMax[idx % baseMax.length],
      tempMin: baseMin[idx % baseMin.length],
      rainProbability: baseRain[idx % baseRain.length],
      weatherCode: code,
      conditionLabel: meta.label,
      iconClass: meta.iconClass,
      accentColor: meta.accentColor
    };
  });

  const currentMeta = mapWmoCodeToMeta(2);
  const resolvedLabel =
    (manualOverrideCity && manualOverrideCity.trim()) ||
    (customCityLabel && customCityLabel.trim()) ||
    preset.shortCity ||
    'Manaus / BR-319 (AM)';

  return {
    locationLabel: resolvedLabel,
    highwayTag: preset.highwayTag,
    sourceType: manualOverrideCity && manualOverrideCity.trim() ? 'manual' : 'ip',
    currentTemp: 31,
    humidity: 74,
    windSpeedKmh: 14,
    weatherCode: 2,
    conditionLabel: currentMeta.label,
    iconClass: currentMeta.iconClass,
    accentColor: currentMeta.accentColor,
    fieldAlert: currentMeta.fieldAlert,
    updatedAt: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    daily
  };
}

function getBrowserPosition(timeoutMs = 3500): Promise<GeolocationPosition | null> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(pos);
        }
      },
      () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(null);
        }
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 15 * 60 * 1000 }
    );
  });
}

async function resolveCoordinates(
  presetId: WeatherLocationPresetId,
  customCityLabel?: string,
  manualOverrideCity?: string
): Promise<{
  lat: number;
  lon: number;
  label: string;
  highwayTag: string;
  sourceType: 'gps' | 'ip' | 'manual';
}> {
  // 1. Check if Manual Override City is filled in the Admin Panel
  const trimmedManual = (manualOverrideCity || '').trim();
  if (trimmedManual.length > 0) {
    // Check known regional presets first for instant match
    const normalizedSearch = trimmedManual.toLowerCase();
    const knownMatch = QUICK_OVERRIDE_CITIES.find(
      (c) =>
        c.name.toLowerCase() === normalizedSearch ||
        normalizedSearch.includes(c.name.toLowerCase())
    );
    if (knownMatch) {
      return {
        lat: knownMatch.lat,
        lon: knownMatch.lon,
        label: knownMatch.label,
        highwayTag: `Override Manual • ${knownMatch.name}`,
        sourceType: 'manual'
      };
    }

    // Otherwise geocode any city name via Open-Meteo Geocoding API
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmedManual
        )}&count=1&language=pt&format=json`
      );
      if (geoRes.ok) {
        const geoJson = await geoRes.json();
        const first = geoJson?.results?.[0];
        if (first && typeof first.latitude === 'number' && typeof first.longitude === 'number') {
          const stateCode = first.admin1 ? ` (${first.admin1})` : '';
          return {
            lat: first.latitude,
            lon: first.longitude,
            label: `${first.name}${stateCode}`,
            highwayTag: `Localidade Manual • ${first.name}`,
            sourceType: 'manual'
          };
        }
      }
    } catch {
      // Fallback below
    }
  }

  const preset =
    WEATHER_LOCATION_PRESETS.find((p) => p.id === presetId) || WEATHER_LOCATION_PRESETS[1];

  // 2. If presetId is 'auto_geo', attempt Browser Geolocation API first, then IP Geolocation
  if (presetId === 'auto_geo') {
    const gpsPos = await getBrowserPosition(3200);
    if (gpsPos && gpsPos.coords) {
      const lat = gpsPos.coords.latitude;
      const lon = gpsPos.coords.longitude;
      let detectedName = 'Localização GPS Atual';
      try {
        const revRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`
        );
        if (revRes.ok) {
          const revData = await revRes.json();
          const city = revData.city || revData.locality || revData.principalSubdivision;
          const subdiv = revData.principalSubdivisionCode
            ? revData.principalSubdivisionCode.replace('BR-', '')
            : '';
          if (city) {
            detectedName = subdiv ? `${city} (${subdiv})` : city;
          }
        }
      } catch {
        // Ignore reverse geocode error
      }
      return {
        lat,
        lon,
        label: detectedName,
        highwayTag: 'GPS Automático em Tempo Real',
        sourceType: 'gps'
      };
    }

    // Fallback to IP-based geolocation (works automatically on Smart TVs without GPS prompt)
    try {
      const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
      if (res.ok) {
        const data = await res.json();
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          const city = data.city ? `${data.city} (${data.region || 'BR'})` : 'Manaus (AM)';
          return {
            lat,
            lon,
            label: `${city}`,
            highwayTag: 'Geolocalização Automática via IP',
            sourceType: 'ip'
          };
        }
      }
    } catch {
      // Fallback to Manaus coordinates
    }
  }

  return {
    lat: preset.latitude,
    lon: preset.longitude,
    label:
      customCityLabel &&
      customCityLabel.trim() &&
      !customCityLabel.toLowerCase().includes('geolocalização')
        ? customCityLabel.trim()
        : preset.label,
    highwayTag: preset.highwayTag,
    sourceType: 'manual'
  };
}

/**
 * Fetches live current weather + 7-day forecast from Open-Meteo API (free, no key required).
 */
export async function fetchHighwayWeather(
  presetId: WeatherLocationPresetId = 'auto_geo',
  customCityLabel?: string,
  manualOverrideCity?: string
): Promise<HighwayWeatherReport> {
  try {
    const coords = await resolveCoordinates(presetId, customCityLabel, manualOverrideCity);
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=America%2FManaus&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) {
      return buildFallbackWeatherReport(presetId, customCityLabel, manualOverrideCity);
    }

    const json = await response.json();
    const current = json.current || {};
    const dailyRaw = json.daily || {};

    const currentCode = typeof current.weather_code === 'number' ? current.weather_code : 2;
    const currentMeta = mapWmoCodeToMeta(currentCode);

    const times: string[] = Array.isArray(dailyRaw.time) ? dailyRaw.time : [];
    const daily: DailyForecastItem[] = times.slice(0, 7).map((dateStr, idx) => {
      const [yyyy, mm, dd] = dateStr.split('-').map(Number);
      const d = new Date(yyyy, (mm || 1) - 1, dd || 1);
      const weekdayShort = d
        .toLocaleDateString('pt-BR', { weekday: 'short' })
        .replace('.', '')
        .replace(/^\w/, (c) => c.toUpperCase());
      const dayMonth = `${String(dd).padStart(2, '0')}/${String(mm).padStart(2, '0')}`;
      const wCode =
        Array.isArray(dailyRaw.weather_code) && typeof dailyRaw.weather_code[idx] === 'number'
          ? dailyRaw.weather_code[idx]
          : 2;
      const meta = mapWmoCodeToMeta(wCode);

      return {
        dateIso: dateStr,
        weekdayShort: idx === 0 ? 'Hoje' : weekdayShort,
        dayMonth,
        tempMax: Math.round(dailyRaw.temperature_2m_max?.[idx] ?? 32),
        tempMin: Math.round(dailyRaw.temperature_2m_min?.[idx] ?? 24),
        rainProbability: Math.round(dailyRaw.precipitation_probability_max?.[idx] ?? 30),
        weatherCode: wCode,
        conditionLabel: meta.label,
        iconClass: meta.iconClass,
        accentColor: meta.accentColor
      };
    });

    if (daily.length === 0) {
      return buildFallbackWeatherReport(presetId, customCityLabel, manualOverrideCity);
    }

    return {
      locationLabel: coords.label,
      highwayTag: coords.highwayTag,
      sourceType: coords.sourceType,
      currentTemp: Math.round(current.temperature_2m ?? 31),
      humidity: Math.round(current.relative_humidity_2m ?? 74),
      windSpeedKmh: Math.round(current.wind_speed_10m ?? 12),
      weatherCode: currentCode,
      conditionLabel: currentMeta.label,
      iconClass: currentMeta.iconClass,
      accentColor: currentMeta.accentColor,
      fieldAlert: currentMeta.fieldAlert,
      updatedAt: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      daily
    };
  } catch {
    return buildFallbackWeatherReport(presetId, customCityLabel, manualOverrideCity);
  }
}
