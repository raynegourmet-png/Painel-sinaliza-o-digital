import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SignageConfig } from '../../types/signage';
import {
  FALLBACK_BOLETIM_COVER,
  normalizeHeyzineUrl,
  resolveBoletimCoverUrl
} from '../../data/defaultConfig';

interface Slide1BoletimProps {
  config: SignageConfig;
  remainingSeconds: number;
}

export const Slide1Boletim: React.FC<Slide1BoletimProps> = ({
  config,
  remainingSeconds
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [coverFailed, setCoverFailed] = useState<boolean>(false);

  const normalizedUrl = normalizeHeyzineUrl(config.boletimUrl);
  const resolvedCoverUrl = resolveBoletimCoverUrl(
    config.boletimUrl,
    config.boletimCoverUrl
  );

  // Reset cover error state whenever URL or custom cover changes
  useEffect(() => {
    setCoverFailed(false);
  }, [resolvedCoverUrl]);

  // Dynamically regenerate QR Code whenever Heyzine URL changes
  useEffect(() => {
    let active = true;
    if (!normalizedUrl) {
      setQrDataUrl('');
      return;
    }
    QRCode.toDataURL(normalizedUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: '#1E2022',
        light: '#FFFFFF'
      }
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });

    return () => {
      active = false;
    };
  }, [normalizedUrl]);

  const currentMonthFallback = new Date().toLocaleDateString('pt-BR', {
    month: 'long'
  });
  const displayMonth =
    config.boletimMonth && config.boletimMonth.trim().length > 0
      ? config.boletimMonth.trim()
      : currentMonthFallback.charAt(0).toUpperCase() + currentMonthFallback.slice(1);

  const activeCoverSrc = coverFailed ? FALLBACK_BOLETIM_COVER : resolvedCoverUrl;

  return (
    <div className="w-full h-full min-h-0 relative overflow-hidden bg-gradient-to-br from-[#1E2022] via-[#232634] to-[#1E2022] p-4 lg:p-8 flex items-center justify-center slide-transition-enter">
      {/* Subtle decorative background geometry */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="480" cy="540" r="460" stroke="#8A05BE" strokeOpacity="0.4" strokeWidth="2" />
        <polygon points="1450,0 1920,0 1920,1080 1200,1080" fill="#8A05BE" fillOpacity="0.08" />
      </svg>

      <div className="relative z-10 w-full max-w-7xl h-full min-h-0 grid grid-cols-12 gap-6 lg:gap-10 items-center">
        {/* COLUNA DA ESQUERDA (55% a 60% da largura -> 7 de 12 colunas): CAPA EXPANDIDA EM ALTA RESOLUÇÃO */}
        <div className="col-span-12 lg:col-span-7 h-full min-h-0 flex flex-col items-center justify-center overflow-hidden py-1">
          <div className="relative h-full max-h-full w-full flex items-center justify-center min-h-0">
            <div className="relative h-full max-h-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#8A05BE]/80 shadow-[0_18px_60px_rgba(138,5,190,0.5)] bg-[#2D3142] flex flex-col justify-between">
              <img
                src={activeCoverSrc}
                alt={`Capa do Boletim Mensal de ${displayMonth} — Consórcio Matupiri`}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (!coverFailed) setCoverFailed(true);
                }}
                className="w-full h-full object-cover object-center"
              />

              {/* Top & Bottom Institutional Cover Overlay Frame */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022]/90 via-transparent to-[#1E2022]/55 pointer-events-none" />

              <div className="absolute top-0 inset-x-0 p-4 lg:p-5 flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-lg bg-[#8A05BE] text-white font-display font-bold text-xs uppercase tracking-wider shadow-md">
                  Boletim Mensal • {displayMonth}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#1E2022]/85 text-[#F4F5F7] font-mono-tabular text-xs border border-white/15">
                  {config.boletimEdition}
                </span>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-5 lg:p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-[#D178FF] mb-1">
                  Consórcio Matupiri • Modera Engenharia • SCB BIM &amp; GIS
                </div>
                <h3 className="font-display font-extrabold text-lg lg:text-2xl text-white leading-tight">
                  {config.boletimTitle}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA (40% a 45% da largura -> 5 de 12 colunas): QR CODE EM GRANDE ESCALA E CHAMADA */}
        <div className="col-span-12 lg:col-span-5 h-full min-h-0 flex flex-col justify-center">
          <div className="bg-[#2D3142]/90 backdrop-blur-md rounded-3xl border-2 border-[#8A05BE] p-6 lg:p-8 xl:p-10 shadow-[0_18px_55px_rgba(138,5,190,0.35)] flex flex-col items-center text-center">
            {/* Top Kicker */}
            <div className="flex items-center gap-2 text-xs lg:text-sm font-bold uppercase tracking-widest text-[#D178FF] mb-3">
              <i className="fa-solid fa-qrcode" />
              <span>Publicação Digital • {remainingSeconds}s</span>
            </div>

            {/* Headline */}
            <h2
              className="font-display font-extrabold text-2xl lg:text-3xl xl:text-4xl text-white leading-tight mb-3"
              style={{ textWrap: 'balance' }}
            >
              Acesse na íntegra o Boletim Mensal de{' '}
              <span className="text-[#D178FF] underline decoration-[#8A05BE] decoration-4 underline-offset-4">
                {displayMonth}
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm lg:text-base text-[#F4F5F7]/85 leading-relaxed mb-6 max-w-md">
              Aponte a câmera do celular para ficar por dentro de todas as novidades do{' '}
              <strong className="text-white">Consórcio Matupiri</strong>.
            </p>

            {/* Dynamic Large QR Code Box */}
            <div className="bg-white p-4 lg:p-5 rounded-2xl shadow-[0_0_40px_rgba(138,5,190,0.55)] border-4 border-[#8A05BE] mb-5">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code para o Boletim Mensal de ${displayMonth}`}
                  referrerPolicy="no-referrer"
                  className="w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-contain"
                />
              ) : (
                <div className="w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 flex items-center justify-center text-[#1E2022] text-sm font-semibold">
                  Gerando QR Code...
                </div>
              )}
            </div>

            {/* Footer instruction inside right panel */}
            <div className="flex items-center gap-2.5 text-xs lg:text-sm font-semibold text-white/90">
              <i className="fa-solid fa-mobile-screen-button text-[#D178FF] text-base" />
              <span>Leitura rápida no seu smartphone • Sem necessidade de aplicativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
