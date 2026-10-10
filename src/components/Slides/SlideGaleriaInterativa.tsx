import React from 'react';
import {
  GalleryLayoutMode,
  GalleryMediaItem,
  SignageConfig
} from '../../types/signage';
import { DynamicVideoBackground } from '../DynamicVideoBackground';

interface SlideGaleriaInterativaProps {
  items: GalleryMediaItem[];
  layoutMode: GalleryLayoutMode;
  mosaicCount: 2 | 3 | 4;
  activeIndex: number;
  onSelectIndex?: (index: number) => void;
  onVideoEnded?: () => void;
  remainingSeconds?: number;
  totalSeconds?: number;
  config?: SignageConfig;
  isMiniPreview?: boolean;
}

export const SlideGaleriaInterativa: React.FC<SlideGaleriaInterativaProps> = ({
  items,
  layoutMode,
  mosaicCount = 4,
  activeIndex,
  onSelectIndex,
  onVideoEnded,
  remainingSeconds = 12,
  totalSeconds = 12,
  config,
  isMiniPreview = false
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1E2022] text-[#F4F5F7]/60 text-sm">
        Nenhuma mídia cadastrada na Galeria Interativa.
      </div>
    );
  }

  const safeIndex = ((activeIndex % items.length) + items.length) % items.length;
  const activeItem = items[safeIndex] || items[0];

  const itemProgressPct =
    totalSeconds > 0
      ? Math.min(100, Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100))
      : 100;

  const renderMediaElement = (
    item: GalleryMediaItem,
    isPrimaryActive: boolean,
    className = 'w-full h-full object-cover'
  ) => {
    if (item.mediaType === 'video') {
      return (
        <video
          key={`${item.id}-${isPrimaryActive ? 'active' : 'side'}`}
          src={item.url}
          autoPlay={isPrimaryActive}
          muted
          playsInline
          loop={!isPrimaryActive || isMiniPreview}
          onEnded={() => {
            if (isPrimaryActive && !isMiniPreview && onVideoEnded) {
              onVideoEnded();
            }
          }}
          className={className}
        />
      );
    }

    return (
      <img
        src={item.url}
        alt={item.title}
        className={className}
      />
    );
  };

  return (
    <div
      className={`w-full h-full min-h-0 relative overflow-hidden bg-[#1E2022] flex flex-col justify-between ${
        isMiniPreview ? 'p-3 gap-2' : 'p-4 lg:p-6 gap-3.5 slide-transition-enter'
      }`}
    >
      {/* Optional Dynamic Video Glassmorphism Background */}
      {!isMiniPreview && config && <DynamicVideoBackground config={config} />}

      {/* Top Editorial Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2.5 shrink-0">
        <div className="flex items-center gap-3">
          <span
            className={`${
              isMiniPreview ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-base'
            } rounded-xl bg-[#8A05BE] text-white flex items-center justify-center shadow-md shrink-0`}
          >
            <i className="fa-solid fa-photo-film" />
          </span>
          <div>
            <div className="flex items-center gap-2 text-[10px] lg:text-xs font-semibold uppercase tracking-widest text-[#D178FF]">
              <span>Mural da Galeria Interativa</span>
              <span aria-hidden="true">·</span>
              <span>
                {layoutMode === 'individual'
                  ? 'Modo Individual (Tela Cheia)'
                  : layoutMode === 'coletivo'
                  ? `Modo Coletivo (Mosaico ${mosaicCount} Mídias)`
                  : 'Modo Carrossel Dinâmico 3D'}
              </span>
            </div>
            <h1
              className={`font-display font-extrabold ${
                isMiniPreview ? 'text-sm' : 'text-lg lg:text-2xl'
              } text-white tracking-tight leading-tight`}
            >
              Registros Visuais de Obras, Equipes e Eventos — Consórcio Matupiri
            </h1>
          </div>
        </div>

        {/* Right Discrete Counter & Mode Info */}
        <div className="flex items-center gap-2.5">
          {activeItem.mediaType === 'video' && (
            <span className="px-2.5 py-1 rounded-lg bg-[#8A05BE]/30 border border-[#8A05BE] text-[11px] font-bold text-[#D178FF] flex items-center gap-1.5">
              <i className="fa-solid fa-video text-[10px]" />
              <span>Vídeo MP4 (Avanço Automático)</span>
            </span>
          )}
          <div className="px-3 py-1 rounded-xl bg-[#2D3142]/90 border border-white/10 text-xs font-mono-tabular text-[#F4F5F7]/90">
            <span className="text-[#D178FF] font-bold">{safeIndex + 1}</span>
            <span className="mx-1 opacity-50">/</span>
            <span>{items.length}</span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODE 1: INDIVIDUAL (Full-screen 1-by-1 with Frosted Glass Caption Card)
         ===================================================================== */}
      {layoutMode === 'individual' && (
        <div
          key={`ind-${activeItem.id}-${safeIndex}`}
          className="relative z-10 flex-1 min-h-0 w-full rounded-2xl overflow-hidden border-2 border-[#8A05BE]/75 shadow-[0_18px_55px_rgba(0,0,0,0.65)] bg-[#141618] carousel-highlight-enter"
        >
          {renderMediaElement(activeItem, true, 'w-full h-full object-cover')}

          {/* Subtle cinematic gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022]/95 via-[#1E2022]/25 to-transparent pointer-events-none" />

          {/* Top-Left Media Type & Location Kicker */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#1E2022]/85 backdrop-blur-md border border-[#8A05BE]/70 text-xs font-display font-bold text-white flex items-center gap-2 shadow-lg">
              <i
                className={`fa-solid ${
                  activeItem.mediaType === 'video'
                    ? 'fa-circle-play text-[#D178FF]'
                    : 'fa-location-dot text-[#D178FF]'
                }`}
              />
              <span>{activeItem.location || 'Consórcio Matupiri'}</span>
            </div>
          </div>

          {/* Bottom Frosted Glass Caption Card */}
          <div
            className={`absolute ${
              isMiniPreview ? 'bottom-3 left-3 right-3 p-3' : 'bottom-5 left-5 right-5 lg:left-7 lg:right-7 p-5 lg:p-6'
            } rounded-2xl bg-[#1E2022]/80 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col lg:flex-row lg:items-end justify-between gap-4`}
          >
            <div className="space-y-1.5 max-w-4xl">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#D178FF]">
                <span>{activeItem.location || 'Frente de Serviço'}</span>
                <span aria-hidden="true">·</span>
                <span>{activeItem.date || 'Outubro 2026'}</span>
              </div>
              <h2
                className={`font-display font-extrabold ${
                  isMiniPreview ? 'text-base' : 'text-xl lg:text-3xl'
                } text-white leading-snug`}
              >
                {activeItem.title}
              </h2>
              {activeItem.caption && (
                <p
                  className={`${
                    isMiniPreview ? 'text-xs line-clamp-1' : 'text-xs lg:text-sm line-clamp-2'
                  } text-[#F4F5F7]/90 leading-relaxed`}
                >
                  {activeItem.caption}
                </p>
              )}
            </div>

            {!isMiniPreview && (
              <div className="flex items-center gap-2 shrink-0">
                {items.map((it, idx) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onSelectIndex && onSelectIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === safeIndex
                        ? 'w-8 bg-[#8A05BE]'
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    title={it.title}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 2: COLETIVO (Mosaico / Grid — 2, 3 or 4 items together)
         ===================================================================== */}
      {layoutMode === 'coletivo' && (() => {
        const count = Math.min(mosaicCount, Math.max(2, items.length));
        const mosaicSlice: GalleryMediaItem[] = [];
        for (let i = 0; i < Math.min(mosaicCount, items.length); i++) {
          mosaicSlice.push(items[(safeIndex + i) % items.length]);
        }

        if (count === 2 || mosaicSlice.length === 2) {
          return (
            <div className="relative z-10 flex-1 min-h-0 grid grid-cols-12 gap-4 lg:gap-5 items-stretch overflow-hidden">
              {mosaicSlice.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => onSelectIndex && onSelectIndex((safeIndex + idx) % items.length)}
                  className="col-span-12 md:col-span-6 relative rounded-2xl overflow-hidden border-2 border-[#8A05BE]/65 bg-[#2D3142] shadow-2xl group cursor-pointer"
                >
                  {renderMediaElement(
                    item,
                    idx === 0,
                    'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022]/95 via-[#1E2022]/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 lg:bottom-4 lg:left-4 lg:right-4 p-3.5 lg:p-4 rounded-xl bg-[#1E2022]/80 backdrop-blur-md border border-white/15">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#D178FF] mb-0.5">
                      {item.location} · {item.date}
                    </div>
                    <h3
                      className={`font-display font-extrabold ${
                        isMiniPreview ? 'text-xs' : 'text-base lg:text-xl'
                      } text-white line-clamp-1`}
                    >
                      {item.title}
                    </h3>
                    {!isMiniPreview && item.caption && (
                      <p className="text-xs text-[#F4F5F7]/85 line-clamp-2 mt-1">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (count === 3 || mosaicSlice.length === 3) {
          const hero = mosaicSlice[0];
          const sideItems = mosaicSlice.slice(1, 3);
          return (
            <div className="relative z-10 flex-1 min-h-0 grid grid-cols-12 gap-4 lg:gap-5 items-stretch overflow-hidden">
              {/* Left Hero Card (col-span-7) */}
              <div
                onClick={() => onSelectIndex && onSelectIndex(safeIndex)}
                className="col-span-12 lg:col-span-7 relative rounded-2xl overflow-hidden border-2 border-[#8A05BE] bg-[#2D3142] shadow-2xl group cursor-pointer min-h-0"
              >
                {renderMediaElement(
                  hero,
                  true,
                  'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022]/95 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#1E2022]/85 backdrop-blur-md border border-white/15">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#D178FF] mb-1">
                    {hero.location} · {hero.date}
                  </div>
                  <h3
                    className={`font-display font-extrabold ${
                      isMiniPreview ? 'text-sm' : 'text-lg lg:text-2xl'
                    } text-white line-clamp-2`}
                  >
                    {hero.title}
                  </h3>
                  {!isMiniPreview && hero.caption && (
                    <p className="text-xs text-[#F4F5F7]/85 line-clamp-2 mt-1">{hero.caption}</p>
                  )}
                </div>
              </div>

              {/* Right 2 Stacked Cards (col-span-5) */}
              <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-4 lg:gap-5 min-h-0 overflow-hidden">
                {sideItems.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() =>
                      onSelectIndex && onSelectIndex((safeIndex + idx + 1) % items.length)
                    }
                    className="relative rounded-2xl overflow-hidden border border-white/20 hover:border-[#8A05BE] bg-[#2D3142] shadow-xl group cursor-pointer min-h-0"
                  >
                    {renderMediaElement(
                      item,
                      false,
                      'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022]/95 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#1E2022]/80 backdrop-blur-md border border-white/15">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#D178FF]">
                        {item.location}
                      </div>
                      <h4
                        className={`font-display font-bold ${
                          isMiniPreview ? 'text-xs' : 'text-sm lg:text-base'
                        } text-white line-clamp-1`}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Default 4-item 2x2 Corporate Collage Grid
        return (
          <div className="relative z-10 flex-1 min-h-0 grid grid-cols-12 grid-rows-2 gap-3.5 lg:gap-4 items-stretch overflow-hidden">
            {mosaicSlice.slice(0, 4).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectIndex && onSelectIndex((safeIndex + idx) % items.length)}
                className={`col-span-6 relative rounded-2xl overflow-hidden ${
                  idx === 0
                    ? 'border-2 border-[#8A05BE]'
                    : 'border border-white/20 hover:border-[#8A05BE]'
                } bg-[#2D3142] shadow-xl group cursor-pointer min-h-0`}
              >
                {renderMediaElement(
                  item,
                  idx === 0,
                  'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022]/95 via-[#1E2022]/15 to-transparent" />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#1E2022]/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-[#D178FF]">
                  {item.location}
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2.5 lg:p-3 rounded-xl bg-[#1E2022]/85 backdrop-blur-md border border-white/15">
                  <h3
                    className={`font-display font-extrabold ${
                      isMiniPreview ? 'text-[11px]' : 'text-sm lg:text-base'
                    } text-white line-clamp-1`}
                  >
                    {item.title}
                  </h3>
                  {!isMiniPreview && item.caption && (
                    <p className="text-[11px] text-[#F4F5F7]/80 line-clamp-1 mt-0.5">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* =====================================================================
          MODE 3: CARROSSEL DINÂMICO 3D (Central Spotlight + Angled Side Cards)
         ===================================================================== */}
      {layoutMode === 'carrossel' && (() => {
        const prevIndex = (safeIndex - 1 + items.length) % items.length;
        const nextIndex = (safeIndex + 1) % items.length;
        const prevItem = items[prevIndex];
        const nextItem = items[nextIndex];

        return (
          <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center perspective-stage-3d overflow-hidden px-4">
            {/* Left 3D Wing Card */}
            {items.length > 1 && (
              <div
                onClick={() => onSelectIndex && onSelectIndex(prevIndex)}
                className="hidden md:block absolute left-3 lg:left-8 w-[34%] h-[76%] rounded-2xl overflow-hidden border border-white/20 bg-[#2D3142] shadow-2xl cursor-pointer transition-all duration-700 opacity-55 hover:opacity-80"
                style={{
                  transform: 'translate3d(-6%, 0, -140px) rotateY(24deg) scale(0.86)',
                  zIndex: 10
                }}
              >
                {renderMediaElement(prevItem, false, 'w-full h-full object-cover')}
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#1E2022]/85 text-xs font-bold text-white truncate">
                  {prevItem.title}
                </div>
              </div>
            )}

            {/* Center 3D Spotlight Hero Card */}
            <div
              key={`car3d-${activeItem.id}-${safeIndex}`}
              className="relative w-full md:w-[68%] lg:w-[64%] h-[94%] rounded-3xl overflow-hidden border-2 border-[#8A05BE] shadow-[0_25px_80px_rgba(138,5,190,0.55)] bg-[#141618] transition-all duration-700"
              style={{
                transform: 'translate3d(0, 0, 20px) rotateY(0deg) scale(1)',
                zIndex: 30
              }}
            >
              {renderMediaElement(activeItem, true, 'w-full h-full object-cover')}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022] via-transparent to-black/25 pointer-events-none" />

              <div className="absolute top-4 left-4 px-3.5 py-1 rounded-xl bg-[#8A05BE] text-white font-display font-bold text-xs shadow-lg">
                {activeItem.location || 'Destaque Central 3D'}
              </div>

              <div
                className={`absolute ${
                  isMiniPreview ? 'bottom-3 left-3 right-3 p-3' : 'bottom-4 left-4 right-4 lg:p-5 p-4'
                } rounded-2xl bg-[#1E2022]/85 backdrop-blur-xl border border-white/20 shadow-xl`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#D178FF] mb-0.5">
                  {activeItem.location} · {activeItem.date}
                </div>
                <h2
                  className={`font-display font-extrabold ${
                    isMiniPreview ? 'text-sm' : 'text-lg lg:text-2xl'
                  } text-white leading-snug line-clamp-1`}
                >
                  {activeItem.title}
                </h2>
                {!isMiniPreview && activeItem.caption && (
                  <p className="text-xs lg:text-sm text-[#F4F5F7]/85 line-clamp-2 mt-1">
                    {activeItem.caption}
                  </p>
                )}
              </div>
            </div>

            {/* Right 3D Wing Card */}
            {items.length > 1 && (
              <div
                onClick={() => onSelectIndex && onSelectIndex(nextIndex)}
                className="hidden md:block absolute right-3 lg:right-8 w-[34%] h-[76%] rounded-2xl overflow-hidden border border-white/20 bg-[#2D3142] shadow-2xl cursor-pointer transition-all duration-700 opacity-55 hover:opacity-80"
                style={{
                  transform: 'translate3d(6%, 0, -140px) rotateY(-24deg) scale(0.86)',
                  zIndex: 10
                }}
              >
                {renderMediaElement(nextItem, false, 'w-full h-full object-cover')}
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#1E2022]/85 text-xs font-bold text-white truncate">
                  {nextItem.title}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Bottom Interactive Progress Strip */}
      {!isMiniPreview && (
        <div className="relative z-10 bg-[#2D3142]/90 border border-white/10 rounded-xl px-4 py-2 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#F4F5F7]/85">
            <span className="font-mono-tabular font-bold text-[#D178FF]">
              Mídia {safeIndex + 1} de {items.length}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-md">{activeItem.title}</span>
          </div>

          <div className="flex items-center gap-2 w-48">
            <div className="flex-1 h-1.5 bg-[#1E2022] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8A05BE] to-[#D178FF] transition-all duration-500"
                style={{ width: `${itemProgressPct}%` }}
              />
            </div>
            <span className="font-mono-tabular text-[11px] text-[#F4F5F7]/70">
              {remainingSeconds}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
