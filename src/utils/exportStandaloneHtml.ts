import { SignageConfig } from '../types/signage';
import QRCode from 'qrcode';
import {
  FALLBACK_BOLETIM_COVER,
  normalizeHeyzineUrl,
  resolveBoletimCoverUrl
} from '../data/defaultConfig';

async function imageUrlToDataUrl(url: string): Promise<string> {
  if (!url || url.startsWith('data:')) return url;
  try {
    const response = await fetch(url);
    if (!response.ok) return url;
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : url);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

const OFFICIAL_LOGO_SVG_LIGHT_PLATE = `
<div class="inline-flex items-center justify-center bg-[#F4F5F7] px-3.5 py-1.5 rounded-xl shadow-md border border-white/25 shrink-0">
  <svg viewBox="0 0 860 220" class="h-11 lg:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="52" y="38" fill="#4B0A5E" font-family="'Montserrat', sans-serif" font-weight="800" font-size="37" letter-spacing="3.5">CONSÓRCIO</text>
    <g transform="translate(36, 138) scale(1.17, 1)">
      <text x="0" y="0" fill="#4B0A5E" font-family="'Montserrat', sans-serif" font-weight="800" font-size="118" letter-spacing="1">Matupiri</text>
    </g>
    <rect x="527" y="132" width="25" height="36" fill="#4B0A5E" />
    <rect x="16" y="156" width="828" height="22" rx="11" fill="#4B0A5E" />
    <line x1="42" y1="167" x2="824" y2="167" stroke="#F4F5F7" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="16 20" />
    <text x="430" y="212" text-anchor="middle" fill="#4B0A5E" font-family="'Montserrat', sans-serif" font-weight="700" font-size="31.5" letter-spacing="2.2">MODERA ENGENHARIA • SCB BIM &amp; GIS</text>
  </svg>
</div>`;

const OFFICIAL_LOGO_SVG_XL = `
<div class="inline-flex items-center justify-center bg-[#F4F5F7] px-5 py-2.5 rounded-2xl shadow-xl border border-white/25 shrink-0">
  <svg viewBox="0 0 860 220" class="h-16 lg:h-20 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="52" y="38" fill="#4B0A5E" font-family="'Montserrat', sans-serif" font-weight="800" font-size="37" letter-spacing="3.5">CONSÓRCIO</text>
    <g transform="translate(36, 138) scale(1.17, 1)">
      <text x="0" y="0" fill="#4B0A5E" font-family="'Montserrat', sans-serif" font-weight="800" font-size="118" letter-spacing="1">Matupiri</text>
    </g>
    <rect x="527" y="132" width="25" height="36" fill="#4B0A5E" />
    <rect x="16" y="156" width="828" height="22" rx="11" fill="#4B0A5E" />
    <line x1="42" y1="167" x2="824" y2="167" stroke="#F4F5F7" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="16 20" />
    <text x="430" y="212" text-anchor="middle" fill="#4B0A5E" font-family="'Montserrat', sans-serif" font-weight="700" font-size="31.5" letter-spacing="2.2">MODERA ENGENHARIA • SCB BIM &amp; GIS</text>
  </svg>
</div>`;

const ANIMATED_VINHETA_SVG = `
<div class="w-full max-w-4xl bg-[#F4F5F7] rounded-3xl px-10 py-12 shadow-[0_25px_80px_rgba(138,5,190,0.45)] border-2 border-[#8A05BE]/60">
  <svg viewBox="0 0 860 220" class="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="52" y="38" fill="#680E8A" font-family="'Montserrat', sans-serif" font-weight="700" font-size="36" letter-spacing="3.5">CONSÓRCIO</text>
    <g transform="translate(36, 138) scale(1.17, 1)">
      <text x="0" y="0" fill="#680E8A" font-family="'Montserrat', sans-serif" font-weight="800" font-size="118" letter-spacing="1">Matupiri</text>
    </g>
    <rect x="527" y="132" width="25" height="36" fill="#5A0B73" />
    <rect x="16" y="154" width="828" height="26" rx="13" fill="#680E8A" />
    <line x1="-80" y1="167" x2="920" y2="167" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="16 20" class="animate-highway-dashes" />
    <text x="430" y="213" text-anchor="middle" fill="#5A0B73" font-family="'Montserrat', sans-serif" font-weight="600" font-size="31" letter-spacing="2.2">MODERA ENGENHARIA • SCB BIM &amp; GIS</text>
  </svg>
</div>`;

/**
 * Generates and triggers a download of a complete, self-contained single-file HTML
 * Digital Signage player for Consórcio Matupiri (Modera Engenharia • SCB BIM & GIS).
 */
export async function exportStandaloneHtml(config: SignageConfig): Promise<void> {
  const embeddedPhotos = await Promise.all(
    config.photos.map(async (p) => ({
      ...p,
      url: await imageUrlToDataUrl(p.url)
    }))
  );

  const embeddedTeam = await Promise.all(
    (config.teamMembers || []).map(async (m) => ({
      ...m,
      photoUrl: await imageUrlToDataUrl(m.photoUrl)
    }))
  );

  const embeddedBirthdays = await Promise.all(
    config.birthdays.map(async (b) => ({
      ...b,
      photoUrl: await imageUrlToDataUrl(b.photoUrl)
    }))
  );

  const fallbackCoverDataUrl = await imageUrlToDataUrl(FALLBACK_BOLETIM_COVER);
  const resolvedCover = resolveBoletimCoverUrl(config.boletimUrl, config.boletimCoverUrl);
  const embeddedCoverUrl = await imageUrlToDataUrl(resolvedCover);

  const normalizedBoletim = normalizeHeyzineUrl(config.boletimUrl);
  let initialQrDataUrl = '';
  if (normalizedBoletim) {
    try {
      initialQrDataUrl = await QRCode.toDataURL(normalizedBoletim, {
        width: 360,
        margin: 1,
        color: { dark: '#1E2022', light: '#FFFFFF' }
      });
    } catch {
      initialQrDataUrl = '';
    }
  }

  const portableConfig: SignageConfig = {
    ...config,
    boletimCoverUrl: embeddedCoverUrl,
    photos: embeddedPhotos,
    teamMembers: embeddedTeam,
    birthdays: embeddedBirthdays
  };

  const serializedConfig = JSON.stringify(portableConfig, null, 2).replace(/<\//g, '<\\/');

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Consórcio Matupiri — Sinalização Digital TV Corporativa</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Montserrat:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!-- FontAwesome CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <style>
    :root {
      --font-display: 'Montserrat', 'Plus Jakarta Sans', sans-serif;
      --font-sans: 'Plus Jakarta Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    body {
      font-family: var(--font-sans);
      background-color: #1E2022;
      color: #F4F5F7;
      overflow: hidden;
      user-select: none;
      margin: 0;
    }
    .font-display { font-family: var(--font-display); }
    .font-mono-tabular { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
    @keyframes tickerMove {
      0% { transform: translate3d(0%, 0, 0); }
      100% { transform: translate3d(-50%, 0, 0); }
    }
    .animate-ticker {
      display: flex;
      width: max-content;
      animation: tickerMove 48s linear infinite;
    }
    @keyframes highwayDashMove {
      0% { stroke-dashoffset: 72; }
      100% { stroke-dashoffset: 0; }
    }
    .animate-highway-dashes {
      animation: highwayDashMove 0.65s linear infinite;
    }
    .purple-glow-text {
      text-shadow: 0 0 14px rgba(184, 69, 232, 0.85), 0 0 32px rgba(138, 5, 190, 0.75);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-enter { animation: fadeIn 500ms ease-out forwards; }
  </style>
</head>
<body class="fixed inset-0 h-[100dvh] w-[100dvw] flex flex-col justify-between bg-[#1E2022] text-[#F4F5F7] overflow-hidden">
  <!-- HEADER -->
  <header class="h-16 lg:h-[72px] bg-[#1E2022] border-b border-white/10 px-4 lg:px-7 flex items-center justify-between gap-4 shrink-0 z-20">
    ${OFFICIAL_LOGO_SVG_LIGHT_PLATE}
    <div id="slide-indicator" class="hidden md:flex items-center gap-2 text-xs font-mono-tabular text-[#F4F5F7]/80 bg-[#2D3142] px-4 py-1.5 rounded-xl border border-white/10"></div>
    <div class="flex items-center gap-4">
      <div class="hidden sm:flex items-center gap-2.5 bg-[#2D3142] px-3.5 py-1.5 rounded-xl border border-white/10">
        <i id="weather-icon" class="fa-solid fa-cloud-sun text-[#B845E8]"></i>
        <div>
          <div id="weather-temp" class="text-xs font-bold text-white font-mono-tabular"></div>
          <div id="weather-cond" class="text-[10px] text-[#F4F5F7]/70"></div>
        </div>
      </div>
      <div class="text-right">
        <div id="header-clock" class="font-mono-tabular font-extrabold text-xl lg:text-2xl text-white leading-none">00:00:00</div>
        <div id="header-date" class="text-xs text-[#F4F5F7]/75 capitalize mt-0.5"></div>
      </div>
      <button onclick="toggleFullScreen()" class="w-9 h-9 rounded-xl bg-[#2D3142] hover:bg-[#8A05BE] text-white/80 flex items-center justify-center border border-white/10 transition-colors cursor-pointer" title="Tela Cheia (Tecla F)">
        <i class="fa-solid fa-expand text-xs"></i>
      </button>
      <button onclick="requestAdminAccess()" class="w-9 h-9 rounded-xl bg-[#2D3142] hover:bg-[#8A05BE] text-white/80 flex items-center justify-center border border-white/10 transition-colors cursor-pointer" title="Configurações Protegidas por PIN (Tecla A ou Esc)">
        <i class="fa-solid fa-gear text-xs"></i>
      </button>
    </div>
  </header>

  <!-- PROGRESS BAR -->
  <div class="w-full h-1 bg-[#2D3142] shrink-0">
    <div id="progress-bar" class="h-full bg-[#8A05BE] transition-all duration-500" style="width: 0%"></div>
  </div>

  <!-- MAIN SLIDE AREA -->
  <main id="slide-stage" class="flex-1 w-full min-h-0 relative overflow-hidden"></main>

  <!-- FOOTER TICKER -->
  <footer class="h-10 lg:h-11 bg-gradient-to-r from-[#8A05BE] via-[#7B1FA2] to-[#8A05BE] border-t border-white/20 flex items-center overflow-hidden shrink-0 z-20">
    <div class="h-full px-5 bg-[#1E2022] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 border-r border-white/20">
      <i class="fa-solid fa-road text-[#B845E8]"></i>
      <span>Destaques &amp; Rodovias</span>
    </div>
    <div class="flex-1 overflow-hidden">
      <div id="footer-ticker" class="animate-ticker items-center whitespace-nowrap text-xs lg:text-sm font-semibold text-white"></div>
    </div>
  </footer>

  <!-- PIN 0712 MODAL -->
  <div id="pin-modal" class="hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md items-center justify-center p-6">
    <div class="w-full max-w-md bg-[#1E2022] border-2 border-[#8A05BE] rounded-3xl shadow-2xl overflow-hidden">
      <div class="px-6 py-4 bg-[#2D3142] border-b border-white/10 flex items-center justify-between">
        <div class="font-display font-extrabold text-base text-white flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-[#D178FF]"></i>
          <span>PIN de Segurança — Painel Admin</span>
        </div>
        <button onclick="closePinModal()" class="w-8 h-8 rounded-lg bg-white/10 text-white cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-6 space-y-4 text-center">
        <p class="text-xs text-[#F4F5F7]/80">Digite a senha PIN para acessar o Painel Administrativo:</p>
        <input id="inp-pin-code" type="password" maxlength="4" placeholder="••••" class="w-44 text-center font-mono-tabular font-extrabold text-3xl tracking-[0.5em] py-2.5 px-4 rounded-2xl bg-[#2D3142] border-2 border-[#8A05BE] text-white outline-none" />
        <div id="pin-error" class="hidden text-xs font-bold text-red-400 bg-red-500/15 border border-red-400/40 rounded-xl py-2 px-3">PIN incorreto! Acesso negado.</div>
        <div class="flex justify-end gap-3 pt-2">
          <button onclick="closePinModal()" class="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white cursor-pointer">Cancelar</button>
          <button onclick="verifyPinCode()" class="px-5 py-2 rounded-xl bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white cursor-pointer">Desbloquear</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ADMIN MODAL -->
  <div id="admin-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md items-center justify-center p-6 select-text">
    <div class="w-full max-w-4xl max-h-[88vh] bg-[#1E2022] border-2 border-[#8A05BE] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div class="px-5 py-3.5 bg-[#2D3142] border-b border-white/10 flex items-center justify-between">
        <h2 class="font-display font-bold text-lg text-white">Painel Administrativo — Consórcio Matupiri</h2>
        <button onclick="closeAdminModal()" class="w-8 h-8 rounded-lg bg-white/10 text-white cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-5 overflow-y-auto space-y-4 text-sm">
        <div>
          <label class="block text-xs font-bold uppercase text-[#B845E8] mb-1">URL do Vídeo MP4 da Vinheta</label>
          <input id="inp-vinheta-url" type="text" class="w-full bg-[#2D3142] border border-white/15 rounded-lg px-3.5 py-2 text-white" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-2 bg-[#2D3142] p-3 rounded-lg border border-white/10 cursor-pointer">
            <input id="inp-vinheta-fs" type="checkbox" class="accent-[#8A05BE]" />
            <span class="text-xs font-semibold text-white">Exibir Vinheta em Tela Cheia</span>
          </label>
          <label class="flex items-center gap-2 bg-[#2D3142] p-3 rounded-lg border border-white/10 cursor-pointer">
            <input id="inp-vinheta-bg" type="checkbox" class="accent-[#8A05BE]" />
            <span class="text-xs font-semibold text-white">Usar Vídeo como Fundo Animado (Glassmorphism)</span>
          </label>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-[#B845E8] mb-1">Link do Boletim Mensal (Heyzine)</label>
          <input id="inp-boletim" type="text" class="w-full bg-[#2D3142] border border-white/15 rounded-lg px-3.5 py-2 text-white" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-[#B845E8] mb-1">Configuração Completa (Fotos dos Serviços, Equipe, Aniversariantes e Tempos)</label>
          <textarea id="inp-json" rows="9" class="w-full bg-[#16181A] border border-white/15 rounded-lg p-3 text-xs font-mono-tabular text-[#F4F5F7]"></textarea>
        </div>
      </div>
      <div class="px-5 py-3.5 bg-[#2D3142] border-t border-white/10 flex justify-end gap-3">
        <button onclick="closeAdminModal()" class="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-semibold cursor-pointer">Cancelar</button>
        <button onclick="previewAdminChanges()" class="px-4 py-2 rounded-lg bg-[#1E2022] border-2 border-[#8A05BE] text-[#D178FF] text-xs font-bold cursor-pointer">👁️ Pré-visualizar</button>
        <button onclick="saveAdminChanges()" class="px-5 py-2 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-white text-xs font-bold cursor-pointer">💾 Salvar e Publicar</button>
      </div>
    </div>
  </div>

  <script>
    const STORAGE_KEY = 'consorcio_matupiri_tv_config_v5';
    const REQUIRED_PIN = '0712';
    const INITIAL_QR = ${JSON.stringify(initialQrDataUrl)};
    const FALLBACK_COVER = ${JSON.stringify(fallbackCoverDataUrl)};
    const DEFAULT_CONFIG = ${serializedConfig};

    let config = (function() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    })();

    let currentSlideIdx = 0;
    let currentPhotoIdx = 0;
    let remainingSec = 15;
    let totalSec = 15;

    let liveWeather = {
      temp: config.weatherTemp || 31,
      humidity: 74,
      wind: 14,
      cond: 'Parcialmente Nublado',
      icon: 'fa-solid fa-cloud-sun text-amber-300',
      daily: []
    };

    const COORDS_MAP = {
      manaus_br319: { lat: -3.119, lon: -60.0217, label: 'Manaus / BR-319 (AM)' },
      careiro_br319: { lat: -3.8125, lon: -60.3536, label: 'Careiro Castanho / BR-319 (AM)' },
      humaita_br230: { lat: -7.5061, lon: -63.0208, label: 'Humaitá / BR-230 e BR-319 (AM)' },
      labrea_br230: { lat: -7.2586, lon: -64.7975, label: 'Lábrea / BR-230 (AM)' },
      apui_br230: { lat: -7.1967, lon: -59.8914, label: 'Apuí / BR-230 (AM)' },
      auto_geo: { lat: -3.119, lon: -60.0217, label: 'Manaus / BR-319 (AM)' }
    };

    function mapWmo(code) {
      if (code === 0) return { label: 'Ensolarado', icon: 'fa-solid fa-sun text-amber-400' };
      if (code <= 2) return { label: 'Parc. Nublado', icon: 'fa-solid fa-cloud-sun text-amber-300' };
      if (code <= 48) return { label: 'Nublado', icon: 'fa-solid fa-cloud text-slate-300' };
      if (code >= 95) return { label: 'Tempestade', icon: 'fa-solid fa-cloud-bolt text-purple-300' };
      return { label: 'Pancadas', icon: 'fa-solid fa-cloud-showers-heavy text-sky-400' };
    }

    async function updateLiveWeather() {
      const loc = COORDS_MAP[config.weatherLocationId] || COORDS_MAP.manaus_br319;
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lon +
          '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
          '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FManaus&forecast_days=7'
        );
        if (!res.ok) return;
        const data = await res.json();
        const curMeta = mapWmo(data.current.weather_code);
        liveWeather.temp = Math.round(data.current.temperature_2m);
        liveWeather.humidity = Math.round(data.current.relative_humidity_2m);
        liveWeather.wind = Math.round(data.current.wind_speed_10m);
        liveWeather.cond = curMeta.label;
        liveWeather.icon = curMeta.icon;
        liveWeather.daily = (data.daily.time || []).slice(0, 7).map((t, i) => {
          const parts = t.split('-');
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          const wk = i === 0 ? 'Hoje' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
          const m = mapWmo(data.daily.weather_code[i]);
          return {
            wk: wk,
            dm: parts[2] + '/' + parts[1],
            max: Math.round(data.daily.temperature_2m_max[i]),
            min: Math.round(data.daily.temperature_2m_min[i]),
            rain: Math.round(data.daily.precipitation_probability_max[i] || 20),
            icon: m.icon,
            label: m.label
          };
        });
        renderTicker();
      } catch (e) {}
    }

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    function resolveCover(url, custom) {
      if (custom && custom.trim()) return custom.trim();
      const m = (url || '').match(/heyzine\\.com\\/flip-book\\/([a-zA-Z0-9_-]+)/i);
      if (m && m[1]) return 'https://cdnc.heyzine.com/flip-book/cover/' + m[1] + '.jpg';
      return FALLBACK_COVER;
    }

    function getActiveSlides() {
      const slides = [];
      if (config.vignetteFullscreenEnabled !== false) slides.push('vinheta');
      if (config.boletimUrl && config.boletimUrl.trim()) slides.push('boletim');
      if (config.photos && config.photos.length > 0) slides.push('destaques');
      slides.push('relogio');
      if (config.teamMembers && config.teamMembers.length > 0) slides.push('equipe');
      if (config.birthdays && config.birthdays.length > 0) slides.push('aniversariantes');
      if (config.events && config.events.length > 0) slides.push('comunicados');
      return slides;
    }

    function renderTicker() {
      const items = (config.tickerMessages || []).map(m => '<span class="mx-6">🔹 ' + m + '</span>').join('');
      document.getElementById('footer-ticker').innerHTML = items + items;
      document.getElementById('weather-temp').textContent = liveWeather.temp + '°C · ' + (config.weatherCity || 'Manaus / BR-319');
      document.getElementById('weather-cond').textContent = liveWeather.cond + ' • Umidade ' + liveWeather.humidity + '%';
    }

    function renderSlide() {
      const slides = getActiveSlides();
      if (currentSlideIdx >= slides.length) currentSlideIdx = 0;
      const slide = slides[currentSlideIdx];
      const stage = document.getElementById('slide-stage');
      document.getElementById('slide-indicator').textContent =
        '0' + (currentSlideIdx + 1) + ' / 0' + slides.length + ' · ' + slide.toUpperCase();

      if (slide === 'vinheta') {
        totalSec = (config.durations && config.durations.vinheta) || 9;
        remainingSec = totalSec;
        const hasVid = config.vignetteVideoUrl && config.vignetteVideoUrl.trim();
        stage.innerHTML = \`
          <div id="vinheta-root" class="w-full h-full min-h-0 flex flex-col justify-between items-center p-6 fade-enter overflow-hidden transition-opacity duration-500">
            <div id="vinheta-zoom-stage" class="flex-1 w-full flex items-center justify-center transition-transform duration-[1800ms]" style="transform-origin: 50% 60%;">
              \${hasVid ? '<video src="' + config.vignetteVideoUrl + '" autoplay muted playsinline class="max-h-[72vh] w-auto object-contain"></video>' : \`${ANIMATED_VINHETA_SVG}\`}
            </div>
            <div class="pb-4 text-center">
              <div class="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-[#1E2022]/90 border border-[#8A05BE]/60">
                <p class="font-display font-extrabold text-3xl text-white purple-glow-text">Trafegue conosco ⮕</p>
              </div>
            </div>
          </div>\`;
      } else if (slide === 'boletim') {
        totalSec = (config.durations && config.durations.boletim) || 18;
        remainingSec = totalSec;
        const coverSrc = resolveCover(config.boletimUrl, config.boletimCoverUrl);
        const mes = config.boletimMonth || 'Outubro';
        stage.innerHTML = \`
          <div class="w-full h-full min-h-0 grid grid-cols-12 gap-8 p-6 items-center fade-enter overflow-hidden">
            <div class="col-span-7 h-full min-h-0 flex items-center justify-center overflow-hidden">
              <div class="relative h-full max-h-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#8A05BE] shadow-[0_15px_55px_rgba(138,5,190,0.45)] bg-[#2D3142]">
                <img src="\${coverSrc}" onerror="this.src='\${FALLBACK_COVER}'" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="col-span-5 flex flex-col items-center text-center bg-[#2D3142] rounded-3xl border-2 border-[#8A05BE] p-8 shadow-2xl">
              <h2 class="font-display font-extrabold text-3xl text-white mb-3">Acesse na íntegra o Boletim Mensal de <span class="text-[#D178FF]">\${mes}</span></h2>
              <p class="text-sm text-[#F4F5F7]/85 mb-6">Aponte a câmera do seu celular e fique por dentro das novidades do Consórcio Matupiri.</p>
              \${INITIAL_QR ? '<div class="bg-white p-4 rounded-2xl border-4 border-[#8A05BE] shadow-xl"><img src="' + INITIAL_QR + '" class="w-52 h-52 object-contain" /></div>' : ''}
            </div>
          </div>\`;
      } else if (slide === 'destaques') {
        totalSec = config.durations.destaquesPerPhoto || 12;
        remainingSec = totalSec;
        const p = config.photos[currentPhotoIdx] || config.photos[0];
        const pageStr = p.boletimPage ? (/^p[áa]g/i.test(p.boletimPage) ? p.boletimPage : 'Pág. ' + String(p.boletimPage).padStart(2, '0')) : '';
        stage.innerHTML = \`
          <div class="w-full h-full min-h-0 p-5 flex flex-col justify-between gap-4 fade-enter overflow-hidden">
            <div class="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <div class="font-display font-extrabold text-xl text-white">Mural de Serviços do Boletim • Frentes de Serviço e Destaques</div>
              <div class="px-3 py-1 rounded-xl bg-[#2D3142] border border-white/10 text-xs font-bold text-[#D178FF]">Destaque \${currentPhotoIdx + 1} de \${config.photos.length}</div>
            </div>
            <div class="flex-1 min-h-0 grid grid-cols-12 gap-6 items-stretch overflow-hidden">
              <div class="col-span-7 relative rounded-2xl overflow-hidden border-2 border-[#8A05BE]/70 bg-[#2D3142]">
                <img src="\${p.url}" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#1E2022] via-transparent to-black/25"></div>
                <div class="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-[#8A05BE] text-white font-display font-extrabold text-xs uppercase tracking-wider">🔹 \${p.highway || 'DESTAQUE'}</div>
              </div>
              <div class="col-span-5 bg-[#2D3142] rounded-2xl border-2 border-[#8A05BE] p-6 flex flex-col justify-between shadow-2xl">
                <div class="space-y-4">
                  <span class="inline-block px-3.5 py-1.5 rounded-lg bg-[#8A05BE] text-white font-display font-extrabold text-xs uppercase tracking-wider">🔹 \${p.highway || 'FRENTE DE SERVIÇO'}</span>
                  <h2 class="font-display font-extrabold text-2xl lg:text-3xl text-white leading-snug">\${p.title}</h2>
                  <div class="w-16 h-1 rounded-full bg-[#8A05BE]"></div>
                  <p class="text-sm lg:text-base text-[#F4F5F7]/90 leading-relaxed">\${p.description}</p>
                </div>
                <div class="pt-4 border-t border-white/15 flex items-center justify-between">
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E2022] border-2 border-[#8A05BE] font-display font-bold text-xs text-white">
                    📖 \${pageStr ? 'Confira no Boletim - ' + pageStr : 'Confira no Boletim Mensal'}
                  </div>
                  <span class="text-xs text-[#F4F5F7]/70 font-mono-tabular">Destaque \${currentPhotoIdx + 1} de \${config.photos.length}</span>
                </div>
              </div>
            </div>
          </div>\`;
      } else if (slide === 'equipe') {
        totalSec = (config.durations && config.durations.equipe) || 15;
        remainingSec = totalSec;
        const members = config.teamMembers || [];
        stage.innerHTML = \`
          <div class="w-full h-full min-h-0 flex flex-col justify-between p-5 fade-enter overflow-hidden">
            <h2 class="font-display font-extrabold text-2xl text-white shrink-0 mb-3">Conheça a Equipe do Mês — Consórcio Matupiri</h2>
            <div class="flex-1 min-h-0 grid grid-cols-\${Math.min(3, members.length)} gap-6 items-stretch overflow-hidden">
              \${members.slice(0, 3).map(m => \`
                <div class="bg-[#2D3142] rounded-2xl border-2 border-[#8A05BE] overflow-hidden grid grid-cols-12 items-stretch shadow-2xl">
                  <div class="col-span-5 relative bg-[#16181A]">
                    <img src="\${m.photoUrl}" class="w-full h-full object-cover object-top" />
                  </div>
                  <div class="col-span-7 p-5 flex flex-col justify-between">
                    <div class="space-y-2">
                      <span class="inline-block px-2.5 py-1 rounded bg-[#8A05BE] text-white text-[10px] font-bold uppercase">🔹 \${m.highway}</span>
                      <h3 class="font-display font-extrabold text-2xl text-white">\${m.name}</h3>
                      <div class="text-sm font-bold text-[#D178FF]">\${m.role}</div>
                      <p class="text-xs text-[#F4F5F7]/90 italic bg-[#1E2022] p-3 rounded-xl border-l-4 border-[#8A05BE]">“\${m.recognitionMessage}”</p>
                    </div>
                    <div class="text-[11px] text-[#F4F5F7]/65">\${m.unit}</div>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>\`;
      } else if (slide === 'aniversariantes') {
        totalSec = config.durations.aniversariantes || 15;
        remainingSec = totalSec;
        const bdays = config.birthdays || [];
        if (bdays.length === 1) {
          const b = bdays[0];
          stage.innerHTML = \`
            <div class="w-full h-full min-h-0 flex items-center justify-center p-6 fade-enter overflow-hidden">
              <div class="max-w-4xl w-full bg-[#2D3142] rounded-3xl border-2 border-[#8A05BE] p-8 grid grid-cols-12 gap-8 items-center shadow-2xl">
                <div class="col-span-5">
                  <img src="\${b.photoUrl}" class="w-full aspect-[3/4] object-cover object-top rounded-2xl border-2 border-[#8A05BE]" />
                </div>
                <div class="col-span-7 space-y-3">
                  <div class="text-xs font-bold uppercase text-[#D178FF]">Aniversariante do Mês · \${b.day}</div>
                  <h2 class="font-display font-extrabold text-4xl text-white">\${b.name}</h2>
                  <div class="text-lg font-semibold text-[#D178FF]">\${b.role}</div>
                  <p class="text-sm text-[#F4F5F7]/85 italic pt-3 border-t border-white/15">“O Consórcio Matupiri parabeniza você por mais um ano de vida! Desejamos muita saúde, conquistas e sucesso!”</p>
                </div>
              </div>
            </div>\`;
        } else {
          stage.innerHTML = \`
            <div class="w-full h-full min-h-0 flex flex-col justify-between p-6 fade-enter overflow-hidden">
              <h2 class="font-display font-extrabold text-2xl text-white shrink-0 mb-3">Aniversariantes do Mês — Consórcio Matupiri</h2>
              <div class="flex-1 min-h-0 grid grid-cols-\${Math.min(4, bdays.length)} gap-6 items-stretch overflow-hidden">
                \${bdays.slice(0,4).map(b => \`
                  <div class="bg-[#2D3142] rounded-2xl border-2 border-[#8A05BE]/70 overflow-hidden flex flex-col justify-between">
                    <div class="relative flex-1 min-h-0 overflow-hidden bg-[#16181A]">
                      <img src="\${b.photoUrl}" class="w-full h-full object-cover object-top" />
                      <div class="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#8A05BE] text-white font-mono-tabular font-extrabold text-sm">\${b.day}</div>
                    </div>
                    <div class="bg-[#1E2022] border-t-2 border-[#8A05BE] p-4 text-center shrink-0">
                      <div class="font-display font-extrabold text-lg text-white truncate">\${b.name}</div>
                      <div class="text-xs font-semibold text-[#D178FF] truncate">\${b.role}</div>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>\`;
        }
      } else if (slide === 'comunicados') {
        totalSec = config.durations.comunicados || 15;
        remainingSec = totalSec;
        stage.innerHTML = \`
          <div class="w-full h-full min-h-0 p-4 flex flex-col justify-between gap-3 fade-enter overflow-hidden">
            <h2 class="font-display font-extrabold text-2xl text-white shrink-0">Datas Importantes e Comunicados</h2>
            <div class="flex-1 min-h-0 grid grid-cols-2 gap-4 content-stretch overflow-hidden">
              \${config.events.slice(0,4).map(e => \`
                <div class="bg-[#2D3142]/85 backdrop-blur-md rounded-2xl p-4 border \${e.highlight ? 'border-2 border-[#8A05BE]' : 'border-white/10'} flex flex-col justify-between">
                  <div>
                    <div class="text-xs font-bold text-[#D178FF] mb-1">\${e.category} · \${e.date}</div>
                    <h3 class="font-display font-bold text-lg text-white mb-1">\${e.title}</h3>
                    <p class="text-xs text-[#F4F5F7]/80">\${e.description}</p>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>\`;
      } else {
        totalSec = config.durations.relogio || 15;
        remainingSec = totalSec;
        const dailyCards = (liveWeather.daily.length ? liveWeather.daily : [
          { wk: 'Hoje', dm: '10/10', max: 32, min: 24, rain: 30, icon: 'fa-solid fa-cloud-sun text-amber-300' },
          { wk: 'Dom', dm: '11/10', max: 31, min: 23, rain: 65, icon: 'fa-solid fa-cloud-showers-heavy text-sky-400' },
          { wk: 'Seg', dm: '12/10', max: 33, min: 24, rain: 20, icon: 'fa-solid fa-sun text-amber-400' },
          { wk: 'Ter', dm: '13/10', max: 30, min: 23, rain: 70, icon: 'fa-solid fa-cloud-showers-heavy text-sky-400' },
          { wk: 'Qua', dm: '14/10', max: 32, min: 24, rain: 35, icon: 'fa-solid fa-cloud-sun text-amber-300' },
          { wk: 'Qui', dm: '15/10', max: 29, min: 22, rain: 80, icon: 'fa-solid fa-cloud-bolt text-purple-300' },
          { wk: 'Sex', dm: '16/10', max: 33, min: 24, rain: 25, icon: 'fa-solid fa-sun text-amber-400' }
        ]).map(d => \`
          <div class="bg-[#1E2022] rounded-xl p-2.5 border border-white/10 flex flex-col justify-between items-center text-center">
            <div class="font-display font-bold text-xs text-white uppercase">\${d.wk} <span class="block text-[10px] text-white/60">\${d.dm}</span></div>
            <i class="\${d.icon} text-xl my-2"></i>
            <div class="font-mono-tabular text-xs font-bold text-white">\${d.max}° <span class="text-white/50">\${d.min}°</span></div>
            <div class="text-[10px] text-sky-300 font-mono-tabular">💧 \${d.rain}%</div>
          </div>
        \`).join('');

        stage.innerHTML = \`
          <div class="w-full h-full min-h-0 grid grid-cols-12 gap-6 p-5 items-stretch fade-enter overflow-hidden">
            <div class="col-span-5 bg-[#2D3142] rounded-3xl border-2 border-[#8A05BE] p-6 flex flex-col justify-between items-center text-center shadow-2xl">
              ${OFFICIAL_LOGO_SVG_XL}
              <div class="w-full py-4 px-5 rounded-2xl bg-[#1E2022] border border-white/10">
                <div id="big-clock" class="font-mono-tabular font-extrabold text-5xl lg:text-6xl text-white"></div>
                <div id="big-date" class="text-sm text-[#D178FF] capitalize mt-2 font-semibold"></div>
              </div>
              <div class="w-full bg-[#1E2022] rounded-2xl p-4 border-l-4 border-[#8A05BE] text-left">
                <div class="text-[10px] font-bold uppercase text-[#D178FF]">Diretriz Corporativa</div>
                <p class="font-display font-bold text-sm text-white mt-0.5">“\${config.motivationalQuote || 'Segurança e Qualidade na Infraestrutura Rodoviária'}”</p>
              </div>
            </div>
            <div class="col-span-7 bg-[#2D3142] rounded-3xl border border-white/15 p-6 flex flex-col justify-between gap-4 shadow-2xl">
              <div class="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div class="text-xs font-bold uppercase text-[#D178FF]">Previsão do Tempo Semanal das Rodovias • Open-Meteo</div>
                  <h2 class="font-display font-extrabold text-2xl text-white">\${config.weatherCity || 'Manaus / BR-319 (AM)'}</h2>
                </div>
                <div class="font-mono-tabular font-extrabold text-4xl text-white">\${liveWeather.temp}°C</div>
              </div>
              <div class="grid grid-cols-3 gap-3 bg-[#1E2022] p-4 rounded-2xl border border-[#8A05BE]/50">
                <div><div class="text-[10px] text-white/60 uppercase">Condição</div><div class="text-sm font-bold text-[#D178FF]">\${liveWeather.cond}</div></div>
                <div><div class="text-[10px] text-white/60 uppercase">Umidade do Ar</div><div class="text-sm font-bold text-white">\${liveWeather.humidity}%</div></div>
                <div><div class="text-[10px] text-white/60 uppercase">Vento</div><div class="text-sm font-bold text-white">\${liveWeather.wind} km/h</div></div>
              </div>
              <div class="flex-1 min-h-0 grid grid-cols-7 gap-2 items-stretch">\${dailyCards}</div>
            </div>
          </div>\`;
      }
    }

    function tick() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR');
      const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
      document.getElementById('header-clock').textContent = timeStr;
      document.getElementById('header-date').textContent = dateStr;
      const bigClock = document.getElementById('big-clock');
      if (bigClock) bigClock.textContent = timeStr;
      const bigDate = document.getElementById('big-date');
      if (bigDate) bigDate.textContent = dateStr;

      const pinOpen = !document.getElementById('pin-modal').classList.contains('hidden');
      const adminOpen = !document.getElementById('admin-modal').classList.contains('hidden');
      if (pinOpen || adminOpen) return;

      remainingSec -= 1;
      const pct = totalSec > 0 ? ((totalSec - remainingSec) / totalSec) * 100 : 100;
      document.getElementById('progress-bar').style.width = Math.min(100, Math.max(0, pct)) + '%';

      const slides = getActiveSlides();
      const currentSlide = slides[currentSlideIdx];

      if (currentSlide === 'vinheta' && remainingSec <= 2) {
        const z = document.getElementById('vinheta-zoom-stage');
        if (z) z.style.transform = 'scale(7) translateY(-2%)';
        if (remainingSec === 1) {
          setTimeout(() => {
            const r = document.getElementById('vinheta-root');
            if (r) r.style.opacity = '0';
          }, 350);
        }
      }

      if (remainingSec <= 0) {
        if (currentSlide === 'destaques' && currentPhotoIdx + 1 < config.photos.length) {
          currentPhotoIdx += 1;
          renderSlide();
        } else {
          currentPhotoIdx = 0;
          currentSlideIdx = (currentSlideIdx + 1) % slides.length;
          renderSlide();
        }
      }
    }

    function requestAdminAccess() {
      const adminEl = document.getElementById('admin-modal');
      if (!adminEl.classList.contains('hidden')) {
        closeAdminModal();
        return;
      }
      const pinModal = document.getElementById('pin-modal');
      document.getElementById('inp-pin-code').value = '';
      document.getElementById('pin-error').classList.add('hidden');
      pinModal.classList.remove('hidden');
      pinModal.classList.add('flex');
      setTimeout(() => document.getElementById('inp-pin-code').focus(), 50);
    }

    function closePinModal() {
      const pinModal = document.getElementById('pin-modal');
      pinModal.classList.add('hidden');
      pinModal.classList.remove('flex');
    }

    function verifyPinCode() {
      const val = document.getElementById('inp-pin-code').value.trim();
      if (val === REQUIRED_PIN) {
        closePinModal();
        openAdminModal();
      } else {
        document.getElementById('pin-error').classList.remove('hidden');
        document.getElementById('inp-pin-code').value = '';
        document.getElementById('inp-pin-code').focus();
      }
    }

    function openAdminModal() {
      const m = document.getElementById('admin-modal');
      document.getElementById('inp-vinheta-url').value = config.vignetteVideoUrl || '';
      document.getElementById('inp-vinheta-fs').checked = config.vignetteFullscreenEnabled !== false;
      document.getElementById('inp-vinheta-bg').checked = config.vignetteAsBackground !== false;
      document.getElementById('inp-boletim').value = config.boletimUrl || '';
      document.getElementById('inp-json').value = JSON.stringify(config, null, 2);
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeAdminModal() {
      const m = document.getElementById('admin-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function applyFormToConfig(saveToStorage) {
      try {
        const parsed = JSON.parse(document.getElementById('inp-json').value);
        parsed.vignetteVideoUrl = document.getElementById('inp-vinheta-url').value.trim();
        parsed.vignetteFullscreenEnabled = document.getElementById('inp-vinheta-fs').checked;
        parsed.vignetteAsBackground = document.getElementById('inp-vinheta-bg').checked;
        parsed.boletimUrl = document.getElementById('inp-boletim').value.trim();
        config = parsed;
        if (saveToStorage) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        }
        currentSlideIdx = 0;
        currentPhotoIdx = 0;
        renderTicker();
        renderSlide();
        closeAdminModal();
      } catch (err) {
        console.error(err);
      }
    }

    function previewAdminChanges() {
      applyFormToConfig(false);
    }

    function saveAdminChanges() {
      applyFormToConfig(true);
    }

    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        if (e.key === 'Enter' && e.target.id === 'inp-pin-code') {
          verifyPinCode();
        }
        return;
      }
      if (e.key === 'a' || e.key === 'A' || e.key === 'Escape') {
        requestAdminAccess();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
      }
    });

    renderTicker();
    renderSlide();
    updateLiveWeather();
    setInterval(tick, 1000);
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'consorcio-matupiri-sinalizacao-digital-tv.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
