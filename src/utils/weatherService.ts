import { WeatherLocationPresetId } from '../types/signage';

export interface WeatherLocationPreset {
  id: WeatherLocationPresetId;
  label: string;
  highwayTag: string;
  latitude: number;
  longitude: number;
}

export const WEATHER_LOCATION_PRESETS: WeatherLocationPreset[] = [
  {
    id: 'manaus_br319',
    label: 'Manaus / BR-319 (AM)',
    highwayTag: 'BR-319/AM · Km 0 ao Km 198',
    latitude: -3.119,
    longitude: -60.0217
  },
  {
    id: 'careiro_br319',
    label: 'Careiro Castanho / BR-319 (AM)',
    highwayTag: 'BR-319/AM · Trecho do Meio',
    latitude: -3.8125,
    longitude: -60.3536
  },
  {
    id: 'humaita_br230',
    label: 'Humaitá / BR-230 e BR-319 (AM)',
    highwayTag: 'Entroncamento BR-319/AM · BR-230/AM',
    latitude: -7.5061,
    longitude: -63.0208
  },
  {
    id: 'labrea_br230',
    label: 'Lábrea / BR-230 Transamazônica (AM)',
    highwayTag: 'BR-230/AM · Subtrecho Lábrea',
    latitude: -7.2586,
    longitude: -64.7975
  },
  {
    id: 'apui_br230',
    label: 'Apuí / BR-230 Transamazônica (AM)',
    highwayTag: 'BR-230/AM · Frente Leste',
    latitude: -7.1967,
    longitude: -59.8914
  },
  {
    id: 'auto_geo',
    label: 'Geolocalização Automática (GPS / IP)',
    highwayTag: 'Localização Dinâmica da Unidade',
    latitude: -3.119,
    longitude: -60.0217
  }
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
  currentTemp: number;
  humidity: number;
  windSpeedKmh: number;
  weatherCode: number;
  conditionLabel: string;
  iconClass: string;
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
      label: 'Céu Limpo / Sol',
      iconClass: 'fa-solid fa-sun text-amber-400',
      accentColor: '#FBBF24',
      fieldAlert: 'Condição favorável para pavimentação CBUQ e topografia'
    };
  }
  if (code === 1 || code === 2) {
    return {
      label: 'Parcialmente Nublado',
      iconClass: 'fa-solid fa-cloud-sun text-amber-300',
      accentColor: '#FCD34D',
      fieldAlert: 'Condição operacional normal para frentes de terraplenagem e OAE'
    };
  }
  if (code === 3 || code === 45 || code === 48) {
    return {
      label: 'Nublado / Úmido',
      iconClass: 'fa-solid fa-cloud text-slate-300',
      accentColor: '#CBD5E1',
      fieldAlert: 'Atenção ao controle de umidade de solo em praças de aterro'
    };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: 'Pancadas de Chuva',
      iconClass: 'fa-solid fa-cloud-showers-heavy text-sky-400',
      accentColor: '#38BDF8',
      fieldAlert: 'Monitorar drenagem superficial, taludes e tráfego 4x4 no trecho'
    };
  }
  if (code >= 95) {
    return {
      label: 'Tempestade / Trovoadas',
      iconClass: 'fa-solid fa-cloud-bolt text-purple-300',
      accentColor: '#D178FF',
      fieldAlert: 'Alerta QSMS: Suspender atividades em estruturas elevadas e VANT/Drone'
    };
  }
  return {
    label: 'Instável / Chuva Isolada',
    iconClass: 'fa-solid fa-cloud-sun-rain text-sky-300',
    accentColor: '#7DD3FC',
    fieldAlert: 'Acompanhamento preventivo das condições de trafegabilidade'
  };
}

export function buildFallbackWeatherReport(
  presetId: WeatherLocationPresetId = 'manaus_br319',
  customCityLabel?: string
): HighwayWeatherReport {
  const preset =
    WEATHER_LOCATION_PRESETS.find((p) => p.id === presetId) || WEATHER_LOCATION_PRESETS[0];
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

  return {
    locationLabel: customCityLabel || preset.label,
    highwayTag: preset.highwayTag,
    currentTemp: 31,
    humidity: 74,
    windSpeedKmh: 14,
    weatherCode: 2,
    conditionLabel: currentMeta.label,
    iconClass: currentMeta.iconClass,
    fieldAlert: currentMeta.fieldAlert,
    updatedAt: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    daily
  };
}

async function resolveCoordinates(
  presetId: WeatherLocationPresetId,
  customCityLabel?: string
): Promise<{ lat: number; lon: number; label: string; highwayTag: string }> {
  const preset =
    WEATHER_LOCATION_PRESETS.find((p) => p.id === presetId) || WEATHER_LOCATION_PRESETS[0];

  if (presetId === 'auto_geo') {
    // Try IP-based geolocation first (non-blocking, works on Smart TVs without permission prompts)
    try {
      const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
      if (res.ok) {
        const data = await res.json();
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          const city = data.city ? `${data.city} (${data.region || 'BR'})` : preset.label;
          return {
            lat,
            lon,
            label: `${city} · BR-319/230`,
            highwayTag: 'Geolocalização Automática da Unidade'
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
    label: customCityLabel && customCityLabel.trim() ? customCityLabel.trim() : preset.label,
    highwayTag: preset.highwayTag
  };
}

/**
 * Fetches live current weather + 7-day forecast from Open-Meteo API (free, no key required).
 */
export async function fetchHighwayWeather(
  presetId: WeatherLocationPresetId = 'manaus_br319',
  customCityLabel?: string
): Promise<HighwayWeatherReport> {
  try {
    const coords = await resolveCoordinates(presetId, customCityLabel);
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=America%2FManaus&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) {
      return buildFallbackWeatherReport(presetId, customCityLabel);
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
      return buildFallbackWeatherReport(presetId, customCityLabel);
    }

    return {
      locationLabel: coords.label,
      highwayTag: coords.highwayTag,
      currentTemp: Math.round(current.temperature_2m ?? 31),
      humidity: Math.round(current.relative_humidity_2m ?? 74),
      windSpeedKmh: Math.round(current.wind_speed_10m ?? 12),
      weatherCode: currentCode,
      conditionLabel: currentMeta.label,
      iconClass: currentMeta.iconClass,
      fieldAlert: currentMeta.fieldAlert,
      updatedAt: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      daily
    };
  } catch {
    return buildFallbackWeatherReport(presetId, customCityLabel);
  }
}
