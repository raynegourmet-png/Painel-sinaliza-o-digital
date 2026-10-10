import React, { useState } from 'react';
import { HighlightPhoto, SignageConfig } from '../../types/signage';
import { formatBoletimPageLabel, resolveHeyzinePageImageUrl } from '../../data/defaultConfig';

interface Slide2DestaquesProps {
  photos: HighlightPhoto[];
  currentPhotoIndex: number;
  onSelectPhoto: (index: number) => void;
  photoRemainingSeconds: number;
  photoDurationSeconds: number;
  boletimMonth?: string;
  config?: SignageConfig;
}

export const Slide2Destaques: React.FC<Slide2DestaquesProps> = ({
  photos,
  currentPhotoIndex,
  onSelectPhoto,
  photoRemainingSeconds,
  photoDurationSeconds,
  boletimMonth = 'Outubro',
  config
}) => {
  const [failedPrimaryUrls, setFailedPrimaryUrls] = useState<Record<string, boolean>>({});
  const [failedFallbackUrls, setFailedFallbackUrls] = useState<Record<string, boolean>>({});

  if (!photos || photos.length === 0) {
    return null;
  }

  const safeIndex = currentPhotoIndex < photos.length ? currentPhotoIndex : 0;
  const activePhoto = photos[safeIndex];
  const formattedPage = formatBoletimPageLabel(activePhoto.boletimPage);

  // Support Heyzine CDN page image (`https://cdn.heyzine.com/flip-book/page/[ID]/[PAGINA].jpg`)
  const heyzinePageCdnUrl =
    activePhoto.useHeyzinePageImage && config?.boletimUrl
      ? resolveHeyzinePageImageUrl(config.boletimUrl, activePhoto.boletimPage)
      : '';

  const primaryImageUrl = heyzinePageCdnUrl || activePhoto.url;
  const secondaryImageUrl = heyzinePageCdnUrl ? activePhoto.url : '';

  const resolvedImageSrc = !failedPrimaryUrls[activePhoto.id]
    ? primaryImageUrl
    : !failedFallbackUrls[activePhoto.id]
    ? secondaryImageUrl
    : '';

  const progressPercent =
    photoDurationSeconds > 0
      ? Math.min(
          100,
          Math.max(0, ((photoDurationSeconds - photoRemainingSeconds) / photoDurationSeconds) * 100)
        )
      : 100;

  const useGlassBackground = config?.vignetteAsBackground !== false;
  const hasVideoBg = Boolean(
    useGlassBackground && config?.vignetteVideoUrl && config.vignetteVideoUrl.trim().length > 0
  );

  return (
    <div className="w-full h-full min-h-0 relative flex flex-col justify-between p-4 lg:p-6 bg-[#1E2022] overflow-hidden slide-transition-enter">
      {/* Optional Dynamic Video Background + Glassmorphism Layer */}
      {hasVideoBg && (
        <video
          src={config?.vignetteVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
      )}

      {/* Ambient Radial Purple Accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: useGlassBackground ? 'blur(10px)' : 'none',
          background:
            'radial-gradient(circle at 18% 20%, rgba(138, 5, 190, 0.18) 0%, transparent 52%), radial-gradient(circle at 85% 80%, rgba(123, 31, 162, 0.14) 0%, transparent 50%)'
        }}
      />

      {/* 1. CABEÇALHO DO MURAL DE SERVIÇOS DO BOLETIM */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 lg:pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-[#8A05BE] text-white flex items-center justify-center shadow-lg shadow-[#8A05BE]/30">
            <i className="fa-solid fa-newspaper text-base lg:text-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D178FF]">
                Mural de Serviços do Boletim • Edição de {boletimMonth}
              </span>
              <span className="text-white/25">•</span>
              <span className="text-[11px] text-[#F4F5F7]/70 font-medium">
                Consórcio Matupiri
              </span>
            </div>
            <h1 className="font-display font-extrabold text-lg lg:text-xl xl:text-2xl text-white tracking-tight leading-tight">
              Frentes de Serviço e Destaques das Obras
            </h1>
          </div>
        </div>

        {/* Top-Right: Active Category Pill & Timer */}
        <div className="flex items-center gap-2.5 bg-[#2D3142]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
          <span className="px-2.5 py-0.5 rounded-md bg-[#8A05BE] text-white font-display font-bold text-[11px] uppercase tracking-wider">
            🔹 {activePhoto.highway || 'DESTAQUE'}
          </span>
          {formattedPage && (
            <span className="text-xs font-semibold text-[#D178FF] font-mono-tabular">
              📖 {formattedPage}
            </span>
          )}
          <span className="text-white/25">|</span>
          <span className="font-mono-tabular text-xs text-[#F4F5F7]/80">
            Próximo em <strong className="text-white">{photoRemainingSeconds}s</strong>
          </span>
        </div>
      </div>

      {/* 2. CORPO CENTRAL DO MURAL (CARROSSEL COM TRANSIÇÃO LATERAL SUAVE) */}
      <div
        key={activePhoto.id}
        className="relative z-10 flex-1 min-h-0 my-3 lg:my-4 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch overflow-hidden carousel-highlight-enter"
      >
        {/* LADO ESQUERDO (7 COLUNAS): IMAGEM EM ALTA RESOLUÇÃO DA OBRA / PÁGINA DO BOLETIM */}
        <div className="lg:col-span-7 h-full min-h-0 relative rounded-2xl overflow-hidden border-2 border-[#8A05BE]/70 bg-[#2D3142] shadow-[0_18px_55px_rgba(0,0,0,0.55)] flex flex-col justify-between">
          {resolvedImageSrc ? (
            <img
              src={resolvedImageSrc}
              alt={activePhoto.title}
              referrerPolicy="no-referrer"
              onError={() => {
                if (!failedPrimaryUrls[activePhoto.id]) {
                  setFailedPrimaryUrls((prev) => ({ ...prev, [activePhoto.id]: true }));
                } else {
                  setFailedFallbackUrls((prev) => ({ ...prev, [activePhoto.id]: true }));
                }
              }}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[10000ms] ease-out scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E2022] via-[#2D3142] to-[#3B1D54] flex flex-col items-center justify-center p-8 text-center">
              <i className="fa-solid fa-road-bridge text-5xl text-[#B845E8] mb-3" />
              <h3 className="font-display font-bold text-xl text-white">
                {activePhoto.title}
              </h3>
              <p className="text-sm text-[#F4F5F7]/70 mt-2 max-w-xl">
                {activePhoto.highway}
              </p>
            </div>
          )}

          {/* Soft Gradients for Depth and Bottom Caption Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022] via-[#1E2022]/25 to-black/25 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-[#1E2022]/40 pointer-events-none" />

          {/* Top Floating Badges on the Photo */}
          <div className="relative z-10 p-4 lg:p-5 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#8A05BE] text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-lg border border-white/20">
              <span>🔹 {activePhoto.highway || 'BR-319/AM'}</span>
            </span>

            <span className="px-3 py-1 rounded-xl bg-[#1E2022]/85 backdrop-blur-md border border-white/15 text-xs font-mono-tabular font-semibold text-[#F4F5F7]">
              {activePhoto.date || `Boletim • ${boletimMonth}`}
            </span>
          </div>

          {/* Bottom Visual Caption Bar inside Photo */}
          <div className="relative z-10 p-4 lg:p-5">
            <div className="bg-[#1E2022]/85 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <i className="fa-solid fa-camera text-[#B845E8] text-sm shrink-0" />
                <span className="text-xs lg:text-sm font-medium text-[#F4F5F7]/90 truncate">
                  Supervisão DNIT • Modera Engenharia • SCB BIM &amp; GIS
                </span>
              </div>
              {formattedPage && (
                <span className="px-2.5 py-1 rounded-lg bg-[#8A05BE]/30 border border-[#8A05BE] text-xs font-mono-tabular font-bold text-[#D178FF] shrink-0">
                  📖 {formattedPage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* LADO DIREITO (5 COLUNAS): CARD ESTRUTURADO DO BOLETIM MENSAL + MURAL LATERAL */}
        <div className="lg:col-span-5 h-full min-h-0 flex flex-col justify-between gap-3 lg:gap-4 overflow-hidden">
          {/* Card Estruturado Principal */}
          <div className="flex-1 min-h-0 bg-[#2D3142]/95 backdrop-blur-md rounded-2xl border-2 border-[#8A05BE] p-5 lg:p-6 xl:p-7 shadow-[0_15px_50px_rgba(138,5,190,0.28)] flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8A05BE]/15 rounded-bl-full pointer-events-none" />

            <div className="space-y-3 lg:space-y-4 min-h-0 overflow-hidden">
              {/* Tag / Badge Colorida em Roxo (#8A05BE) + Data */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#8A05BE] text-white font-display font-extrabold text-xs lg:text-sm uppercase tracking-wider shadow-md">
                  <span>🔹 {activePhoto.highway || 'FRENTE DE SERVIÇO'}</span>
                </span>

                <span className="text-xs font-mono-tabular font-semibold text-[#D178FF] bg-[#1E2022]/80 px-3 py-1 rounded-lg border border-white/10">
                  Tópico #{String(safeIndex + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Título em Destaque */}
              <h2
                className="font-display font-extrabold text-xl lg:text-2xl xl:text-3xl text-white leading-snug"
                style={{ textWrap: 'balance' }}
              >
                {activePhoto.title}
              </h2>

              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#8A05BE] to-[#D178FF]" />

              {/* Pequeno Texto Descritivo do Avanço ou Acompanhamento Realizado */}
              <p className="text-xs lg:text-sm xl:text-base text-[#F4F5F7]/90 leading-relaxed line-clamp-5">
                {activePhoto.description}
              </p>
            </div>

            {/* Rodapé do Card: Indicação da Página do Livreto */}
            <div className="pt-3 lg:pt-4 mt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#1E2022] border-2 border-[#8A05BE] shadow-md">
                <span className="text-base" aria-hidden="true">
                  📖
                </span>
                <span className="font-display font-bold text-xs lg:text-sm text-white tracking-wide">
                  {formattedPage
                    ? `Confira no Boletim - ${formattedPage}`
                    : `Confira no Boletim de ${boletimMonth}`}
                </span>
              </div>

              <span className="text-[11px] text-[#F4F5F7]/65 font-medium">
                {activePhoto.date}
              </span>
            </div>
          </div>

          {/* Mini-Índice do Mural (Quando houver 2 ou mais destaques no mês) */}
          {photos.length > 1 && (
            <div className="bg-[#2D3142]/80 backdrop-blur-md rounded-2xl border border-white/10 p-3 lg:p-3.5 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4F5F7]/65">
                  Pauta de Destaques do Boletim
                </span>
                <span className="text-[10px] font-mono-tabular text-[#D178FF]">
                  Toque para alternar
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {photos.slice(0, 4).map((item, idx) => {
                  const isCurrent = idx === safeIndex;
                  const itemPage = formatBoletimPageLabel(item.boletimPage);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectPhoto(idx)}
                      className={`text-left p-2 rounded-xl border transition-all flex items-center gap-2.5 min-w-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#8A05BE]/30 border-[#8A05BE] text-white shadow-sm'
                          : 'bg-[#1E2022]/70 border-white/10 text-[#F4F5F7]/70 hover:text-white hover:bg-[#1E2022]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-mono-tabular text-xs font-bold flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-[#8A05BE] text-white'
                            : 'bg-[#2D3142] text-[#F4F5F7]/70'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#D178FF] truncate">
                          {item.highway} {itemPage ? `· ${itemPage}` : ''}
                        </div>
                        <div className="text-xs font-semibold truncate">{item.title}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. RODAPÉ DISCRETO DO CARROSSEL ("Destaque X de Y" em cinza e roxo) */}
      <div className="relative z-10 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5 bg-[#2D3142] px-4 py-1.5 rounded-xl border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8A05BE]" />
          <span className="font-display font-bold text-xs lg:text-sm text-[#F4F5F7]/85">
            Destaque{' '}
            <strong className="text-[#D178FF] font-mono-tabular">{safeIndex + 1}</strong> de{' '}
            <strong className="text-white font-mono-tabular">{photos.length}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md mx-auto">
          {photos.map((photo, idx) => {
            const isCurrent = idx === safeIndex;
            const isPast = idx < safeIndex;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => onSelectPhoto(idx)}
                className="flex-1 h-2 rounded-full bg-[#2D3142] border border-white/10 overflow-hidden cursor-pointer transition-all"
                title={`Destaque ${idx + 1}: ${photo.title}`}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#8A05BE] to-[#D178FF] transition-all duration-300"
                  style={{
                    width: isPast ? '100%' : isCurrent ? `${progressPercent}%` : '0%'
                  }}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#F4F5F7]/70">
          <span className="hidden sm:inline font-mono-tabular">
            Exibição: {photoDurationSeconds}s por destaque
          </span>
          {photos.length > 1 && (
            <div className="flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={() =>
                  onSelectPhoto((safeIndex - 1 + photos.length) % photos.length)
                }
                className="w-7 h-7 rounded-lg bg-[#2D3142] hover:bg-[#8A05BE] text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                title="Destaque Anterior"
              >
                <i className="fa-solid fa-chevron-left text-[10px]" />
              </button>
              <button
                type="button"
                onClick={() => onSelectPhoto((safeIndex + 1) % photos.length)}
                className="w-7 h-7 rounded-lg bg-[#2D3142] hover:bg-[#8A05BE] text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                title="Próximo Destaque"
              >
                <i className="fa-solid fa-chevron-right text-[10px]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
