import React, { useState } from 'react';
import { SignageConfig } from '../types/signage';

interface DynamicVideoBackgroundProps {
  config: SignageConfig;
}

/**
 * Renders the looping video or animated highway background with a frosted glass
 * (Glassmorphism: backdrop-filter: blur(10px)) overlay for the Clock and Announcements slides.
 */
export const DynamicVideoBackground: React.FC<DynamicVideoBackgroundProps> = ({
  config
}) => {
  const [videoFailed, setVideoFailed] = useState(false);

  if (!config.vignetteAsBackground) {
    return null;
  }

  const hasCustomVideo = Boolean(
    config.vignetteVideoUrl && config.vignetteVideoUrl.trim().length > 0 && !videoFailed
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hasCustomVideo ? (
        <video
          src={config.vignetteVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          className="w-full h-full object-cover opacity-25 scale-105"
        />
      ) : (
        /* Animated Vector Highway Loop Background */
        <div className="w-full h-full flex items-center justify-center opacity-15 scale-110">
          <svg
            viewBox="0 0 860 220"
            className="w-4/5 h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="52"
              y="38"
              fill="#B845E8"
              fontFamily="'Montserrat', sans-serif"
              fontWeight="800"
              fontSize="36"
              letterSpacing="3.5"
            >
              CONSÓRCIO
            </text>
            <g transform="translate(36, 138) scale(1.17, 1)">
              <text
                x="0"
                y="0"
                fill="#FFFFFF"
                fontFamily="'Montserrat', sans-serif"
                fontWeight="800"
                fontSize="118"
                letterSpacing="1"
              >
                Matupiri
              </text>
            </g>
            <rect x="16" y="154" width="828" height="26" rx="13" fill="#8A05BE" />
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
          </svg>
        </div>
      )}

      {/* Glassmorphism Frosted Layer (backdrop-filter: blur(10px)) */}
      <div
        className="absolute inset-0 bg-[#1E2022]/80"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      />
    </div>
  );
};
