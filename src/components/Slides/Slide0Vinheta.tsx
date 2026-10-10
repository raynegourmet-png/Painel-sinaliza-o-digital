import React, { useEffect, useState } from 'react';
import { SignageConfig } from '../../types/signage';

interface Slide0VinhetaProps {
  config: SignageConfig;
  remainingSeconds: number;
  totalSeconds: number;
}

export const Slide0Vinheta: React.FC<Slide0VinhetaProps> = ({
  config,
  remainingSeconds,
  totalSeconds
}) => {
  const [videoError, setVideoError] = useState<boolean>(false);
  const [fadeOutStage, setFadeOutStage] = useState<boolean>(false);

  const hasCustomVideo = Boolean(
    config.vignetteVideoUrl && config.vignetteVideoUrl.trim().length > 0 && !videoError
  );

  // Trigger camera zoom into the highway bar in the last 2 seconds
  const isZoomingHighway = remainingSeconds <= 2;

  // Trigger smooth fade-out transparency in the final ~650ms as the camera enters the highway
  useEffect(() => {
    if (remainingSeconds === 1) {
      const timer = setTimeout(() => {
        setFadeOutStage(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setFadeOutStage(false);
    }
  }, [remainingSeconds]);

  const progressPercentage =
    totalSeconds > 0
      ? Math.min(100, Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100))
      : 100;

  return (
    <div
      className={`w-full h-full min-h-0 relative overflow-hidden bg-[#1E2022] flex flex-col justify-between items-center select-none slide-transition-enter transition-opacity duration-500 ${
        fadeOutStage ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Main Zoomable Stage Targeting the Vectorized Highway Bar at the Bottom of the Logo */}
      <div
        className="relative flex-1 w-full h-full flex flex-col items-center justify-center overflow-hidden transition-transform duration-[1850ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transformOrigin: '50% 59.5%',
          transform: isZoomingHighway ? 'scale(7.2) translateY(-2%)' : 'scale(1) translateY(0)'
        }}
      >
        {/* Subtle radial purple ambient glow on dark graphite canvas */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 55%, rgba(138, 5, 190, 0.25) 0%, rgba(30, 32, 34, 0.98) 70%)'
          }}
        />

        {hasCustomVideo ? (
          <video
            src={config.vignetteVideoUrl}
            autoPlay
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-contain max-w-6xl max-h-[75vh]"
          />
        ) : (
          /* High-Definition Animated Vector Reproduction of the Official Consórcio Matupiri Vinheta */
          <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center justify-center">
            <div className="w-full bg-[#F4F5F7] rounded-3xl px-8 py-10 lg:px-14 lg:py-14 shadow-[0_25px_80px_rgba(138,5,190,0.45)] border-2 border-[#8A05BE]/60">
              <svg
                viewBox="0 0 860 220"
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="matupiriVinhetaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9C14D4" />
                    <stop offset="50%" stopColor="#680E8A" />
                    <stop offset="100%" stopColor="#4B0A5E" />
                  </linearGradient>
                  <clipPath id="highwayBarClip">
                    <rect x="16" y="154" width="828" height="26" rx="13" />
                  </clipPath>
                </defs>

                {/* Top line: CONSÓRCIO */}
                <text
                  x="52"
                  y="38"
                  fill="#680E8A"
                  fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif"
                  fontWeight="700"
                  fontSize="36"
                  letterSpacing="3.5"
                >
                  CONSÓRCIO
                </text>

                {/* Main wordmark: Matupiri */}
                <g transform="translate(36, 138) scale(1.17, 1)">
                  <text
                    x="0"
                    y="0"
                    fill="url(#matupiriVinhetaGrad)"
                    fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif"
                    fontWeight="800"
                    fontSize="118"
                    letterSpacing="1"
                  >
                    Matupiri
                  </text>
                </g>

                {/* Stem of 'p' connecting seamlessly into the highway bar */}
                <rect x="527" y="132" width="25" height="36" fill="#5A0B73" />

                {/* Horizontal Highway Bar with Moving Lane Markings & Vehicle */}
                <rect x="16" y="154" width="828" height="26" rx="13" fill="url(#matupiriVinhetaGrad)" />

                <g clipPath="url(#highwayBarClip)">
                  {/* Moving Dashed Center Line */}
                  <line
                    x1="-80"
                    y1="167"
                    x2="920"
                    y2="167"
                    stroke="#FFFFFF"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray="16 20"
                    className="animate-highway-dashes"
                  />

                  {/* Animated Top-View Vehicle Driving Along the Highway */}
                  <g className="animate-highway-vehicle">
                    <polygon
                      points="72,163 102,159 102,175 72,171"
                      fill="#FFFFFF"
                      fillOpacity="0.45"
                    />
                    <rect x="36" y="160.5" width="36" height="13" rx="5" fill="#FFFFFF" />
                    <rect x="56" y="162.5" width="9" height="9" rx="2" fill="#680E8A" />
                  </g>
                </g>

                {/* Bottom Subtitle: MODERA ENGENHARIA • SCB BIM & GIS */}
                <text
                  x="430"
                  y="213"
                  textAnchor="middle"
                  fill="#5A0B73"
                  fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif"
                  fontWeight="600"
                  fontSize="31"
                  letterSpacing="2.2"
                >
                  MODERA ENGENHARIA • SCB BIM &amp; GIS
                </text>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stylized Phrase in Purple Glow ("Trafegue conosco ⮕") */}
      <div
        className={`relative z-20 pb-6 lg:pb-8 px-6 text-center transition-opacity duration-500 ${
          isZoomingHighway ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-[#1E2022]/90 border border-[#8A05BE]/60 shadow-[0_0_35px_rgba(138,5,190,0.45)]">
          <i className="fa-solid fa-road text-[#D178FF] text-lg" />
          <p className="font-display font-extrabold text-2xl lg:text-3xl xl:text-4xl text-white tracking-wide purple-glow-text">
            Trafegue conosco ⮕
          </p>
        </div>
      </div>

      {/* Discreet Purple Progress Bar at the Bottom of the Vinheta */}
      <div className="relative z-20 w-full h-1.5 bg-[#2D3142] shrink-0 overflow-hidden">
        <div
          className="h-full bg-[#8A05BE] transition-all duration-500 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
