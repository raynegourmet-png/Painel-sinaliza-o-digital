/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SlideId, SignageConfig } from './types/signage';
import { loadSignageConfig, saveSignageConfig } from './data/defaultConfig';
import { MatupiriLogo } from './components/MatupiriLogo';
import { Slide0Vinheta } from './components/Slides/Slide0Vinheta';
import { Slide1Boletim } from './components/Slides/Slide1Boletim';
import { Slide2Destaques } from './components/Slides/Slide2Destaques';
import { SlideGaleriaInterativa } from './components/Slides/SlideGaleriaInterativa';
import { SlideEquipeMes } from './components/Slides/SlideEquipeMes';
import { Slide3Aniversariantes } from './components/Slides/Slide3Aniversariantes';
import { Slide4Comunicados } from './components/Slides/Slide4Comunicados';
import { Slide5RelogioInstitucional } from './components/Slides/Slide5RelogioInstitucional';
import { AdminModal } from './components/AdminModal';
import { PinAuthModal } from './components/PinAuthModal';
import {
  buildFallbackWeatherReport,
  fetchHighwayWeather,
  HighwayWeatherReport
} from './utils/weatherService';

const SLIDE_LABELS: Record<SlideId, string> = {
  vinheta: 'Vinheta',
  boletim: 'Boletim Mensal',
  destaques: 'Mural de Serviços',
  galeria: 'Galeria Interativa',
  relogio: 'Relógio & Clima',
  equipe: 'Equipe do Mês',
  aniversariantes: 'Aniversariantes',
  comunicados: 'Comunicados'
};

