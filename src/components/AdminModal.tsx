import React, { useState } from 'react';
import {
  BirthdayPerson,
  HighlightPhoto,
  ImportantEvent,
  SignageConfig,
  TeamMember,
  WeatherLocationPresetId
} from '../types/signage';
import {
  DEFAULT_SIGNAGE_CONFIG,
  FALLBACK_BOLETIM_COVER,
  resolveBoletimCoverUrl,
  resolveHeyzinePageImageUrl,
  saveSignageConfig
} from '../data/defaultConfig';
import { exportStandaloneHtml } from '../utils/exportStandaloneHtml';
import { MatupiriLogo } from './MatupiriLogo';
import { WEATHER_LOCATION_PRESETS } from '../utils/weatherService';

interface AdminModalProps {
  isOpen: boolean;
  config: SignageConfig;
  onClose: () => void;
  onPreview: (draftConfig: SignageConfig) => void;
  onSave: (newConfig: SignageConfig) => void;
}

type AdminTab = 'boletim' | 'fotos' | 'equipe' | 'aniversariantes' | 'eventos' | 'tempos';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  config,
  onClose,
  onPreview,
  onSave
}) => {
  const [draft, setDraft] = useState<SignageConfig>(() => structuredClone(config));
  const [activeTab, setActiveTab] = useState<AdminTab>('boletim');
  const [saveFeedback, setSaveFeedback] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const [newPhoto, setNewPhoto] = useState({
    url: '',
    title: '',
    highway: 'BR-319/AM',
    description: '',
    date: 'Outubro 2026',
    boletimPage: '',
    useHeyzinePageImage: false
  });

  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    highway: 'BR-319/AM · Trecho Supervisionado',
    unit: 'Modera Engenharia • SCB BIM & GIS',
    photoUrl: '',
    recognitionMessage: ''
  });

  const [newBirthday, setNewBirthday] = useState({
    name: '',
    role: '',
    day: '',
    unit: 'Consórcio Matupiri',
    photoUrl: ''
  });

  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: string;
    category: ImportantEvent['category'];
    description: string;
    highlight: boolean;
  }>({
    title: '',
    date: '',
    category: 'Curso & Capacitação',
    description: '',
    highlight: false
  });

  const [newTickerItem, setNewTickerItem] = useState('');

  if (!isOpen) return null;

  // Updates draft state for Live Preview; persisted to localStorage when clicking "Salvar e Publicar"
  const updateDraftAndPersist = (updater: (prev: SignageConfig) => SignageConfig) => {
    setDraft((prev) => updater(prev));
  };

  const handlePreview = () => {
    onPreview(draft);
  };

  const handleSave = () => {
    saveSignageConfig(draft);
    onSave(draft);
    setSaveFeedback('Configurações salvas no localStorage e publicadas na TV em tempo real!');
    setTimeout(() => {
      setSaveFeedback('');
      onClose();
    }, 550);
  };

  const handleExistingPhotoUpload = (
    photoId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result as string;
        updateDraftAndPersist((prev) => ({
          ...prev,
          photos: prev.photos.map((p) =>
            p.id === photoId ? { ...p, url: dataUrl, useHeyzinePageImage: false } : p
          )
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefaults = () => {
    const fresh = structuredClone(DEFAULT_SIGNAGE_CONFIG);
    setDraft(fresh);
    onSave(fresh);
    setSaveFeedback('Configurações padrão restauradas!');
    setTimeout(() => setSaveFeedback(''), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateDraftAndPersist((prev) => ({
          ...prev,
          customLogoUrl: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVignetteVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objUrl = URL.createObjectURL(file);
    updateDraftAndPersist((prev) => ({
      ...prev,
      vignetteVideoUrl: objUrl
    }));
  };

  const handleBoletimCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateDraftAndPersist((prev) => ({
          ...prev,
          boletimCoverUrl: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewPhoto((prev) => ({ ...prev, url: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBirthdayPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewBirthday((prev) => ({ ...prev, photoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTeamPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewTeamMember((prev) => ({ ...prev, photoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = () => {
    const resolvedHeyzinePageUrl =
      newPhoto.useHeyzinePageImage && newPhoto.boletimPage.trim()
        ? resolveHeyzinePageImageUrl(draft.boletimUrl, newPhoto.boletimPage)
        : '';
    const finalUrl = newPhoto.url.trim() || resolvedHeyzinePageUrl;
    if (!finalUrl || !newPhoto.title.trim()) return;

    const item: HighlightPhoto = {
      id: `photo-${Date.now()}`,
      url: finalUrl,
      title: newPhoto.title.trim(),
      highway: newPhoto.highway.trim() || 'BR-319/AM',
      description: newPhoto.description.trim(),
      date: newPhoto.date.trim() || `${draft.boletimMonth || 'Outubro'} 2026`,
      boletimPage: newPhoto.boletimPage.trim(),
      useHeyzinePageImage: newPhoto.useHeyzinePageImage
    };
    updateDraftAndPersist((prev) => ({ ...prev, photos: [...prev.photos, item] }));
    setNewPhoto({
      url: '',
      title: '',
      highway: 'BR-319/AM',
      description: '',
      date: `${draft.boletimMonth || 'Outubro'} 2026`,
      boletimPage: '',
      useHeyzinePageImage: false
    });
  };

  const handleAddTeamMember = () => {
    if (!newTeamMember.name.trim() || !newTeamMember.role.trim()) return;
    const item: TeamMember = {
      id: `team-${Date.now()}`,
      name: newTeamMember.name.trim(),
      role: newTeamMember.role.trim(),
      highway: newTeamMember.highway.trim() || 'BR-319/AM',
      unit: newTeamMember.unit.trim() || 'Modera Engenharia • SCB BIM & GIS',
      photoUrl: newTeamMember.photoUrl.trim(),
      recognitionMessage:
        newTeamMember.recognitionMessage.trim() ||
        'Reconhecimento pelo comprometimento, excelência técnica e dedicação às obras supervisionadas pelo Consórcio Matupiri.'
    };
    updateDraftAndPersist((prev) => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), item]
    }));
    setNewTeamMember({
      name: '',
      role: '',
      highway: 'BR-319/AM · Trecho Supervisionado',
      unit: 'Modera Engenharia • SCB BIM & GIS',
      photoUrl: '',
      recognitionMessage: ''
    });
  };

  const handleAddBirthday = () => {
    if (!newBirthday.name.trim() || !newBirthday.day.trim()) return;
    const item: BirthdayPerson = {
      id: `bday-${Date.now()}`,
      name: newBirthday.name.trim(),
      role: newBirthday.role.trim() || 'Colaborador(a)',
      day: newBirthday.day.trim(),
      unit: newBirthday.unit.trim() || 'Consórcio Matupiri',
      photoUrl: newBirthday.photoUrl.trim()
    };
    updateDraftAndPersist((prev) => ({
      ...prev,
      birthdays: [...prev.birthdays, item]
    }));
    setNewBirthday({
      name: '',
      role: '',
      day: '',
      unit: 'Consórcio Matupiri',
      photoUrl: ''
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date.trim()) return;
    const item: ImportantEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title.trim(),
      date: newEvent.date.trim(),
      category: newEvent.category,
      description: newEvent.description.trim(),
      highlight: newEvent.highlight
    };
    updateDraftAndPersist((prev) => ({ ...prev, events: [...prev.events, item] }));
    setNewEvent({
      title: '',
      date: '',
      category: 'Curso & Capacitação',
      description: '',
      highlight: false
    });
  };

  const handleAddTicker = () => {
    if (!newTickerItem.trim()) return;
    updateDraftAndPersist((prev) => ({
      ...prev,
      tickerMessages: [...prev.tickerMessages, newTickerItem.trim()]
    }));
    setNewTickerItem('');
  };

  const handleExportHtml = async () => {
    setIsExporting(true);
    try {
      await exportStandaloneHtml(draft);
    } finally {
      setIsExporting(false);
    }
  };

  const previewCoverUrl = resolveBoletimCoverUrl(
    draft.boletimUrl,
    draft.boletimCoverUrl
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 lg:p-6 select-text">
      <div className="w-full max-w-6xl h-[90dvh] bg-[#1E2022] border-2 border-[#8A05BE] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#2D3142] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8A05BE] text-white flex items-center justify-center">
              <i className="fa-solid fa-sliders text-base" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base lg:text-lg text-white">
                Painel Administrativo — TV Corporativa Consórcio Matupiri
              </h2>
              <p className="text-xs text-[#F4F5F7]/70">
                Pressione <kbd className="px-1.5 py-0.5 bg-[#1E2022] rounded text-[#D178FF] font-mono-tabular">Esc</kbd> para fechar • Gravação automática no <code className="text-[#D178FF]">localStorage</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportHtml}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-lg bg-[#1E2022] hover:bg-[#8A05BE]/30 border border-[#8A05BE] text-xs font-semibold text-[#F4F5F7] transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              title="Baixar arquivo único .html pronto para execução direta na Smart TV"
            >
              <i className="fa-solid fa-file-code text-[#B845E8]" />
              <span>{isExporting ? 'Gerando HTML...' : 'Baixar HTML Único (.html)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Fechar Painel"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-[#191B1D] border-b border-white/10 flex flex-wrap items-center gap-2 shrink-0">
          {[
            { id: 'boletim', label: '1. Vinheta, Boletim & Letreiro', icon: 'fa-solid fa-film' },
            { id: 'fotos', label: `2. Frentes de Serviço (${draft.photos.length})`, icon: 'fa-solid fa-newspaper' },
            { id: 'equipe', label: `3. Equipe do Mês (${(draft.teamMembers || []).length})`, icon: 'fa-solid fa-id-badge' },
            { id: 'aniversariantes', label: `4. Aniversariantes (${draft.birthdays.length})`, icon: 'fa-solid fa-cake-candles' },
            { id: 'eventos', label: `5. Datas & Comunicados (${draft.events.length})`, icon: 'fa-solid fa-calendar-days' },
            { id: 'tempos', label: '6. Clima Semanal & Tempos', icon: 'fa-solid fa-cloud-sun-rain' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#8A05BE] text-white shadow-md'
                  : 'bg-[#2D3142]/70 text-[#F4F5F7]/75 hover:text-white hover:bg-[#2D3142]'
              }`}
            >
              <i className={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 min-h-0 overflow-y-auto admin-scroll p-5 space-y-5">
          {/* TAB 1: VINHETA DE VÍDEO, BOLETIM (CAPA + QR) & TICKER */}
          {activeTab === 'boletim' && (
            <div className="space-y-5">
              {/* Vinheta de Vídeo & Modos de Exibição */}
              <div className="bg-[#2D3142] rounded-xl p-5 border border-[#8A05BE]/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                      <i className="fa-solid fa-clapperboard text-[#B845E8]" />
                      <span>Vinheta de Vídeo &amp; Transição de Pista (“Rode conosco, ande conosco”)</span>
                    </h3>
                    <p className="text-xs text-[#F4F5F7]/70 mt-0.5">
                      Configure a URL do vídeo MP4 da vinheta e os modos de exibição. Caso a URL esteja vazia ou sem rede na TV, a animação vetorial oficial da rodovia é exibida automaticamente.
                    </p>
                  </div>

                  <div className="bg-[#1E2022] p-2.5 rounded-xl border border-white/10 shrink-0">
                    <MatupiriLogo
                      size="sm"
                      variant={draft.logoVariant || 'light-badge'}
                      customLogoUrl={draft.customLogoUrl}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                  <div className="lg:col-span-8">
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      URL do Vídeo MP4 da Vinheta
                    </label>
                    <input
                      type="url"
                      value={draft.vignetteVideoUrl || ''}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          vignetteVideoUrl: e.target.value
                        }))
                      }
                      placeholder="https://exemplo.com/vinheta-matupiri.mp4 (ou deixe vazio para a Vinheta Animada Integrada)"
                      className="w-full bg-[#1E2022] border border-white/15 focus:border-[#8A05BE] rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  <div className="lg:col-span-4 flex items-center gap-2">
                    <label className="flex-1 py-2 px-3 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white text-center cursor-pointer transition-colors">
                      <i className="fa-solid fa-upload mr-1.5" />
                      <span>Selecionar MP4 Local...</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleVignetteVideoUpload}
                        className="hidden"
                      />
                    </label>
                    {draft.vignetteVideoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          updateDraftAndPersist((prev) => ({
                            ...prev,
                            vignetteVideoUrl: ''
                          }))
                        }
                        className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold text-red-300 cursor-pointer"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

                {/* Opções Toggle: Vinheta em Tela Cheia & Fundo Animado Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <label className="flex items-center justify-between gap-3 bg-[#1E2022] p-3.5 rounded-xl border border-white/10 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white">
                        Exibir Vinheta em Tela Cheia
                      </div>
                      <div className="text-[11px] text-[#F4F5F7]/65">
                        Executa na abertura do ciclo (antes do Boletim Mensal) com zoom na rodovia e transição em branco
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={draft.vignetteFullscreenEnabled !== false}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          vignetteFullscreenEnabled: e.target.checked
                        }))
                      }
                      className="accent-[#8A05BE] w-5 h-5 shrink-0"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 bg-[#1E2022] p-3.5 rounded-xl border border-white/10 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white">
                        Usar Vídeo como Fundo Animado (Glassmorphism)
                      </div>
                      <div className="text-[11px] text-[#F4F5F7]/65">
                        Aplica vídeo em loop com camada de vidro fosco (<code className="text-[#D178FF]">blur(10px)</code>) nos slides de Relógio e Avisos
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={draft.vignetteAsBackground !== false}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          vignetteAsBackground: e.target.checked
                        }))
                      }
                      className="accent-[#8A05BE] w-5 h-5 shrink-0"
                    />
                  </label>
                </div>

                {/* Logo Style Options */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-[#F4F5F7]/70 mr-1">Estilo da Logo no Topo:</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraftAndPersist((prev) => ({
                        ...prev,
                        logoVariant: 'light-badge',
                        customLogoUrl: ''
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      (draft.logoVariant || 'light-badge') === 'light-badge' && !draft.customLogoUrl
                        ? 'bg-[#8A05BE] text-white border-[#8A05BE]'
                        : 'bg-[#1E2022] text-[#F4F5F7]/80 border-white/15'
                    }`}
                  >
                    Placa Clara Original
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraftAndPersist((prev) => ({
                        ...prev,
                        logoVariant: 'dark-adaptive',
                        customLogoUrl: ''
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      draft.logoVariant === 'dark-adaptive' && !draft.customLogoUrl
                        ? 'bg-[#8A05BE] text-white border-[#8A05BE]'
                        : 'bg-[#1E2022] text-[#F4F5F7]/80 border-white/15'
                    }`}
                  >
                    Vazado Branco &amp; Roxo
                  </button>
                  <label className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1E2022] hover:bg-white/10 text-[#F4F5F7] border border-white/15 cursor-pointer">
                    <span>Enviar Imagem de Logo...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Boletim Mensal (Capa Expandida + QR Code) */}
                <div className="bg-[#2D3142] rounded-xl p-5 border border-white/10 space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <i className="fa-solid fa-book-open-reader text-[#B845E8]" />
                    <span>Slide do Boletim Mensal (Capa + QR Code)</span>
                  </h3>
                  <p className="text-xs text-[#F4F5F7]/70">
                    Ao atualizar o link do Heyzine abaixo, a <strong>Capa do Boletim</strong> e o <strong>QR Code</strong> são atualizados automaticamente e gravados no <code className="text-[#D178FF]">localStorage</code>.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Link do Boletim Mensal (Heyzine)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={draft.boletimUrl}
                        onChange={(e) =>
                          updateDraftAndPersist((prev) => ({
                            ...prev,
                            boletimUrl: e.target.value
                          }))
                        }
                        placeholder="https://heyzine.com/flip-book/18f73d8d30.html"
                        className="flex-1 bg-[#1E2022] border border-white/15 focus:border-[#8A05BE] rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateDraftAndPersist((prev) => ({
                            ...prev,
                            boletimCoverUrl: '',
                            photos:
                              prev.photos.length > 0
                                ? prev.photos
                                : structuredClone(DEFAULT_SIGNAGE_CONFIG.photos)
                          }));
                          setSaveFeedback(
                            'Capa, QR Code e notícias do boletim carregados! Revise na aba 2 (Frentes de Serviço).'
                          );
                          setTimeout(() => setSaveFeedback(''), 3000);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white whitespace-nowrap cursor-pointer"
                        title="Processar link do boletim e carregar notícias"
                      >
                        Carregar Boletim
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                        Mês Atual (Exibido na Chamada)
                      </label>
                      <input
                        type="text"
                        value={draft.boletimMonth || ''}
                        onChange={(e) =>
                          updateDraftAndPersist((prev) => ({
                            ...prev,
                            boletimMonth: e.target.value
                          }))
                        }
                        placeholder="Ex: Outubro ou Setembro"
                        className="w-full bg-[#1E2022] border border-white/15 focus:border-[#8A05BE] rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                        Subtítulo da Edição
                      </label>
                      <input
                        type="text"
                        value={draft.boletimEdition}
                        onChange={(e) =>
                          updateDraftAndPersist((prev) => ({
                            ...prev,
                            boletimEdition: e.target.value
                          }))
                        }
                        className="w-full bg-[#1E2022] border border-white/15 focus:border-[#8A05BE] rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Cover Preview & Optional Override */}
                  <div className="bg-[#1E2022] rounded-xl p-3.5 border border-white/10 flex items-center gap-4">
                    <img
                      src={previewCoverUrl}
                      alt="Prévia da Capa"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_BOLETIM_COVER;
                      }}
                      className="w-16 h-22 object-cover rounded-lg border border-[#8A05BE] shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <label className="block text-xs font-semibold text-[#D178FF]">
                        Imagem da Capa (Automática via Heyzine ou Personalizada)
                      </label>
                      <input
                        type="text"
                        value={draft.boletimCoverUrl || ''}
                        onChange={(e) =>
                          updateDraftAndPersist((prev) => ({
                            ...prev,
                            boletimCoverUrl: e.target.value
                          }))
                        }
                        placeholder="Deixe vazio para extrair automaticamente do Heyzine"
                        className="w-full bg-[#2D3142] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-2.5 py-1 rounded bg-[#8A05BE] hover:bg-[#7B1FA2] text-[11px] font-semibold text-white cursor-pointer">
                          Enviar Arquivo de Capa...
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBoletimCoverUpload}
                            className="hidden"
                          />
                        </label>
                        {draft.boletimCoverUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              updateDraftAndPersist((prev) => ({
                                ...prev,
                                boletimCoverUrl: ''
                              }))
                            }
                            className="text-[11px] text-red-400 hover:underline cursor-pointer"
                          >
                            Usar Capa Automática
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticker Messages Configuration */}
                <div className="bg-[#2D3142] rounded-xl p-5 border border-white/10 space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <i className="fa-solid fa-tower-broadcast text-[#B845E8]" />
                    <span>Letreiro Rolante do Rodapé (Ticker)</span>
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTickerItem}
                      onChange={(e) => setNewTickerItem(e.target.value)}
                      placeholder="Ex: Acompanhamento do DNIT nas BR-319/AM e BR-230/AM..."
                      className="flex-1 bg-[#1E2022] border border-white/15 focus:border-[#8A05BE] rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTicker}
                      className="px-4 py-2 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white whitespace-nowrap cursor-pointer"
                    >
                      + Adicionar
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto admin-scroll pr-1">
                    {draft.tickerMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 bg-[#1E2022] px-3.5 py-2.5 rounded-lg border border-white/10 text-xs text-[#F4F5F7]"
                      >
                        <span className="truncate">🔹 {msg}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateDraftAndPersist((prev) => ({
                              ...prev,
                              tickerMessages: prev.tickerMessages.filter((_, i) => i !== idx)
                            }))
                          }
                          className="text-red-400 hover:text-red-300 shrink-0 cursor-pointer"
                          title="Remover aviso"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FRENTES DE SERVIÇO / DESTAQUES DO BOLETIM (MURAL DE NOTÍCIAS) */}
          {activeTab === 'fotos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-[#2D3142] rounded-xl p-5 border border-[#8A05BE]/60 space-y-3.5 h-fit">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <i className="fa-solid fa-newspaper text-[#D178FF]" />
                    <span>Cadastrar Destaque do Boletim</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#8A05BE]/30 border border-[#8A05BE] text-[10px] font-bold text-[#D178FF]">
                    MURAL DE NOTÍCIAS
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    URL da Foto da Obra / Visita
                  </label>
                  <input
                    type="text"
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                    placeholder="https://exemplo.com/foto-obra.jpg"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Ou Enviar Foto do Computador
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full text-xs text-[#F4F5F7]/80 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#8A05BE] file:text-white hover:file:bg-[#7B1FA2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Categoria / Rodovia (Badge Roxo)
                  </label>
                  <input
                    type="text"
                    value={newPhoto.highway}
                    onChange={(e) => setNewPhoto({ ...newPhoto, highway: e.target.value })}
                    placeholder="Ex: BR-319/AM, BR-230/AM, VISITA INSTITUCIONAL, TREINAMENTO"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['BR-319/AM', 'BR-230/AM', 'VISITA INSTITUCIONAL', 'TREINAMENTO'].map(
                      (preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setNewPhoto({ ...newPhoto, highway: preset })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                            newPhoto.highway === preset
                              ? 'bg-[#8A05BE] text-white'
                              : 'bg-[#1E2022] text-[#F4F5F7]/70 hover:text-white border border-white/10'
                          }`}
                        >
                          {preset}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Título da Ação / Destaque
                  </label>
                  <input
                    type="text"
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                    placeholder="Ex: Visita do Ministro dos Transportes / Supervisão de Drenagem"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Página do Boletim (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newPhoto.boletimPage}
                      onChange={(e) =>
                        setNewPhoto({ ...newPhoto, boletimPage: e.target.value })
                      }
                      placeholder="Ex: 04 ou Pág. 04"
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono-tabular outline-none focus:border-[#8A05BE]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Mês / Referência
                    </label>
                    <input
                      type="text"
                      value={newPhoto.date}
                      onChange={(e) => setNewPhoto({ ...newPhoto, date: e.target.value })}
                      placeholder="Outubro 2026"
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Descrição Curta do Avanço / Acompanhamento
                  </label>
                  <textarea
                    rows={3}
                    value={newPhoto.description}
                    onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                    placeholder="Resumo extraído do Boletim Mensal sobre o avanço ou acompanhamento realizado..."
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg p-3 text-xs text-white outline-none focus:border-[#8A05BE]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="w-full py-2.5 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
                >
                  + Adicionar Card ao Mural de Destaques
                </button>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-base text-white">
                      Cards do Mural de Notícias ({draft.photos.length})
                    </h3>
                    <p className="text-[11px] text-[#F4F5F7]/70">
                      Edite qualquer campo abaixo • Sincronizado automaticamente no{' '}
                      <code className="text-[#D178FF]">localStorage</code>
                    </p>
                  </div>
                  {draft.photos.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftAndPersist((prev) => ({ ...prev, photos: [] }))
                      }
                      className="text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Remover todos
                    </button>
                  )}
                </div>

                {draft.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="bg-[#2D3142] rounded-xl p-4 border border-white/10 space-y-3"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-28 h-20 rounded-lg object-cover bg-[#1E2022] shrink-0 border border-[#8A05BE]/50"
                      />
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#8A05BE] text-white font-mono-tabular font-bold text-[10px]">
                            Destaque {index + 1} de {draft.photos.length}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateDraftAndPersist((prev) => ({
                                ...prev,
                                photos: prev.photos.filter((p) => p.id !== photo.id)
                              }))
                            }
                            className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-300 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                            title="Excluir card de destaque"
                          >
                            <i className="fa-solid fa-trash-can text-[10px]" />
                            <span>Excluir</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-[#F4F5F7]/65 mb-0.5">
                              Categoria / Rodovia
                            </label>
                            <input
                              type="text"
                              value={photo.highway}
                              onChange={(e) =>
                                updateDraftAndPersist((prev) => ({
                                  ...prev,
                                  photos: prev.photos.map((p) =>
                                    p.id === photo.id ? { ...p, highway: e.target.value } : p
                                  )
                                }))
                              }
                              className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-[#D178FF] font-bold outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#F4F5F7]/65 mb-0.5">
                              📖 Página do Boletim
                            </label>
                            <input
                              type="text"
                              value={photo.boletimPage || ''}
                              onChange={(e) =>
                                updateDraftAndPersist((prev) => ({
                                  ...prev,
                                  photos: prev.photos.map((p) =>
                                    p.id === photo.id
                                      ? { ...p, boletimPage: e.target.value }
                                      : p
                                  )
                                }))
                              }
                              placeholder="Ex: 04"
                              className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono-tabular outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-1 border-t border-white/10">
                      {/* Manual Photo Replacement Row (URL or Local File Upload) */}
                      <div className="bg-[#1E2022]/90 rounded-lg p-2.5 border border-[#8A05BE]/40 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D178FF] flex items-center gap-1.5">
                            <i className="fa-solid fa-image" />
                            <span>Edição Manual da Foto do Serviço (BR-319/AM ou BR-230/AM)</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <label className="px-2.5 py-1 rounded-md bg-[#8A05BE] hover:bg-[#7B1FA2] text-[10px] font-bold text-white cursor-pointer flex items-center gap-1.5 shadow-sm">
                              <i className="fa-solid fa-upload" />
                              <span>Substituir por Foto Local</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleExistingPhotoUpload(photo.id, e)}
                                className="hidden"
                              />
                            </label>

                            {photo.boletimPage && (
                              <button
                                type="button"
                                onClick={() => {
                                  const pageUrl = resolveHeyzinePageImageUrl(
                                    draft.boletimUrl,
                                    photo.boletimPage
                                  );
                                  if (pageUrl) {
                                    updateDraftAndPersist((prev) => ({
                                      ...prev,
                                      photos: prev.photos.map((p) =>
                                        p.id === photo.id
                                          ? { ...p, url: pageUrl, useHeyzinePageImage: true }
                                          : p
                                      )
                                    }));
                                  }
                                }}
                                className="px-2.5 py-1 rounded-md bg-[#2D3142] hover:bg-white/15 border border-white/15 text-[10px] font-semibold text-[#D178FF] cursor-pointer"
                                title="Usar imagem capturada da página do Boletim Heyzine"
                              >
                                📖 Usar Foto da Pág. {photo.boletimPage}
                              </button>
                            )}
                          </div>
                        </div>

                        <input
                          type="text"
                          value={photo.url}
                          onChange={(e) =>
                            updateDraftAndPersist((prev) => ({
                              ...prev,
                              photos: prev.photos.map((p) =>
                                p.id === photo.id
                                  ? { ...p, url: e.target.value, useHeyzinePageImage: false }
                                  : p
                              )
                            }))
                          }
                          placeholder="Cole aqui a URL de uma foto específica da obra (BR-319/AM ou BR-230/AM)..."
                          className="w-full bg-[#2D3142] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#8A05BE]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#F4F5F7]/65 mb-0.5">
                          Título da Ação / Notícia
                        </label>
                        <input
                          type="text"
                          value={photo.title}
                          onChange={(e) =>
                            updateDraftAndPersist((prev) => ({
                              ...prev,
                              photos: prev.photos.map((p) =>
                                p.id === photo.id ? { ...p, title: e.target.value } : p
                              )
                            }))
                          }
                          className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#F4F5F7]/65 mb-0.5">
                          Descrição Curta
                        </label>
                        <textarea
                          rows={2}
                          value={photo.description}
                          onChange={(e) =>
                            updateDraftAndPersist((prev) => ({
                              ...prev,
                              photos: prev.photos.map((p) =>
                                p.id === photo.id
                                  ? { ...p, description: e.target.value }
                                  : p
                              )
                            }))
                          }
                          className="w-full bg-[#1E2022] border border-white/15 rounded-lg p-2 text-xs text-[#F4F5F7]/90 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONHEÇA A EQUIPE DO MÊS (COLABORADORES EM DESTAQUE) */}
          {activeTab === 'equipe' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-[#2D3142] rounded-xl p-5 border border-[#8A05BE]/60 space-y-3.5 h-fit">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <i className="fa-solid fa-id-badge text-[#D178FF]" />
                    <span>Cadastrar Colaborador em Destaque</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#8A05BE]/30 border border-[#8A05BE] text-[10px] font-bold text-[#D178FF]">
                    EQUIPE DO MÊS
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Nome Completo do Colaborador
                  </label>
                  <input
                    type="text"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    placeholder="Ex: Engenheiro Patrick Modera / Técnico Virgílio Modera"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Cargo / Função Técnica
                  </label>
                  <input
                    type="text"
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                    placeholder="Ex: Coordenador de Supervisão Rodoviária"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Rodovia de Atuação
                    </label>
                    <input
                      type="text"
                      value={newTeamMember.highway}
                      onChange={(e) =>
                        setNewTeamMember({ ...newTeamMember, highway: e.target.value })
                      }
                      placeholder="BR-319/AM ou BR-230/AM"
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Empresa / Núcleo
                    </label>
                    <input
                      type="text"
                      value={newTeamMember.unit}
                      onChange={(e) =>
                        setNewTeamMember({ ...newTeamMember, unit: e.target.value })
                      }
                      placeholder="Modera Engenharia"
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    URL da Foto (ou envie arquivo abaixo)
                  </label>
                  <input
                    type="text"
                    value={newTeamMember.photoUrl}
                    onChange={(e) =>
                      setNewTeamMember({ ...newTeamMember, photoUrl: e.target.value })
                    }
                    placeholder="https://exemplo.com/foto-colaborador.jpg"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-[#8A05BE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Ou Enviar Foto do Computador
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTeamPhotoUpload}
                    className="w-full text-xs text-[#F4F5F7]/80 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#8A05BE] file:text-white hover:file:bg-[#7B1FA2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Mensagem de Reconhecimento pelo Trabalho Prestado
                  </label>
                  <textarea
                    rows={3}
                    value={newTeamMember.recognitionMessage}
                    onChange={(e) =>
                      setNewTeamMember({
                        ...newTeamMember,
                        recognitionMessage: e.target.value
                      })
                    }
                    placeholder="Mensagem institucional destacando a atuação do colaborador nas frentes de serviço..."
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg p-3 text-xs text-white outline-none focus:border-[#8A05BE]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  className="w-full py-2.5 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
                >
                  + Adicionar à Equipe do Mês
                </button>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-base text-white">
                    Colaboradores em Destaque ({(draft.teamMembers || []).length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          teamMembers: structuredClone(DEFAULT_SIGNAGE_CONFIG.teamMembers)
                        }))
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#1E2022] hover:bg-[#8A05BE]/30 border border-white/15 text-[11px] font-semibold text-[#D178FF] cursor-pointer"
                    >
                      Restaurar Patrick &amp; Virgílio Modera
                    </button>
                    {(draft.teamMembers || []).length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateDraftAndPersist((prev) => ({ ...prev, teamMembers: [] }))
                        }
                        className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-[11px] font-semibold text-red-300 cursor-pointer"
                      >
                        Omitir Slide
                      </button>
                    )}
                  </div>
                </div>

                {(draft.teamMembers || []).map((member) => (
                  <div
                    key={member.id}
                    className="bg-[#2D3142] rounded-xl p-4 border border-white/10 space-y-3"
                  >
                    <div className="flex items-start gap-4">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-24 rounded-xl object-cover object-top bg-[#1E2022] border border-[#8A05BE] shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-24 rounded-xl bg-[#8A05BE] text-white flex items-center justify-center shrink-0">
                          <i className="fa-solid fa-user-tie text-2xl" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) =>
                              updateDraftAndPersist((prev) => ({
                                ...prev,
                                teamMembers: (prev.teamMembers || []).map((m) =>
                                  m.id === member.id ? { ...m, name: e.target.value } : m
                                )
                              }))
                            }
                            className="flex-1 bg-[#1E2022] border border-white/15 rounded-lg px-2.5 py-1 text-xs font-bold text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateDraftAndPersist((prev) => ({
                                ...prev,
                                teamMembers: (prev.teamMembers || []).filter(
                                  (m) => m.id !== member.id
                                )
                              }))
                            }
                            className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-300 text-xs cursor-pointer"
                          >
                            <i className="fa-solid fa-trash-can" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) =>
                              updateDraftAndPersist((prev) => ({
                                ...prev,
                                teamMembers: (prev.teamMembers || []).map((m) =>
                                  m.id === member.id ? { ...m, role: e.target.value } : m
                                )
                              }))
                            }
                            className="bg-[#1E2022] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-[#D178FF] font-semibold outline-none"
                          />
                          <input
                            type="text"
                            value={member.highway}
                            onChange={(e) =>
                              updateDraftAndPersist((prev) => ({
                                ...prev,
                                teamMembers: (prev.teamMembers || []).map((m) =>
                                  m.id === member.id ? { ...m, highway: e.target.value } : m
                                )
                              }))
                            }
                            className="bg-[#1E2022] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={member.recognitionMessage}
                          onChange={(e) =>
                            updateDraftAndPersist((prev) => ({
                              ...prev,
                              teamMembers: (prev.teamMembers || []).map((m) =>
                                m.id === member.id
                                  ? { ...m, recognitionMessage: e.target.value }
                                  : m
                              )
                            }))
                          }
                          className="w-full bg-[#1E2022] border border-white/15 rounded-lg p-2 text-xs text-[#F4F5F7]/90 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANIVERSARIANTES DO MÊS (COM FOTO E MODOS 1 OU 2+ COLABORADORES) */}
          {activeTab === 'aniversariantes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-[#2D3142] rounded-xl p-5 border border-white/10 space-y-3.5 h-fit">
                <h3 className="font-display font-bold text-base text-white">
                  Cadastrar Aniversariante com Foto
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Nome do Colaborador(a)
                  </label>
                  <input
                    type="text"
                    value={newBirthday.name}
                    onChange={(e) => setNewBirthday({ ...newBirthday, name: e.target.value })}
                    placeholder="Ex: Eng. Lucas Andrade"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Cargo / Setor
                  </label>
                  <input
                    type="text"
                    value={newBirthday.role}
                    onChange={(e) => setNewBirthday({ ...newBirthday, role: e.target.value })}
                    placeholder="Ex: Analista de Orçamentos SICRO"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Data do Aniversário (Dia)
                    </label>
                    <input
                      type="text"
                      value={newBirthday.day}
                      onChange={(e) => setNewBirthday({ ...newBirthday, day: e.target.value })}
                      placeholder="Ex: 18/10"
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white font-mono-tabular outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Unidade / Frente
                    </label>
                    <input
                      type="text"
                      value={newBirthday.unit}
                      onChange={(e) => setNewBirthday({ ...newBirthday, unit: e.target.value })}
                      placeholder="Núcleo SCB BIM & GIS"
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    URL da Foto do Colaborador
                  </label>
                  <input
                    type="text"
                    value={newBirthday.photoUrl}
                    onChange={(e) => setNewBirthday({ ...newBirthday, photoUrl: e.target.value })}
                    placeholder="https://exemplo.com/foto-colaborador.jpg"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Ou Enviar Arquivo da Foto do Colaborador
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBirthdayPhotoUpload}
                    className="w-full text-xs text-[#F4F5F7]/80 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#8A05BE] file:text-white hover:file:bg-[#7B1FA2]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddBirthday}
                  className="w-full py-2.5 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
                >
                  + Cadastrar Aniversariante
                </button>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-base text-white">
                    Aniversariantes do Mês ({draft.birthdays.length})
                  </h3>

                  {/* Quick Layout Mode Presets for Instant Testing */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          birthdays: [DEFAULT_SIGNAGE_CONFIG.birthdays[0]]
                        }))
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#1E2022] hover:bg-[#8A05BE]/30 border border-white/15 text-[11px] font-semibold text-[#D178FF] cursor-pointer"
                    >
                      Simular 1 (Card Único)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          birthdays: structuredClone(DEFAULT_SIGNAGE_CONFIG.birthdays)
                        }))
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#1E2022] hover:bg-[#8A05BE]/30 border border-white/15 text-[11px] font-semibold text-[#D178FF] cursor-pointer"
                    >
                      Simular 3 (Escalação Side-by-Side)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftAndPersist((prev) => ({ ...prev, birthdays: [] }))
                      }
                      className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 border border-red-400/30 text-[11px] font-semibold text-red-300 cursor-pointer"
                    >
                      Zerar Lista (Pular Slide)
                    </button>
                  </div>
                </div>

                {draft.birthdays.length === 0 ? (
                  <div className="bg-[#2D3142]/50 rounded-xl p-8 text-center border border-white/10">
                    <i className="fa-solid fa-forward-fast text-2xl text-[#B845E8] mb-2" />
                    <p className="text-sm font-semibold text-white">
                      Nenhum aniversariante cadastrado neste mês.
                    </p>
                    <p className="text-xs text-[#F4F5F7]/70 mt-1">
                      Conforme regra obrigatória, o sistema omitirá e pulará automaticamente o Slide 3 no loop, indo direto para o próximo conteúdo.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {draft.birthdays.map((person) => (
                      <div
                        key={person.id}
                        className="bg-[#2D3142] rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {person.photoUrl ? (
                            <img
                              src={person.photoUrl}
                              alt={person.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-14 rounded-lg object-cover object-top bg-[#1E2022] border border-[#8A05BE] shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-14 rounded-lg bg-[#8A05BE] text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
                              <i className="fa-solid fa-user" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-display font-bold text-sm text-white truncate">
                              {person.name}
                            </div>
                            <div className="text-xs text-[#D178FF] truncate">{person.role}</div>
                            <div className="text-[11px] text-[#F4F5F7]/60 truncate">
                              <span className="font-mono-tabular font-bold text-white">
                                {person.day}
                              </span>{' '}
                              · {person.unit}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateDraftAndPersist((prev) => ({
                              ...prev,
                              birthdays: prev.birthdays.filter((b) => b.id !== person.id)
                            }))
                          }
                          className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-300 flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          <i className="fa-solid fa-trash-can text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DATAS IMPORTANTES E COMUNICADOS */}
          {activeTab === 'eventos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-[#2D3142] rounded-xl p-5 border border-white/10 space-y-4 h-fit">
                <h3 className="font-display font-bold text-base text-white">
                  Novo Comunicado ou Data Importante
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Título do Evento / Comunicado
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Ex: Curso de Orçamentação de Obras SICRO"
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Data / Horário
                    </label>
                    <input
                      type="text"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      placeholder="25 de Outubro • 14h00"
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                      Categoria
                    </label>
                    <select
                      value={newEvent.category}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          category: e.target.value as ImportantEvent['category']
                        })
                      }
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Curso & Capacitação">Curso &amp; Capacitação</option>
                      <option value="Gestão & BIM/GIS">Gestão &amp; BIM/GIS</option>
                      <option value="Institucional DNIT">Institucional DNIT</option>
                      <option value="Segurança & QSMS">Segurança &amp; QSMS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Detalhes sobre o compromisso institucional, curso ou campanha..."
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg p-3 text-xs text-white outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-[#F4F5F7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEvent.highlight}
                    onChange={(e) => setNewEvent({ ...newEvent, highlight: e.target.checked })}
                    className="accent-[#8A05BE]"
                  />
                  <span>Destacar com borda Roxo Matupiri prioritária</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="w-full py-2.5 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
                >
                  + Adicionar Comunicado
                </button>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white">
                    Comunicados e Eventos ({draft.events.length})
                  </h3>
                  {draft.events.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftAndPersist((prev) => ({ ...prev, events: [] }))
                      }
                      className="text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Limpar todos
                    </button>
                  )}
                </div>

                {draft.events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-[#2D3142] rounded-xl p-4 border border-white/10 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#D178FF]">
                        {evt.category} · {evt.date}
                      </div>
                      <h4 className="font-display font-bold text-sm text-white mt-0.5">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#F4F5F7]/75 mt-1">{evt.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          events: prev.events.filter((e) => e.id !== evt.id)
                        }))
                      }
                      className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-300 flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TEMPOS DE EXIBIÇÃO & CLIMA */}
          {activeTab === 'tempos' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#2D3142] rounded-xl p-5 border border-white/10 space-y-4">
                <h3 className="font-display font-bold text-base text-white">
                  Tempo de Exibição de Cada Slide (em segundos)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                      Vinheta de Abertura (padrão 9s)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={draft.durations.vinheta || 9}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          durations: {
                            ...prev.durations,
                            vinheta: Math.max(5, Number(e.target.value) || 9)
                          }
                        }))
                      }
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                      Boletim Mensal: Capa + QR (padrão 18s)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={draft.durations.boletim}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          durations: {
                            ...prev.durations,
                            boletim: Math.max(5, Number(e.target.value) || 18)
                          }
                        }))
                      }
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                      Frentes de Serviço (por foto, padrão 15s)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={draft.durations.destaquesPerPhoto}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          durations: {
                            ...prev.durations,
                            destaquesPerPhoto: Math.max(5, Number(e.target.value) || 15)
                          }
                        }))
                      }
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                      Aniversariantes do Mês (padrão 15s)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={draft.durations.aniversariantes}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          durations: {
                            ...prev.durations,
                            aniversariantes: Math.max(5, Number(e.target.value) || 15)
                          }
                        }))
                      }
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                      Datas e Comunicados (padrão 15s)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={draft.durations.comunicados}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          durations: {
                            ...prev.durations,
                            comunicados: Math.max(5, Number(e.target.value) || 15)
                          }
                        }))
                      }
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                      Equipe do Mês (padrão 15s)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={draft.durations.equipe || 15}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          durations: {
                            ...prev.durations,
                            equipe: Math.max(5, Number(e.target.value) || 15)
                          }
                        }))
                      }
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                      Relógio Digital &amp; Clima Semanal (padrão 15s)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={draft.durations.relogio}
                      onChange={(e) =>
                        updateDraftAndPersist((prev) => ({
                          ...prev,
                          durations: {
                            ...prev.durations,
                            relogio: Math.max(5, Number(e.target.value) || 15)
                          }
                        }))
                      }
                      className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#2D3142] rounded-xl p-5 border border-[#8A05BE]/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <i className="fa-solid fa-cloud-sun-rain text-[#D178FF]" />
                    <span>Previsão do Tempo Semanal (Open-Meteo API)</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono-tabular font-semibold">
                    7 DIAS AO VIVO
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F5F7]/80 mb-1">
                    Selecionar Cidade / Rodovia para Previsão Semanal de Campo
                  </label>
                  <select
                    value={draft.weatherLocationId || 'manaus_br319'}
                    onChange={(e) => {
                      const selectedId = e.target.value as WeatherLocationPresetId;
                      const preset = WEATHER_LOCATION_PRESETS.find((p) => p.id === selectedId);
                      updateDraftAndPersist((prev) => ({
                        ...prev,
                        weatherLocationId: selectedId,
                        weatherCity: preset ? preset.label : prev.weatherCity
                      }));
                    }}
                    className="w-full bg-[#1E2022] border border-[#8A05BE] rounded-lg px-3.5 py-2.5 text-sm text-white font-semibold outline-none"
                  >
                    {WEATHER_LOCATION_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label} — ({preset.highwayTag})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                    Nome Personalizado da Localidade / Frente de Serviço
                  </label>
                  <input
                    type="text"
                    value={draft.weatherCity}
                    onChange={(e) =>
                      updateDraftAndPersist((prev) => ({
                        ...prev,
                        weatherCity: e.target.value
                      }))
                    }
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#F4F5F7]/80 mb-1">
                    Mensagem Corporativa de Segurança e Qualidade (Slide Relógio)
                  </label>
                  <textarea
                    rows={2}
                    value={draft.motivationalQuote}
                    onChange={(e) =>
                      updateDraftAndPersist((prev) => ({
                        ...prev,
                        motivationalQuote: e.target.value
                      }))
                    }
                    className="w-full bg-[#1E2022] border border-white/15 rounded-lg p-3 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#2D3142] border-t border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#F4F5F7]/80 transition-colors cursor-pointer"
            >
              Restaurar Padrão de Fábrica
            </button>
            {saveFeedback && (
              <span className="text-xs font-semibold text-[#D178FF]">
                <i className="fa-solid fa-circle-check mr-1.5" />
                {saveFeedback}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="px-4 py-2 rounded-lg bg-[#1E2022] hover:bg-[#8A05BE]/30 border-2 border-[#8A05BE] text-xs lg:text-sm font-bold text-[#D178FF] hover:text-white transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              title="Simular loop em tela cheia com os dados preenchidos sem salvar definitivamente ainda"
            >
              <span aria-hidden="true">👁️</span>
              <span>Pré-visualizar</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs lg:text-sm font-bold text-white shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
              title="Salvar no localStorage e aplicar instantaneamente na TV"
            >
              <span aria-hidden="true">💾</span>
              <span>Salvar e Publicar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
