import React from 'react';

interface MatupiriLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light-badge' | 'dark-adaptive';
  customLogoUrl?: string;
}

/**
 * Reprodução vetorial fiel (SVG) da logomarca oficial do CONSÓRCIO MATUPIRI
 * (MODERA ENGENHARIA • SCB BIM & GIS), idêntica à arte enviada, com a haste do "p"
 * integrada à faixa de rodovia tracejada e fundo 100% limpo (sem quadriculado).
 */
export const MatupiriLogo: React.FC<MatupiriLogoProps> = ({
  size = 'md',
  variant = 'light-badge',
  customLogoUrl
}) => {
  const sizeClasses = {
    sm: 'h-9',
    md: 'h-12 lg:h-13',
    lg: 'h-16 lg:h-20',
    xl: 'h-24 lg:h-28 xl:h-32'
  }[size];

  if (customLogoUrl && customLogoUrl.trim().length > 0) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl px-3 py-1.5 ${
          variant === 'light-badge' ? 'bg-[#F4F5F7] shadow-md border border-white/20' : ''
        }`}
      >
        <img
          src={customLogoUrl}
          alt="Consórcio Matupiri — Modera Engenharia • SCB BIM & GIS"
          referrerPolicy="no-referrer"
          className={`${sizeClasses} w-auto object-contain select-none`}
        />
      </div>
    );
  }

  // Official Deep Purple from LOGO_MATUPIRI.jpg (#4B0A5E) on light plate, or crisp White/Purple on dark
  const isLightBadge = variant === 'light-badge';
  const primaryColor = isLightBadge ? '#4B0A5E' : '#FFFFFF';
  const roadColor = isLightBadge ? '#4B0A5E' : '#8A05BE';
  const dashColor = '#F4F5F7';
  const subTextColor = isLightBadge ? '#4B0A5E' : '#E2C6F2';

  return (
    <div
      className={`inline-flex items-center justify-center select-none shrink-0 ${
        isLightBadge
          ? 'bg-[#F4F5F7] px-3.5 py-1.5 rounded-xl shadow-md border border-white/25'
          : ''
      }`}
    >
      <svg
        viewBox="0 0 860 220"
        className={`${sizeClasses} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Consórcio Matupiri — Modera Engenharia • SCB BIM & GIS"
      >
        {/* Top line: CONSÓRCIO */}
        <text
          x="52"
          y="38"
          fill={primaryColor}
          fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="37"
          letterSpacing="3.5"
        >
          CONSÓRCIO
        </text>

        {/* Main wordmark: Matupiri (stretched horizontally to match official logo proportions) */}
        <g transform="translate(36, 138) scale(1.17, 1)">
          <text
            x="0"
            y="0"
            fill={primaryColor}
            fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif"
            fontWeight="800"
            fontSize="118"
            letterSpacing="1"
          >
            Matupiri
          </text>
        </g>

        {/* Connector block ensuring the descender of 'p' merges seamlessly into the highway bar */}
        <rect x="527" y="132" width="25" height="36" fill={roadColor} />

        {/* Horizontal Highway Bar with Rounded Ends */}
        <rect x="16" y="156" width="828" height="22" rx="11" fill={roadColor} />

        {/* White Dashed Highway Center Line */}
        <line
          x1="42"
          y1="167"
          x2="824"
          y2="167"
          stroke={dashColor}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="16 20"
        />

        {/* Bottom Subtitle: MODERA ENGENHARIA • SCB BIM & GIS */}
        <text
          x="430"
          y="212"
          textAnchor="middle"
          fill={subTextColor}
          fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif"
          fontWeight="700"
          fontSize="31.5"
          letterSpacing="2.2"
        >
          MODERA ENGENHARIA • SCB BIM &amp; GIS
        </text>
      </svg>
    </div>
  );
};
