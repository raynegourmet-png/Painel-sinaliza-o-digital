import React from 'react';
import { SignageConfig } from '../../types/signage';
import { MatupiriLogo } from '../MatupiriLogo';
import { HighwayWeatherReport } from '../../utils/weatherService';

interface Slide5RelogioInstitucionalProps {
  config: SignageConfig;
  currentTime: Date;
  weatherReport: HighwayWeatherReport;
}

export const Slide5RelogioInstitucional: React.FC<Slide5RelogioInstitucionalProps> = ({
  config,
  currentTime,
  weatherReport
}) => {
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');
  const secondsProgress = (currentTime.getSeconds() / 60) * 100;

  const fullDateFormatted = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const useGlassBackground = config.vignetteAsBackground !== false;
  const hasVideoBg = Boolean(
    useGlassBackground && config.vignetteVideoUrl && config.vignetteVideoUrl.trim().length > 0
  );

  return (
    <div className="w-full h-full min-h-0 relative flex items-center justify-center p-4 lg:p-6 bg-[#1E2022] overflow-hidden slide-transition-enter">
      {/* Optional Dynamic Video Background + Glassmorphism Layer */}
      {hasVideoBg && (
        <video
          src={config.vignetteVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: useGlassBackground ? 'blur(10px)' : 'none',
          background:
            'radial-gradient(circle at 22% 35%, rgba(138, 5, 190, 0.24) 0%, transparent 55%), radial-gradient(circle at 80% 65%, rgba(45, 49, 66, 0.75) 0%, rgba(30, 32, 34, 0.96) 70%)'
        }}
      />

      {/* ESTRUTURA DIVIDIDA: LADO ESQUERDO (RELÓGIO & IDENTIDADE) | LADO DIREITO (PREVISÃO DO TEMPO SEMANAL DAS RODOVIAS) */}
      <div className="relative z-10 w-full h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch overflow-hidden">
        {/* LADO ESQUERDO (5 COLUNAS): RELÓGIO DIGITAL ESTILIZADO, LOGO EM GRANDE ESCALA E MENSAGEM CORPORATIVA */}
        <div className="lg:col-span-5 h-full min-h-0 bg-[#2D3142]/90 backdrop-blur-md rounded-3xl border-2 border-[#8A05BE] p-5 lg:p-7 shadow-[0_20px_60px_rgba(138,5,190,0.3)] flex flex-col justify-between items-center text-center overflow-hidden">
          {/* Top: Official Consórcio Matupiri Logo in Large Scale */}
          <div className="w-full flex flex-col items-center shrink-0">
            <MatupiriLogo
              size="lg"
              variant={config.logoVariant || 'light-badge'}
              customLogoUrl={config.customLogoUrl}
            />
            <span className="mt-2.5 text-[11px] font-bold uppercase tracking-widest text-[#D178FF]">
              Horário Oficial • Operações Rodoviárias
            </span>
          </div>

          {/* Center: Stylized Digital Clock (HH:MM:SS) with Purple Seconds Indicator & Full Date */}
          <div className="w-full my-auto py-3 px-4 rounded-2xl bg-[#1E2022]/90 border border-white/10 shadow-inner flex flex-col items-center">
            <div className="flex items-baseline justify-center gap-1.5 lg:gap-2 font-mono-tabular leading-none">
              <span className="font-extrabold text-5xl sm:text-6xl xl:text-7xl text-white tracking-tight">
                {hours}:{minutes}
              </span>
              <span className="font-extrabold text-3xl sm:text-4xl xl:text-5xl text-[#D178FF] bg-[#8A05BE]/25 border border-[#8A05BE] px-2.5 py-1 rounded-xl shadow-[0_0_20px_rgba(138,5,190,0.45)]">
                :{seconds}
              </span>
            </div>

            {/* Purple Seconds Progress Bar */}
            <div className="w-full max-w-xs h-1.5 bg-[#2D3142] rounded-full overflow-hidden mt-3.5">
              <div
                className="h-full bg-gradient-to-r from-[#8A05BE] to-[#D178FF] transition-all duration-300"
                style={{ width: `${secondsProgress}%` }}
              />
            </div>

            {/* Full Date in Portuguese */}
            <div className="mt-3 text-sm lg:text-base font-semibold text-[#F4F5F7] capitalize">
              {fullDateFormatted}
            </div>
          </div>

          {/* Bottom: Corporate Safety & Quality Message */}
          <div className="w-full bg-gradient-to-r from-[#1E2022] via-[#251A30] to-[#1E2022] rounded-2xl p-4 border-l-4 border-[#8A05BE] text-left shrink-0">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#D178FF] mb-1">
              <i className="fa-solid fa-shield-halved" />
              <span>Diretriz Corporativa de Campo</span>
            </div>
            <p className="font-display font-bold text-sm lg:text-base text-white leading-snug">
              “{config.motivationalQuote || 'Segurança e Qualidade na Infraestrutura Rodoviária'}”
            </p>
            <div className="text-[11px] text-[#F4F5F7]/70 mt-1">
              {config.motivationalAuthor || 'MODERA ENGENHARIA • SCB BIM & GIS'}
            </div>
          </div>
        </div>

        {/* LADO DIREITO (7 COLUNAS): PREVISÃO DO TEMPO SEMANAL DAS RODOVIAS (OPEN-METEO API) */}
        <div className="lg:col-span-7 h-full min-h-0 bg-[#2D3142]/90 backdrop-blur-md rounded-3xl border border-white/15 p-5 lg:p-6 shadow-2xl flex flex-col justify-between gap-3.5 overflow-hidden">
          {/* 1. Cabeçalho da Telemetria Meteorológica da Rodovia */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A05BE] text-white flex items-center justify-center shadow-md">
                <i className="fa-solid fa-cloud-sun-rain text-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#D178FF]">
                    Boletim Meteorológico de Campo • Open-Meteo
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-tabular font-semibold">
                    AO VIVO
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-lg lg:text-2xl text-white leading-tight">
                  {weatherReport.locationLabel}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1E2022] border border-[#8A05BE]/60 text-xs font-bold text-[#D178FF]">
                <i className="fa-solid fa-road" />
                <span>{weatherReport.highwayTag}</span>
              </span>
              <div className="text-[10px] font-mono-tabular text-[#F4F5F7]/65 mt-1">
                Sincronizado às {weatherReport.updatedAt}
              </div>
            </div>
          </div>

          {/* 2. Painel de Clima Atual em Destaque (Temperatura, Umidade, Vento e Alerta de Campo) */}
          <div className="bg-[#1E2022]/90 rounded-2xl p-4 lg:p-5 border border-[#8A05BE]/50 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center shrink-0">
            {/* Current Temp & Animated Icon */}
            <div className="sm:col-span-5 flex items-center gap-4 border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0 sm:pr-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[#2D3142] border border-[#8A05BE]/50 flex items-center justify-center shrink-0 shadow-inner">
                <i className={`${weatherReport.iconClass} text-3xl lg:text-4xl animate-pulse`} />
              </div>
              <div>
                <div className="text-[11px] uppercase font-bold tracking-wider text-[#F4F5F7]/70">
                  Clima Agora
                </div>
                <div className="font-mono-tabular font-extrabold text-4xl lg:text-5xl text-white leading-none my-1">
                  {weatherReport.currentTemp}°C
                </div>
                <div className="text-xs font-semibold text-[#D178FF]">
                  {weatherReport.conditionLabel}
                </div>
              </div>
            </div>

            {/* Humidity, Wind & Field Planning Recommendation */}
            <div className="sm:col-span-7 flex flex-col justify-between gap-2.5">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-[#2D3142]/80 rounded-xl px-3 py-2 border border-white/10">
                  <div className="text-[10px] text-[#F4F5F7]/65 uppercase font-semibold">
                    Umidade do Ar
                  </div>
                  <div className="font-mono-tabular font-bold text-sm lg:text-base text-white mt-0.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-droplet text-sky-400 text-xs" />
                    <span>{weatherReport.humidity}%</span>
                  </div>
                </div>

                <div className="bg-[#2D3142]/80 rounded-xl px-3 py-2 border border-white/10">
                  <div className="text-[10px] text-[#F4F5F7]/65 uppercase font-semibold">
                    Vento Atual
                  </div>
                  <div className="font-mono-tabular font-bold text-sm lg:text-base text-white mt-0.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-wind text-teal-300 text-xs" />
                    <span>{weatherReport.windSpeedKmh} km/h</span>
                  </div>
                </div>

                <div className="bg-[#2D3142]/80 rounded-xl px-3 py-2 border border-white/10">
                  <div className="text-[10px] text-[#F4F5F7]/65 uppercase font-semibold">
                    Chuva Hoje
                  </div>
                  <div className="font-mono-tabular font-bold text-sm lg:text-base text-white mt-0.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-umbrella text-[#D178FF] text-xs" />
                    <span>{weatherReport.daily[0]?.rainProbability ?? 30}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#8A05BE]/20 border border-[#8A05BE]/60 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
                <i className="fa-solid fa-helmet-safety text-[#D178FF] text-sm shrink-0" />
                <span className="text-xs font-medium text-[#F4F5F7] truncate">
                  <strong className="text-white">Planejamento de Campo:</strong>{' '}
                  {weatherReport.fieldAlert}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Carrossel / Cards da Previsão Semanal (Próximos 7 Dias) */}
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-calendar-week text-[#D178FF]" />
                <span>Previsão Semanal das Frentes de Serviço (Próximos 7 Dias)</span>
              </span>
              <span className="text-[11px] text-[#F4F5F7]/65">
                Máx / Mín (°C) &amp; Probabilidade de Chuva
              </span>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-7 gap-2 lg:gap-2.5 items-stretch overflow-hidden">
              {weatherReport.daily.slice(0, 7).map((day, idx) => {
                const isToday = idx === 0;
                return (
                  <div
                    key={day.dateIso}
                    className={`rounded-2xl p-2.5 lg:p-3 flex flex-col justify-between items-center text-center transition-all overflow-hidden ${
                      isToday
                        ? 'bg-gradient-to-b from-[#8A05BE]/40 to-[#1E2022] border-2 border-[#8A05BE] shadow-lg'
                        : 'bg-[#1E2022]/85 border border-white/10'
                    }`}
                  >
                    {/* Day Name & Date */}
                    <div className="w-full">
                      <div
                        className={`font-display font-extrabold text-xs lg:text-sm uppercase ${
                          isToday ? 'text-[#D178FF]' : 'text-white'
                        }`}
                      >
                        {day.weekdayShort}
                      </div>
                      <div className="font-mono-tabular text-[10px] text-[#F4F5F7]/65">
                        {day.dayMonth}
                      </div>
                    </div>

                    {/* Weather Icon & Short Condition */}
                    <div className="my-auto py-1 flex flex-col items-center">
                      <i className={`${day.iconClass} text-xl lg:text-2xl mb-1`} />
                      <span className="text-[10px] text-[#F4F5F7]/80 font-medium leading-tight line-clamp-1">
                        {day.conditionLabel.split('/')[0].trim()}
                      </span>
                    </div>

                    {/* Max / Min Temperatures & Rain Probability */}
                    <div className="w-full space-y-1 pt-1.5 border-t border-white/10">
                      <div className="font-mono-tabular text-xs lg:text-sm font-bold text-white flex items-center justify-center gap-1">
                        <span>{day.tempMax}°</span>
                        <span className="text-[#F4F5F7]/50 font-normal">{day.tempMin}°</span>
                      </div>
                      <div className="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded bg-[#2D3142] text-[10px] font-mono-tabular font-semibold text-sky-300 w-full">
                        <i className="fa-solid fa-droplet text-[9px]" />
                        <span>{day.rainProbability}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