export default function App() {
  const [savedConfig, setSavedConfig] = useState<SignageConfig>(() => loadSignageConfig());
  // Live Preview state (when non-null, runs the TV loop with unsaved draft changes)
  const [previewConfig, setPreviewConfig] = useState<SignageConfig | null>(null);

  const config = previewConfig || savedConfig;
  const isLivePreview = previewConfig !== null;

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [compactHeader, setCompactHeader] = useState<boolean>(false);

  const [weatherReport, setWeatherReport] = useState<HighwayWeatherReport>(() =>
    buildFallbackWeatherReport(
      config.weatherLocationId,
      config.weatherCity,
      config.weatherManualOverrideCity
    )
  );

  // Fetch live Open-Meteo weather forecast via Browser Geolocation / IP / Manual Override
  // Updates automatically every 30 minutes without reloading the page
  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      const report = await fetchHighwayWeather(
        config.weatherLocationId || 'auto_geo',
        config.weatherCity,
        config.weatherManualOverrideCity
      );
      if (isMounted) {
        setWeatherReport(report);
      }
    };

    loadWeather();
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [config.weatherLocationId, config.weatherCity, config.weatherManualOverrideCity]);

  // Compute active slides dynamically including "Mural da Galeria Interativa"
  const activeSlides = useMemo<SlideId[]>(() => {
    const list: SlideId[] = [];
    if (config.vignetteFullscreenEnabled !== false) {
      list.push('vinheta');
    }
    if (config.boletimUrl && config.boletimUrl.trim().length > 0) {
      list.push('boletim');
    }
    if (config.photos && config.photos.length > 0) {
      list.push('destaques');
    }
    if (config.galleryItems && config.galleryItems.length > 0) {
      list.push('galeria');
    }
    list.push('relogio');
    if (config.teamMembers && config.teamMembers.length > 0) {
      list.push('equipe');
    }
    if (config.birthdays && config.birthdays.length > 0) {
      list.push('aniversariantes');
    }
    if (config.events && config.events.length > 0) {
      list.push('comunicados');
    }
    return list;
  }, [config]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>(0);

  const safeSlideIndex = currentSlideIndex < activeSlides.length ? currentSlideIndex : 0;
  const currentSlideId: SlideId = activeSlides[safeSlideIndex] || 'relogio';

  const getDurationForSlide = useCallback((slideId: SlideId, cfg: SignageConfig): number => {
    switch (slideId) {
      case 'vinheta':
        return Math.max(5, cfg.durations.vinheta || 9);
      case 'boletim':
        return Math.max(5, cfg.durations.boletim || 18);
      case 'destaques':
        return Math.max(5, cfg.durations.destaquesPerPhoto || 12);
      case 'galeria':
        return Math.max(5, cfg.durations.galeria || 12);
      case 'equipe':
        return Math.max(5, cfg.durations.equipe || 15);
      case 'aniversariantes':
        return Math.max(5, cfg.durations.aniversariantes || 15);
      case 'comunicados':
        return Math.max(5, cfg.durations.comunicados || 15);
      case 'relogio':
      default:
        return Math.max(5, cfg.durations.relogio || 15);
    }
  }, []);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    getDurationForSlide(currentSlideId, config)
  );

  const totalSlideSeconds = getDurationForSlide(currentSlideId, config);

  // Check if current gallery item is an active MP4 video (if so, video.onended controls advancement, with a 60s safety cap)
  const isCurrentGalleryItemVideo = useMemo(() => {
    if (currentSlideId !== 'galeria' || !config.galleryItems?.length) return false;
    const item = config.galleryItems[currentGalleryIndex % config.galleryItems.length];
    return item?.mediaType === 'video' && Boolean(item.url);
  }, [currentSlideId, config.galleryItems, currentGalleryIndex]);

  const requestAdminAccess = useCallback(() => {
    if (isAdminOpen) {
      setIsAdminOpen(false);
      return;
    }
    if (isLivePreview) {
      setIsAdminOpen(true);
      return;
    }
    setIsPinModalOpen(true);
  }, [isAdminOpen, isLivePreview]);

  // Sync fullscreen state with browser events
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setCompactHeader((prev) => !prev);
    }
  }, []);

  // Jump to a specific slide manually or automatically
  const goToSlide = useCallback(
    (targetIndex: number) => {
      const normalized =
        ((targetIndex % activeSlides.length) + activeSlides.length) % activeSlides.length;
      const nextSlideId = activeSlides[normalized];
      setCurrentSlideIndex(normalized);
      setCurrentPhotoIndex(0);
      setCurrentGalleryIndex(0);
      setRemainingSeconds(getDurationForSlide(nextSlideId, config));
    },
    [activeSlides, config, getDurationForSlide]
  );

  // Advance from a finished MP4 video in the Interactive Gallery
  const handleGalleryVideoEnded = useCallback(() => {
    const step =
      config.galleryLayoutMode === 'coletivo' ? config.galleryMosaicCount || 4 : 1;
    if (
      config.galleryItems &&
      currentGalleryIndex + step < config.galleryItems.length
    ) {
      setCurrentGalleryIndex((g) => g + step);
      setRemainingSeconds(getDurationForSlide('galeria', config));
    } else {
      const nextIdx = (safeSlideIndex + 1) % activeSlides.length;
      const nextId = activeSlides[nextIdx];
      setCurrentSlideIndex(nextIdx);
      setCurrentPhotoIndex(0);
      setCurrentGalleryIndex(0);
      setRemainingSeconds(getDurationForSlide(nextId, config));
    }
  }, [
    activeSlides,
    config,
    currentGalleryIndex,
    getDurationForSlide,
    safeSlideIndex
  ]);

  // Real-time 1-second clock & slide loop engine
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      if (isPaused || isAdminOpen || isPinModalOpen) {
        return;
      }

      setRemainingSeconds((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // 1. Sub-steps inside "Mural de Serviços do Boletim"
        if (
          currentSlideId === 'destaques' &&
          config.photos.length > 1 &&
          currentPhotoIndex + 1 < config.photos.length
        ) {
          setCurrentPhotoIndex((p) => p + 1);
          return getDurationForSlide('destaques', config);
        }

        // 2. Sub-steps inside "Galeria Interativa"
        if (currentSlideId === 'galeria' && config.galleryItems?.length > 1) {
          const step =
            config.galleryLayoutMode === 'coletivo' ? config.galleryMosaicCount || 4 : 1;
          if (currentGalleryIndex + step < config.galleryItems.length) {
            setCurrentGalleryIndex((g) => g + step);
            return getDurationForSlide('galeria', config);
          }
        }

        // 3. Advance to next main slide
        const nextIdx = (safeSlideIndex + 1) % activeSlides.length;
        const nextId = activeSlides[nextIdx];
        setCurrentSlideIndex(nextIdx);
        setCurrentPhotoIndex(0);
        setCurrentGalleryIndex(0);
        return getDurationForSlide(nextId, config);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    activeSlides,
    config,
    currentGalleryIndex,
    currentPhotoIndex,
    currentSlideId,
    getDurationForSlide,
    isAdminOpen,
    isPaused,
    isPinModalOpen,
    safeSlideIndex
  ]);

  // Keyboard listener for "A", "Esc", "F", Arrows, and Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isInputFocused) {
        if (e.key === 'Escape') {
          setIsPinModalOpen(false);
          setIsAdminOpen(false);
        }
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        requestAdminAccess();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isPinModalOpen) {
          setIsPinModalOpen(false);
        } else if (isAdminOpen) {
          setIsAdminOpen(false);
        } else {
          requestAdminAccess();
        }
      } else if ((e.key === 'f' || e.key === 'F') && !isAdminOpen && !isPinModalOpen) {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' && !isAdminOpen && !isPinModalOpen) {
        goToSlide(safeSlideIndex + 1);
      } else if (e.key === 'ArrowLeft' && !isAdminOpen && !isPinModalOpen) {
        goToSlide(safeSlideIndex - 1);
      } else if (e.key === ' ' && !isAdminOpen && !isPinModalOpen) {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    goToSlide,
    isAdminOpen,
    isPinModalOpen,
    requestAdminAccess,
    safeSlideIndex,
    toggleFullscreen
  ]);

  const handleStartPreview = (draftConfig: SignageConfig) => {
    setPreviewConfig(draftConfig);
    setIsAdminOpen(false);
    setCurrentSlideIndex(0);
    setCurrentPhotoIndex(0);
    setCurrentGalleryIndex(0);
    const firstSlide: SlideId =
      draftConfig.vignetteFullscreenEnabled !== false
        ? 'vinheta'
        : draftConfig.boletimUrl && draftConfig.boletimUrl.trim()
        ? 'boletim'
        : 'relogio';
    setRemainingSeconds(getDurationForSlide(firstSlide, draftConfig));
  };

  const handleSaveConfig = (newConfig: SignageConfig) => {
    setSavedConfig(newConfig);
    setPreviewConfig(null);
    saveSignageConfig(newConfig);
    setCurrentSlideIndex(0);
    setCurrentPhotoIndex(0);
    setCurrentGalleryIndex(0);
    const firstSlide: SlideId =
      newConfig.vignetteFullscreenEnabled !== false
        ? 'vinheta'
        : newConfig.boletimUrl && newConfig.boletimUrl.trim()
        ? 'boletim'
        : 'relogio';
    setRemainingSeconds(getDurationForSlide(firstSlide, newConfig));
  };

  const formattedClock = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedHeaderDate = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  });

  const progressPercentage =
    totalSlideSeconds > 0
      ? Math.min(
          100,
          Math.max(0, ((totalSlideSeconds - remainingSeconds) / totalSlideSeconds) * 100)
        )
      : 100;

  return (
    <div className="fixed inset-0 h-[100dvh] w-[100dvw] max-h-[100dvh] max-w-[100dvw] flex flex-col justify-between bg-[#1E2022] text-[#F4F5F7] overflow-hidden select-none">
      {/* LIVE PREVIEW FLOATING CONTROL BAR */}
      {isLivePreview && !isAdminOpen && (
        <div className="bg-gradient-to-r from-[#8A05BE] via-[#680E8A] to-[#8A05BE] px-4 py-2 border-b border-white/25 flex flex-wrap items-center justify-between gap-3 z-30 shadow-xl shrink-0">
          <div className="flex items-center gap-2.5 text-xs lg:text-sm font-bold text-white">
            <span aria-hidden="true">👁️</span>
            <span>MODO PRÉ-VISUALIZAÇÃO AO VIVO (Alterações ainda não salvas em definitivo)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="px-3.5 py-1 rounded-lg bg-[#1E2022] hover:bg-[#2D3142] text-xs font-bold text-white border border-white/20 cursor-pointer"
            >
              ✏️ Voltar à Edição
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewConfig(null);
                setCurrentSlideIndex(0);
              }}
              className="px-3 py-1 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-xs font-semibold text-white border border-red-300/30 cursor-pointer"
            >
              Descartar Prévia
            </button>
            <button
              type="button"
              onClick={() => previewConfig && handleSaveConfig(previewConfig)}
              className="px-4 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white shadow-md cursor-pointer"
            >
              💾 Salvar e Publicar Agora
            </button>
          </div>
        </div>
      )}

      {/* 1. HEADER CORPORATIVO (COMPACT NAV PILL + EXPANDED WEATHER BLOCK) */}
      <header
        className={`${
          compactHeader ? 'h-14 px-4' : 'h-16 lg:h-[74px] px-4 lg:px-6'
        } bg-[#1E2022] border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-20 transition-all`}
      >
        {/* Left: Official Consórcio Matupiri Logo */}
        <MatupiriLogo
          size={compactHeader ? 'sm' : 'md'}
          variant={config.logoVariant || 'light-badge'}
          customLogoUrl={config.customLogoUrl}
        />

        {/* Center: Reduced & Discreet Topic Pill (e.g. "07. Comunicados | ⏸ 12s") */}
        <nav
          aria-label="Tópico em Exibição"
          className="hidden lg:flex items-center gap-1.5 bg-[#2D3142]/65 px-2.5 py-1 rounded-xl border border-white/10 max-w-fit shrink-0"
        >
          <button
            type="button"
            onClick={() => goToSlide(safeSlideIndex - 1)}
            className="w-5 h-5 rounded-md hover:bg-white/10 text-[#F4F5F7]/60 hover:text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
            title="Slide Anterior (Seta Esquerda)"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          {/* Compact Topic Selector */}
          <div className="flex items-center gap-1">
            {activeSlides.map((slideId, idx) => {
              const isCurrent = idx === safeSlideIndex;
              if (!isCurrent) {
                return (
                  <button
                    key={slideId}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className="w-5 h-5 rounded-md text-[10px] font-mono-tabular text-[#F4F5F7]/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    title={`Ir para 0${idx + 1}. ${SLIDE_LABELS[slideId]}`}
                  >
                    0{idx + 1}
                  </button>
                );
              }
              return (
                <button
                  key={slideId}
                  type="button"
                  onClick={() => goToSlide((idx + 1) % activeSlides.length)}
                  className="px-2.5 py-0.5 rounded-lg bg-[#8A05BE] text-white text-[11px] font-semibold tracking-tight whitespace-nowrap flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Tópico atual (Clique para avançar)"
                >
                  <span className="font-mono-tabular opacity-85">0{idx + 1}.</span>
                  <span>{SLIDE_LABELS[slideId]}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goToSlide(safeSlideIndex + 1)}
            className="w-5 h-5 rounded-md hover:bg-white/10 text-[#F4F5F7]/60 hover:text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
            title="Próximo Slide (Seta Direita)"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>

          <span className="text-white/25 text-xs select-none">|</span>

          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="px-1.5 py-0.5 rounded-md text-[11px] font-mono-tabular text-[#F4F5F7]/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            title={isPaused ? 'Retomar Loop Automático (Espaço)' : 'Pausar Loop Automático (Espaço)'}
          >
            <i className={`fa-solid ${isPaused ? 'fa-play text-[#D178FF]' : 'fa-pause'} text-[9px]`} />
            <span>{remainingSeconds}s</span>
          </button>
        </nav>

        {/* Right: Expanded Weather Forecast Card + Real-Time Clock + Controls */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          {/* Expanded Live Weather Card */}
          <div className="hidden sm:flex items-center gap-3.5 bg-gradient-to-r from-[#2D3142] to-[#252836] px-4 py-1.5 rounded-2xl border border-[#8A05BE]/55 shadow-[0_4px_20px_rgba(138,5,190,0.2)]">
            {/* Animated Weather Icon Box */}
            <div className="w-10 h-10 rounded-xl bg-[#1E2022] border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <i className={`${weatherReport.iconClass} text-xl`} />
            </div>

            {/* Temperature + Condition + Real-Time City Name */}
            <div className="flex items-center gap-3.5">
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono-tabular font-extrabold text-xl lg:text-2xl text-white leading-none">
                    {weatherReport.currentTemp}°C
                  </span>
                  <span className="text-[11px] font-bold text-[#D178FF] whitespace-nowrap">
                    {weatherReport.conditionLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#F4F5F7]/85 font-medium mt-0.5">
                  <i
                    className={`fa-solid ${
                      weatherReport.sourceType === 'gps'
                        ? 'fa-location-crosshairs text-emerald-400'
                        : 'fa-location-dot text-[#D178FF]'
                    } text-[10px]`}
                  />
                  <span className="max-w-[210px] truncate font-semibold text-white">
                    {weatherReport.locationLabel}
                  </span>
                  <span className="text-white/35">·</span>
                  <span className="text-[10px] text-[#F4F5F7]/70 font-mono-tabular">
                    💧 {weatherReport.humidity}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Clock & Date */}
          <div className="text-right pl-1">
            <div className="font-mono-tabular font-extrabold text-xl lg:text-2xl text-white tracking-tight leading-none">
              {formattedClock}
            </div>
            <div className="text-[11px] text-[#F4F5F7]/75 capitalize mt-0.5 whitespace-nowrap">
              {formattedHeaderDate}
            </div>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-xl bg-[#2D3142]/80 hover:bg-[#8A05BE] text-[#F4F5F7]/80 hover:text-white border border-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Alternar Tela Cheia (Tecla F)"
            aria-label="Tela Cheia"
          >
            <i
              className={`fa-solid ${
                isFullscreen || compactHeader ? 'fa-compress' : 'fa-expand'
              } text-xs`}
            />
          </button>

          {/* Discrete Gear Button Protected by PIN ("0712") */}
          <button
            type="button"
            onClick={requestAdminAccess}
            className="w-9 h-9 rounded-xl bg-[#2D3142]/80 hover:bg-[#8A05BE] text-[#F4F5F7]/70 hover:text-white border border-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Abrir Painel Administrativo Protegido por PIN (Tecla A ou Esc)"
            aria-label="Abrir Configurações"
          >
            <i className="fa-solid fa-gear text-xs" />
          </button>
        </div>
      </header>

      {/* Slide Progress Bar in Roxo Matupiri */}
      <div className="w-full h-1 bg-[#2D3142] shrink-0 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#8A05BE] to-[#B845E8] transition-all duration-500 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* 2. ÁREA CENTRAL DE SLIDES EM LOOP CONTÍNUO */}
      <main className="flex-1 w-full min-h-0 relative overflow-hidden">
        {currentSlideId === 'vinheta' && (
          <Slide0Vinheta
            config={config}
            remainingSeconds={remainingSeconds}
            totalSeconds={totalSlideSeconds}
          />
        )}

        {currentSlideId === 'boletim' && (
          <Slide1Boletim
            config={config}
            remainingSeconds={remainingSeconds}
          />
        )}

        {currentSlideId === 'destaques' && (
          <Slide2Destaques
            photos={config.photos}
            currentPhotoIndex={currentPhotoIndex}
            onSelectPhoto={(idx) => {
              setCurrentPhotoIndex(idx);
              setRemainingSeconds(getDurationForSlide('destaques', config));
            }}
            photoRemainingSeconds={remainingSeconds}
            photoDurationSeconds={totalSlideSeconds}
            boletimMonth={config.boletimMonth}
            config={config}
          />
        )}

        {currentSlideId === 'galeria' && (
          <SlideGaleriaInterativa
            items={config.galleryItems || []}
            layoutMode={config.galleryLayoutMode || 'coletivo'}
            mosaicCount={config.galleryMosaicCount || 4}
            activeIndex={currentGalleryIndex}
            onSelectIndex={(idx) => {
              setCurrentGalleryIndex(idx);
              setRemainingSeconds(getDurationForSlide('galeria', config));
            }}
            onVideoEnded={isCurrentGalleryItemVideo ? handleGalleryVideoEnded : undefined}
            remainingSeconds={remainingSeconds}
            totalSeconds={totalSlideSeconds}
            config={config}
          />
        )}

        {currentSlideId === 'relogio' && (
          <Slide5RelogioInstitucional
            config={config}
            currentTime={currentTime}
            weatherReport={weatherReport}
          />
        )}

        {currentSlideId === 'equipe' && (
          <SlideEquipeMes
            teamMembers={config.teamMembers}
            config={config}
          />
        )}

        {currentSlideId === 'aniversariantes' && (
          <Slide3Aniversariantes
            birthdays={config.birthdays}
            currentDate={currentTime}
          />
        )}

        {currentSlideId === 'comunicados' && (
          <Slide4Comunicados events={config.events} config={config} />
        )}
      </main>

      {/* 3. RODAPÉ / TICKER ROLANTE EM ROXO MATUPIRI */}
      <footer className="h-10 lg:h-11 bg-gradient-to-r from-[#8A05BE] via-[#7B1FA2] to-[#8A05BE] border-t border-white/20 flex items-center overflow-hidden shrink-0 z-20">
        {/* Left Fixed Label */}
        <div className="h-full px-4 lg:px-5 bg-[#1E2022] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 border-r border-white/20 z-10 shadow-lg">
          <i className="fa-solid fa-road text-[#B845E8]" />
          <span>Destaques &amp; Rodovias</span>
        </div>

        {/* Scrolling Marquee Content */}
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="animate-ticker flex items-center whitespace-nowrap">
            {[0, 1].map((dupIndex) => (
              <div key={dupIndex} className="flex items-center">
                {config.tickerMessages.map((msg, idx) => (
                  <span
                    key={`${dupIndex}-${idx}`}
                    className="inline-flex items-center text-xs lg:text-sm font-semibold text-white mx-7"
                  >
                    <span className="mr-2.5 text-white/90" aria-hidden="true">
                      🔹
                    </span>
                    <span>{msg}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Discrete Hint */}
        <button
          type="button"
          onClick={requestAdminAccess}
          className="hidden lg:flex h-full px-3.5 bg-[#1E2022]/90 hover:bg-[#1E2022] text-[11px] font-mono-tabular text-[#F4F5F7]/75 hover:text-white items-center gap-1.5 shrink-0 border-l border-white/20 transition-colors cursor-pointer"
          title="Abrir configurações protegidas por PIN (Tecla A ou Esc)"
        >
          <i className="fa-solid fa-lock text-[10px] text-[#D178FF]" />
          <span>[A / ESC] Admin</span>
        </button>
      </footer>

      {/* 4. MODAL DE SEGURANÇA POR PIN ("0712") */}
      <PinAuthModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* 5. PAINEL ADMINISTRATIVO OCULTO (MODAL) */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          config={config}
          onClose={() => setIsAdminOpen(false)}
          onPreview={handleStartPreview}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
}
