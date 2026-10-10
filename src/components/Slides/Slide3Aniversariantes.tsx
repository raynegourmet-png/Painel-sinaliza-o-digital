import React, { useState } from 'react';
import { BirthdayPerson } from '../../types/signage';

interface Slide3AniversariantesProps {
  birthdays: BirthdayPerson[];
  currentDate: Date;
}

export const Slide3Aniversariantes: React.FC<Slide3AniversariantesProps> = ({
  birthdays,
  currentDate
}) => {
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});

  // REGRA OBRIGATÓRIA: Caso não haja nenhum aniversariante cadastrado, omitir completamente
  if (!birthdays || birthdays.length === 0) {
    return null;
  }

  const currentMonthName = currentDate.toLocaleDateString('pt-BR', {
    month: 'long'
  });
  const todayFormatted = `${String(currentDate.getDate()).padStart(2, '0')}/${String(
    currentDate.getMonth() + 1
  ).padStart(2, '0')}`;

  const getInitials = (name: string) => {
    const clean = name.replace(/^(Eng\.|Arq\.|Téc\.|Dr\.|Dra\.)\s+/i, '');
    const parts = clean.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const count = birthdays.length;

  return (
    <div className="w-full h-full min-h-0 relative overflow-hidden bg-[#1E2022] p-4 lg:p-6 flex flex-col justify-between slide-transition-enter">
      {/* Corporate Geometric Festive Background SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="1520,0 1920,0 1920,420" fill="#8A05BE" fillOpacity="0.28" />
        <polygon points="1680,0 1920,0 1920,680" fill="#7B1FA2" fillOpacity="0.18" />
        <polygon points="0,780 380,1080 0,1080" fill="#8A05BE" fillOpacity="0.22" />
        <circle cx="1760" cy="200" r="180" stroke="#8A05BE" strokeOpacity="0.35" strokeWidth="2" />
        <circle cx="160" cy="880" r="220" stroke="#8A05BE" strokeOpacity="0.25" strokeWidth="2" />
      </svg>

      {/* Top Header Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#8A05BE] text-white flex items-center justify-center text-xl shadow-lg shrink-0">
            <i className="fa-solid fa-cake-candles" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#D178FF]">
              Valorização de Pessoas • <span className="capitalize">{currentMonthName}</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-white tracking-tight">
              Aniversariantes do Mês — Consórcio Matupiri
            </h2>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-[#2D3142] px-4 py-2 rounded-xl border border-[#8A05BE]/40">
          <i className="fa-solid fa-champagne-glasses text-[#D178FF]" />
          <span className="text-xs lg:text-sm font-medium text-[#F4F5F7]">
            Parabéns ao nosso time de excelência!
          </span>
        </div>
      </div>

      {/* CASO 1: APENAS 1 ANIVERSARIANTE -> CARD CENTRALIZADO EM DESTAQUE COM FOTO GRANDE */}
      {count === 1 && (
        <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center py-3">
          {(() => {
            const person = birthdays[0];
            const isToday = person.day.trim() === todayFormatted;
            const hasPhoto = Boolean(person.photoUrl && !failedPhotos[person.id]);

            return (
              <div className="w-full max-w-5xl h-full max-h-[520px] bg-gradient-to-br from-[#2D3142] via-[#252836] to-[#32124A] rounded-3xl border-2 border-[#8A05BE] shadow-[0_20px_60px_rgba(138,5,190,0.4)] p-6 lg:p-8 grid grid-cols-12 gap-6 lg:gap-10 items-center overflow-hidden">
                {/* Large Portrait Photo on Left (5 Columns) */}
                <div className="col-span-12 md:col-span-5 h-full min-h-0 flex items-center justify-center">
                  <div className="relative h-full max-h-[420px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#8A05BE] shadow-2xl bg-[#1E2022] flex items-center justify-center">
                    {hasPhoto ? (
                      <img
                        src={person.photoUrl}
                        alt={person.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedPhotos((prev) => ({ ...prev, [person.id]: true }))
                        }
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#8A05BE] to-[#4B0A5E] text-white p-6">
                        <span className="font-display font-extrabold text-6xl">
                          {getInitials(person.name)}
                        </span>
                      </div>
                    )}

                    {/* Date Badge on Photo */}
                    <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-xl bg-[#8A05BE] text-white font-mono-tabular font-extrabold text-base shadow-lg border border-white/25">
                      <i className="fa-solid fa-calendar-day mr-1.5 text-xs" />
                      {person.day}
                    </div>
                  </div>
                </div>

                {/* Celebratory Details on Right (7 Columns) */}
                <div className="col-span-12 md:col-span-7 flex flex-col justify-center text-left space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs lg:text-sm font-bold uppercase tracking-widest text-[#D178FF]">
                    <i className="fa-solid fa-star" />
                    <span>{isToday ? 'Feliz Aniversário Hoje!' : 'Destaque do Mês'}</span>
                  </div>

                  <h3 className="font-display font-extrabold text-3xl lg:text-4xl xl:text-5xl text-white leading-tight">
                    {person.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-base lg:text-xl font-semibold text-[#D178FF]">
                    <span>{person.role}</span>
                    {person.unit && (
                      <>
                        <span className="text-white/30">·</span>
                        <span className="text-[#F4F5F7]/80 font-normal text-sm lg:text-base">
                          {person.unit}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/15">
                    <p className="text-sm lg:text-base xl:text-lg text-[#F4F5F7]/90 leading-relaxed italic">
                      “O <strong className="text-white">Consórcio Matupiri</strong> parabeniza você por mais um ano de vida! Agradecemos pela dedicação, competência e parceria diária na construção de uma engenharia de excelência. Desejamos muita saúde, conquistas e sucesso!”
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-[#F4F5F7]/60">
                    <span>Modera Engenharia</span>
                    <span>•</span>
                    <span>SCB BIM &amp; GIS</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* CASO 2: 2 OU MAIS ANIVERSARIANTES -> LAYOUT "ESCALAÇÃO / CARDS SIDE-BY-SIDE" */}
      {count >= 2 && (
        <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center py-2 overflow-hidden">
          <div
            className={`w-full h-full max-h-[540px] grid gap-5 lg:gap-7 items-stretch justify-center ${
              count === 2
                ? 'max-w-4xl grid-cols-1 sm:grid-cols-2'
                : count === 3
                ? 'max-w-6xl grid-cols-1 sm:grid-cols-3'
                : 'max-w-7xl grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {birthdays.slice(0, 4).map((person) => {
              const isToday = person.day.trim() === todayFormatted;
              const hasPhoto = Boolean(person.photoUrl && !failedPhotos[person.id]);

              return (
                <div
                  key={person.id}
                  className={`h-full min-h-0 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-2xl ${
                    isToday
                      ? 'bg-[#2D3142] border-2 border-[#D178FF] shadow-[0_10px_40px_rgba(138,5,190,0.5)]'
                      : 'bg-[#2D3142] border-2 border-[#8A05BE]/70'
                  }`}
                >
                  {/* Top Photo Container (Escalação Player Style) */}
                  <div className="relative flex-1 min-h-0 w-full bg-[#16181A] overflow-hidden">
                    {hasPhoto ? (
                      <img
                        src={person.photoUrl}
                        alt={person.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedPhotos((prev) => ({ ...prev, [person.id]: true }))
                        }
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D3142] via-[#3B1254] to-[#1E2022]">
                        <div className="w-24 h-24 rounded-2xl bg-[#8A05BE] text-white font-display font-extrabold text-3xl flex items-center justify-center shadow-lg border border-white/20">
                          {getInitials(person.name)}
                        </div>
                      </div>
                    )}

                    {/* Gradient Scrim at Bottom of Photo */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1E2022] to-transparent pointer-events-none" />

                    {/* Day Badge in Top Right Corner */}
                    <div
                      className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl font-mono-tabular font-extrabold text-sm lg:text-base shadow-lg border ${
                        isToday
                          ? 'bg-[#D178FF] text-[#1E2022] border-white'
                          : 'bg-[#8A05BE] text-white border-white/20'
                      }`}
                    >
                      <i className="fa-solid fa-cake-candles mr-1.5 text-xs" />
                      <span>{person.day}</span>
                    </div>

                    {isToday && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#1E2022]/90 text-[#D178FF] font-display font-bold text-[11px] uppercase tracking-wider border border-[#D178FF]/40">
                        Aniversariante de Hoje!
                      </div>
                    )}
                  </div>

                  {/* Bottom Nameplate (Nome, Cargo/Setor e Unidade) */}
                  <div className="bg-[#1E2022] border-t-2 border-[#8A05BE] p-4 lg:p-5 text-center shrink-0">
                    <h3 className="font-display font-extrabold text-base lg:text-lg xl:text-xl text-white truncate">
                      {person.name}
                    </h3>
                    <p className="text-xs lg:text-sm font-semibold text-[#D178FF] truncate mt-0.5">
                      {person.role}
                    </p>
                    {person.unit && (
                      <p className="text-[11px] lg:text-xs text-[#F4F5F7]/65 truncate mt-1">
                        {person.unit}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Celebratory Footer Message */}
      <div className="relative z-10 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#F4F5F7]/75 shrink-0">
        <span>
          O <strong className="text-white">Consórcio Matupiri</strong> deseja a todos os aniversariantes do mês muita saúde, segurança e realizações!
        </span>
        <span className="font-semibold text-[#D178FF]">
          Modera Engenharia • SCB BIM &amp; GIS
        </span>
      </div>
    </div>
  );
};
