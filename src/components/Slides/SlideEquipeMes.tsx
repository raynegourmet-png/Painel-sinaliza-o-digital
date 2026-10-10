import React, { useState } from 'react';
import { SignageConfig, TeamMember } from '../../types/signage';

interface SlideEquipeMesProps {
  teamMembers: TeamMember[];
  config?: SignageConfig;
}

function getInitials(name: string): string {
  const parts = name
    .replace(/^(Eng\.|Arq\.|Téc\.|Dr\.|Dra\.|Engenheiro|Técnico)\s+/i, '')
    .trim()
    .split(/\s+/);
  if (parts.length === 0) return 'CM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const SlideEquipeMes: React.FC<SlideEquipeMesProps> = ({
  teamMembers,
  config
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  const useGlassBackground = config?.vignetteAsBackground !== false;
  const hasVideoBg = Boolean(
    useGlassBackground && config?.vignetteVideoUrl && config.vignetteVideoUrl.trim().length > 0
  );

  const isSingle = teamMembers.length === 1;

  return (
    <div className="w-full h-full min-h-0 relative flex flex-col justify-between p-4 lg:p-6 bg-[#1E2022] overflow-hidden slide-transition-enter">
      {/* Optional Dynamic Video Background + Frosted Glass Layer */}
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

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: useGlassBackground ? 'blur(10px)' : 'none',
          background:
            'radial-gradient(circle at 20% 20%, rgba(138, 5, 190, 0.2) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(123, 31, 162, 0.16) 0%, transparent 50%)'
        }}
      />

      {/* 1. CABEÇALHO INSTITUCIONAL — CONHEÇA A EQUIPE DO MÊS */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-3 lg:pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-[#8A05BE] to-[#7B1FA2] text-white flex items-center justify-center shadow-lg shadow-[#8A05BE]/30">
            <i className="fa-solid fa-id-badge text-lg lg:text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D178FF]">
                Valorização &amp; Reconhecimento Profissional
              </span>
              <span className="text-white/25">•</span>
              <span className="text-[11px] text-[#F4F5F7]/75 font-medium">
                MODERA ENGENHARIA • SCB BIM &amp; GIS
              </span>
            </div>
            <h1 className="font-display font-extrabold text-xl lg:text-2xl xl:text-3xl text-white tracking-tight leading-tight">
              Conheça a Equipe do Mês — Consórcio Matupiri
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#2D3142]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#8A05BE]/50">
          <i className="fa-solid fa-award text-[#D178FF]" />
          <span className="text-xs font-semibold text-white">
            Destaques de Campo &amp; Engenharia ({teamMembers.length})
          </span>
        </div>
      </div>

      {/* 2. CARDS DE PERFIL INSTITUCIONAL DOS COLABORADORES EM DESTAQUE */}
      <div className="relative z-10 flex-1 min-h-0 my-3 lg:my-4 flex items-center justify-center overflow-hidden">
        {isSingle ? (
          <div className="w-full max-w-5xl h-full max-h-[520px] bg-[#2D3142]/95 backdrop-blur-md rounded-3xl border-2 border-[#8A05BE] shadow-[0_20px_65px_rgba(138,5,190,0.35)] p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center overflow-hidden">
            <div className="lg:col-span-5 h-full min-h-0 flex items-center justify-center overflow-hidden">
              <div className="relative h-full max-h-[420px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#8A05BE] bg-[#16181A] shadow-xl">
                {teamMembers[0].photoUrl && !failedImages[teamMembers[0].id] ? (
                  <img
                    src={teamMembers[0].photoUrl}
                    alt={teamMembers[0].name}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [teamMembers[0].id]: true }))
                    }
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8A05BE] to-[#2D3142] text-white font-display font-extrabold text-5xl">
                    {getInitials(teamMembers[0].name)}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-lg bg-[#8A05BE] text-white font-display font-extrabold text-xs uppercase tracking-wider">
                  🔹 {teamMembers[0].highway}
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#1E2022] text-xs font-semibold text-[#D178FF] border border-white/10">
                  {teamMembers[0].unit}
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl lg:text-4xl text-white leading-tight">
                {teamMembers[0].name}
              </h2>

              <div className="text-base lg:text-xl font-semibold text-[#D178FF]">
                {teamMembers[0].role}
              </div>

              <div className="bg-[#1E2022]/90 rounded-2xl p-4 lg:p-5 border-l-4 border-[#8A05BE]">
                <p className="text-sm lg:text-base text-[#F4F5F7]/90 leading-relaxed italic">
                  “{teamMembers[0].recognitionMessage}”
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`w-full h-full min-h-0 grid gap-5 lg:gap-6 items-stretch overflow-hidden ${
              teamMembers.length === 2
                ? 'grid-cols-1 lg:grid-cols-2 max-w-6xl'
                : 'grid-cols-1 md:grid-cols-3 max-w-7xl'
            }`}
          >
            {teamMembers.slice(0, 3).map((member) => {
              const showPhoto = Boolean(member.photoUrl && !failedImages[member.id]);
              return (
                <div
                  key={member.id}
                  className="h-full min-h-0 bg-[#2D3142]/95 backdrop-blur-md rounded-2xl border-2 border-[#8A05BE]/80 shadow-[0_16px_45px_rgba(0,0,0,0.45)] overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch"
                >
                  {/* Portrait Column */}
                  <div className="sm:col-span-5 relative min-h-0 h-full overflow-hidden bg-[#16181A] border-r border-white/10">
                    {showPhoto ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [member.id]: true }))
                        }
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8A05BE]/40 to-[#1E2022]">
                        <div className="w-24 h-24 rounded-2xl bg-[#8A05BE] text-white font-display font-extrabold text-3xl flex items-center justify-center">
                          {getInitials(member.name)}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1E2022] to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#8A05BE] text-white font-display font-bold text-[10px] uppercase tracking-wider shadow-md truncate max-w-full">
                        🔹 {member.highway}
                      </span>
                    </div>
                  </div>

                  {/* Profile Details & Recognition Column */}
                  <div className="sm:col-span-7 p-4 lg:p-6 flex flex-col justify-between min-h-0 overflow-hidden">
                    <div className="space-y-2.5 min-h-0 overflow-hidden">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1E2022] border border-[#8A05BE]/50 text-[10px] font-bold uppercase tracking-wider text-[#D178FF]">
                        <i className="fa-solid fa-helmet-safety" />
                        <span>Destaque da Equipe</span>
                      </div>

                      <h2 className="font-display font-extrabold text-xl lg:text-2xl text-white leading-snug">
                        {member.name}
                      </h2>

                      <div className="text-xs lg:text-sm font-bold text-[#D178FF]">
                        {member.role}
                      </div>

                      <div className="text-xs text-[#F4F5F7]/70 flex items-center gap-1.5">
                        <i className="fa-solid fa-road text-[#B845E8]" />
                        <span className="truncate">{member.highway}</span>
                      </div>

                      <div className="pt-2">
                        <div className="bg-[#1E2022]/90 rounded-xl p-3.5 border-l-4 border-[#8A05BE]">
                          <p className="text-xs lg:text-sm text-[#F4F5F7]/90 leading-relaxed italic line-clamp-4">
                            “{member.recognitionMessage}”
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F4F5F7]/65 shrink-0">
                      <span className="truncate">{member.unit}</span>
                      <span className="text-[#D178FF] font-semibold shrink-0">
                        ★ Reconhecimento Matupiri
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. RODAPÉ DE RECONHECIMENTO INSTITUCIONAL */}
      <div className="relative z-10 bg-[#2D3142]/90 border border-[#8A05BE]/40 rounded-xl px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 text-xs lg:text-sm text-[#F4F5F7]/90">
          <i className="fa-solid fa-handshake-angle text-[#D178FF]" />
          <span>
            Nosso reconhecimento aos profissionais que constroem a excelência da supervisão rodoviária na{' '}
            <strong className="text-white">BR-319/AM</strong> e{' '}
            <strong className="text-white">BR-230/AM</strong>.
          </span>
        </div>
        <span className="text-xs font-display font-bold uppercase tracking-wider text-[#D178FF]">
          Consórcio Matupiri
        </span>
      </div>
    </div>
  );
};
