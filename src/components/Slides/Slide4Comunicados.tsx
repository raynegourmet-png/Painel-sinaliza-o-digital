import React from 'react';
import { ImportantEvent, SignageConfig } from '../../types/signage';
import { DynamicVideoBackground } from '../DynamicVideoBackground';

interface Slide4ComunicadosProps {
  events: ImportantEvent[];
  config: SignageConfig;
}

export const Slide4Comunicados: React.FC<Slide4ComunicadosProps> = ({
  events,
  config
}) => {
  if (!events || events.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: ImportantEvent['category']) => {
    switch (category) {
      case 'Curso & Capacitação':
        return 'fa-solid fa-graduation-cap';
      case 'Segurança & QSMS':
        return 'fa-solid fa-shield-halved';
      case 'Gestão & BIM/GIS':
        return 'fa-solid fa-cubes';
      case 'Institucional DNIT':
      default:
        return 'fa-solid fa-building-columns';
    }
  };

  return (
    <div className="w-full h-full min-h-0 relative bg-[#1E2022] p-3 lg:p-5 flex flex-col justify-between gap-3 overflow-hidden slide-transition-enter">
      {/* Dynamic Video / Animated Highway Background with Glassmorphism (backdrop-filter: blur(10px)) */}
      <DynamicVideoBackground config={config} />

      {/* Top Section Header */}
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 pb-3 border-b border-white/10 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#B845E8] mb-1">
            <i className="fa-solid fa-bullhorn" />
            <span>Governança, Treinamentos &amp; QSMS</span>
          </div>
          <h2 className="font-display font-extrabold text-xl lg:text-2xl xl:text-3xl text-white tracking-tight">
            Datas Importantes e Comunicados Internos
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#F4F5F7]/75">
          <span>BR-319/AM</span>
          <span aria-hidden="true">·</span>
          <span>BR-230/AM</span>
          <span aria-hidden="true">·</span>
          <span>Sede Manaus &amp; Núcleo BIM/GIS</span>
        </div>
      </div>

      {/* Main Events & Notices Grid (Glassmorphism cards) */}
      <div className="relative z-10 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3.5 lg:gap-4 content-stretch overflow-hidden">
        {events.slice(0, 4).map((evt, index) => (
          <div
            key={evt.id}
            className={`rounded-2xl p-4 lg:p-5 flex flex-col justify-between min-h-0 overflow-hidden backdrop-blur-md transition-all ${
              evt.highlight
                ? 'bg-[#2D3142]/85 border-2 border-[#8A05BE] shadow-xl'
                : 'bg-[#2D3142]/75 border border-white/10 shadow-lg'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              {/* Metadata Row */}
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#D178FF] truncate">
                  <i className={getCategoryIcon(evt.category)} />
                  <span>{evt.category}</span>
                  {evt.highlight && (
                    <>
                      <span aria-hidden="true" className="text-white/30">·</span>
                      <span className="text-white font-bold uppercase tracking-wider text-[11px]">
                        Destaque Prioritário
                      </span>
                    </>
                  )}
                </div>

                <span className="font-mono-tabular text-xs font-semibold text-[#F4F5F7]/80 shrink-0">
                  0{index + 1}
                </span>
              </div>

              {/* Event Title */}
              <h3
                className="font-display font-bold text-base lg:text-lg xl:text-xl text-white leading-snug mb-1.5 line-clamp-2"
                style={{ textWrap: 'balance' }}
              >
                {evt.title}
              </h3>

              {/* Description */}
              <p className="text-xs lg:text-sm text-[#F4F5F7]/80 leading-relaxed line-clamp-2 xl:line-clamp-3">
                {evt.description}
              </p>
            </div>

            {/* Bottom Date & Schedule Bar */}
            <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 text-white font-medium">
                <i className="fa-regular fa-calendar-check text-[#B845E8]" />
                <span className="font-mono-tabular">{evt.date}</span>
              </div>
              <span className="text-[#F4F5F7]/60">
                Consórcio Matupiri
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Institutional Safety & Compliance Callout */}
      <div className="relative z-10 bg-[#F4F5F7] text-[#1E2022] rounded-xl px-4 py-2.5 lg:px-5 lg:py-3 flex flex-wrap items-center justify-between gap-3 shadow-md shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-[#8A05BE] text-white flex items-center justify-center shrink-0">
            <i className="fa-solid fa-helmet-safety text-sm lg:text-base" />
          </div>
          <div className="min-w-0">
            <h4 className="font-display font-bold text-xs lg:text-sm text-[#1E2022] truncate">
              Diretriz Permanente de Segurança Viária e Operacional (QSMS)
            </h4>
            <p className="text-[11px] lg:text-xs text-[#2D3142]/80 truncate">
              Confira diariamente os EPIs, rádio comunicador e checklist de viaturas 4x4 antes de ingressar nas frentes da BR-319/AM e BR-230/AM.
            </p>
          </div>
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-[#8A05BE] shrink-0">
          Meta Zero Acidente
        </div>
      </div>
    </div>
  );
};
