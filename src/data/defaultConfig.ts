import { SignageConfig } from '../types/signage';

export const STORAGE_KEY = 'consorcio_matupiri_tv_config_v6';

export const FALLBACK_BOLETIM_COVER =
  '/src/assets/images/capa_boletim_matupiri_1791664607487.jpg';

export const DEFAULT_SIGNAGE_CONFIG: SignageConfig = {
  logoVariant: 'light-badge',
  vignetteVideoUrl: '',
  vignetteTagline: 'Trafegue conosco ⮕',
  vignetteFullscreenEnabled: true,
  vignetteAsBackground: true,
  boletimUrl: 'https://heyzine.com/flip-book/18f73d8d30.html',
  boletimCoverUrl: '',
  boletimMonth: 'Outubro',
  boletimTitle: 'Boletim Informativo Mensal — Consórcio Matupiri',
  boletimEdition: 'Edição Outubro • Ano 2026',
  boletimSummary: [
    'Avanço físico-financeiro das obras supervisionadas na BR-319/AM e BR-230/AM',
    'Integração de aerofotogrametria com drones e modelos BIM 4D/5D no controle de medição',
    'Relatório consolidado de conformidade ambiental e segurança viária junto ao DNIT',
    'Destaques da capacitação em Orçamentação de Obras SICRO e implantação do novo BDTC'
  ],
  tickerMessages: [
    'Acompanhamento técnico do DNIT nas rodovias federais BR-319/AM e BR-230/AM',
    'Curso de Orçamentação de Obras SICRO: Inscrições abertas para engenheiros e técnicos do consórcio',
    'Implantação de novo BDTC (Banco de Dados Técnicos do Consórcio) integrado ao núcleo SCB BIM & GIS',
    'Segurança e Qualidade na Infraestrutura Rodoviária: Inspeção diária de EPIs e viaturas 4x4 obrigatória',
    'Modera Engenharia • SCB BIM & GIS: Excelência em supervisão e gerenciamento de obras na Amazônia'
  ],
  photos: [
    {
      id: 'photo-1',
      url: '/src/assets/images/br319_supervisao_obra_1791662992342.jpg',
      title: 'Supervisão de Serviços de Drenagem e Pavimentação na BR-319/AM',
      highway: 'BR-319/AM',
      description:
        'Equipes de engenharia do Consórcio Matupiri realizam aferição tecnológica de CBUQ, acompanhamento de terraplenagem e controle geométrico de pista com apoio de tablets GIS em tempo real.',
      date: 'Outubro 2026',
      boletimPage: '04',
      useHeyzinePageImage: false
    },
    {
      id: 'photo-2',
      url: '/src/assets/images/visita_comitiva_dnit_1791663010960.jpg',
      title: 'Visita do Ministro dos Transportes e Comitiva Técnica do DNIT',
      highway: 'VISITA INSTITUCIONAL',
      description:
        'Vistoria oficial às frentes de serviço supervisionadas com apresentação dos relatórios de avanço físico, mapas temáticos GIS e matriz de conformidade ambiental e de segurança viária.',
      date: 'Outubro 2026',
      boletimPage: '07',
      useHeyzinePageImage: false
    },
    {
      id: 'photo-3',
      url: '/src/assets/images/br230_transamazonica_ponte_1791663002521.jpg',
      title: 'Inspeção de Obras de Arte Especiais (Pontes) e Levantamento BIM & GIS',
      highway: 'BR-230/AM • PONTES',
      description:
        'Monitoramento estrutural de pontes em concreto armado na Transamazônica utilizando estação total de alta precisão e VANT (drone) para atualização do modelo gêmeo digital da rodovia.',
      date: 'Outubro 2026',
      boletimPage: '11',
      useHeyzinePageImage: false
    },
    {
      id: 'photo-4',
      url: '/src/assets/images/drenagem_terraplenagem_am_1791663023047.jpg',
      title: 'Execução de Drenagem Profunda e Contenção de Taludes',
      highway: 'DRENAGEM • BR-319/AM',
      description:
        'Fiscalização rigorosa do assentamento de aduelas pré-moldadas de concreto e hidrossemeadura de taludes para proteção contra processos erosivos no inverno amazônico.',
      date: 'Outubro 2026',
      boletimPage: '15',
      useHeyzinePageImage: false
    }
  ],
  galleryItems: [
    {
      id: 'gal-1',
      url: '/src/assets/images/br319_supervisao_obra_1791662992342.jpg',
      mediaType: 'image',
      title: 'Supervisão de Pavimentação e Controle Tecnológico na BR-319/AM',
      caption:
        'Acompanhamento de aplicação de revestimento asfáltico e controle geométrico pela equipe técnica do Consórcio Matupiri.',
      location: 'BR-319/AM · Trecho Supervisionado',
      date: 'Outubro 2026'
    },
    {
      id: 'gal-2',
      url: '/src/assets/images/visita_comitiva_dnit_1791663010960.jpg',
      mediaType: 'image',
      title: 'Vistoria Institucional DNIT & Coordenação Modera • SCB',
      caption:
        'Apresentação em campo do monitoramento georreferenciado BIM & GIS e avanços físicos das frentes de serviço.',
      location: 'BR-319/AM · Comitiva Técnica',
      date: 'Outubro 2026'
    },
    {
      id: 'gal-3',
      url: '/src/assets/images/br230_transamazonica_ponte_1791663002521.jpg',
      mediaType: 'image',
      title: 'Monitoramento Estrutural de Pontes e Obras de Arte Especiais',
      caption:
        'Inspeção visual e levantamento aerofotogramétrico com VANT na Rodovia Transamazônica (BR-230/AM).',
      location: 'BR-230/AM · Subtrecho Humaitá',
      date: 'Outubro 2026'
    },
    {
      id: 'gal-4',
      url: '/src/assets/images/drenagem_terraplenagem_am_1791663023047.jpg',
      mediaType: 'image',
      title: 'Frentes de Drenagem Profunda e Proteção Ambiental de Taludes',
      caption:
        'Assentamento de bueiros celulares e recomposição vegetal de faixas de domínio sob supervisão ambiental.',
      location: 'BR-319/AM · Drenagem & QSMS',
      date: 'Outubro 2026'
    }
  ],
  galleryLayoutMode: 'coletivo',
  galleryMosaicCount: 4,
  teamMembers: [
    {
      id: 'team-1',
      name: 'Engenheiro Patrick Modera',
      role: 'Coordenador de Supervisão e Qualidade Rodoviária',
      highway: 'BR-319/AM · Trecho Manaus – Humaitá',
      unit: 'Modera Engenharia • Consórcio Matupiri',
      photoUrl: '/src/assets/images/equipe_patrick_modera_1791669877800.jpg',
      recognitionMessage:
        'Reconhecimento pelo rigor técnico na coordenação das frentes de pavimentação e integração das diretrizes de qualidade e segurança do DNIT na BR-319/AM.'
    },
    {
      id: 'team-2',
      name: 'Técnico Virgílio Modera',
      role: 'Especialista Sênior em Topografia e Controle de Campo',
      highway: 'BR-230/AM · Rodovia Transamazônica',
      unit: 'SCB BIM & GIS • Modera Engenharia',
      photoUrl: '/src/assets/images/equipe_virgilio_modera_1791669887976.jpg',
      recognitionMessage:
        'Destaque pela excelência operacional nos levantamentos geodésicos de precisão, acompanhamento de Obras de Arte Especiais e dedicação diária às equipes de campo.'
    }
  ],
  birthdays: [
    {
      id: 'bday-1',
      name: 'Eng. Carlos Eduardo Mendonça',
      role: 'Coordenador Geral de Supervisão',
      day: '10/10',
      unit: 'Sede Manaus • Modera Engenharia',
      photoUrl: '/src/assets/images/colab_carlos_mendonca_1791664617688.jpg'
    },
    {
      id: 'bday-2',
      name: 'Arq. Mariana Vasconcelos',
      role: 'Especialista em Modelagem BIM 4D',
      day: '15/10',
      unit: 'Núcleo Técnico • SCB BIM & GIS',
      photoUrl: '/src/assets/images/colab_mariana_vasconcelos_1791664627009.jpg'
    },
    {
      id: 'bday-3',
      name: 'Eng. Rafael Nogueira da Silva',
      role: 'Engenheiro de Topografia & Campo',
      day: '22/10',
      unit: 'Frente BR-319/AM • Base Humaitá',
      photoUrl: '/src/assets/images/colab_rafael_nogueira_1791664635821.jpg'
    }
  ],
  events: [
    {
      id: 'evt-1',
      title: 'Curso de Orçamentação de Obras SICRO / DNIT',
      date: '14 a 16 de Outubro • 14h00',
      category: 'Curso & Capacitação',
      description:
        'Capacitação técnica intensiva sobre composição de custos unitários, BDI, equipamentos e metodologias atualizadas do sistema SICRO para equipes de medição e planejamento.',
      highlight: true
    },
    {
      id: 'evt-2',
      title: 'Implantação Oficial do Novo BDTC (Banco de Dados Técnicos)',
      date: '20 de Outubro • 09h00',
      category: 'Gestão & BIM/GIS',
      description:
        'Migração e padronização de todos os registros de ensaios tecnológicos, diários de obra e ortomosaicos georreferenciados no ambiente comum de dados (CDE).',
      highlight: true
    },
    {
      id: 'evt-3',
      title: 'Reunião Mensal de Acompanhamento DNIT — BR-319/AM e BR-230/AM',
      date: '23 de Outubro • 10h30',
      category: 'Institucional DNIT',
      description:
        'Apresentação executiva dos indicadores de desempenho, curva S física-financeira e ações de governança ambiental junto à Superintendência Regional do DNIT/AM.',
      highlight: false
    },
    {
      id: 'evt-4',
      title: 'Campanha Operação Inverno Amazônico & Direção Defensiva 4x4',
      date: '28 de Outubro • 08h00',
      category: 'Segurança & QSMS',
      description:
        'Treinamento prático e verificação preventiva da frota de picapes de supervisão para tráfego seguro em trechos não pavimentados sob condições severas.',
      highlight: false
    }
  ],
  durations: {
    vinheta: 9,
    boletim: 18,
    destaquesPerPhoto: 12,
    galeria: 12,
    equipe: 15,
    aniversariantes: 15,
    comunicados: 15,
    relogio: 15
  },
  motivationalQuote: 'Segurança e Qualidade na Infraestrutura Rodoviária',
  motivationalAuthor: 'Consórcio Matupiri — Modera Engenharia • SCB BIM & GIS',
  weatherLocationId: 'auto_geo',
  weatherManualOverrideCity: '',
  weatherCity: 'Manaus / BR-319 (AM)',
  weatherTemp: 31,
  weatherCondition: 'Parcialmente Nublado • Umidade 74%'
};

/**
 * Formats a bulletin page string cleanly (e.g. "04" -> "Pág. 04", "Pág. 04" -> "Pág. 04")
 */
export function formatBoletimPageLabel(rawPage?: string): string {
  const trimmed = (rawPage || '').trim();
  if (!trimmed) return '';
  if (/^p[áa]g/i.test(trimmed)) {
    return trimmed;
  }
  const num = trimmed.replace(/^0+/, '');
  if (/^\d+$/.test(trimmed)) {
    return `Pág. ${trimmed.padStart(2, '0')}`;
  }
  return `Pág. ${num || trimmed}`;
}

/**
 * Normalizes a Heyzine URL or general flipbook URL so it renders cleanly.
 */
export function normalizeHeyzineUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';
  if (
    trimmed.includes('heyzine.com/flip-book/') &&
    !trimmed.endsWith('.html') &&
    !trimmed.includes('?')
  ) {
    return `${trimmed.replace(/\/$/, '')}.html`;
  }
  return trimmed;
}

/**
 * Extracts the Heyzine Flipbook ID from a URL (e.g. "18f73d8d30").
 */
export function extractHeyzineFlipbookId(boletimUrl: string): string {
  const normalized = normalizeHeyzineUrl(boletimUrl);
  const match = normalized.match(/heyzine\.com\/flip-book\/([a-zA-Z0-9_-]+)/i);
  return match && match[1] ? match[1] : '';
}

/**
 * Builds the Heyzine CDN page image URL:
 * https://cdn.heyzine.com/flip-book/page/[ID]/[PAGINA].jpg
 */
export function resolveHeyzinePageImageUrl(boletimUrl: string, rawPage?: string): string {
  const flipbookId = extractHeyzineFlipbookId(boletimUrl);
  if (!flipbookId || !rawPage) return '';
  const digits = rawPage.replace(/\D/g, '');
  const pageNumber = parseInt(digits, 10);
  if (Number.isNaN(pageNumber) || pageNumber < 1) return '';
  return `https://cdn.heyzine.com/flip-book/page/${flipbookId}/${pageNumber}.jpg`;
}

/**
 * Dynamically extracts the Heyzine Flipbook ID from a Heyzine URL and returns its
 * automatic cover image URL (`https://cdnc.heyzine.com/flip-book/cover/{id}.jpg`).
 * If a custom cover URL is provided, uses that first.
 */
export function resolveBoletimCoverUrl(boletimUrl: string, customCoverUrl?: string): string {
  if (customCoverUrl && customCoverUrl.trim().length > 0) {
    return customCoverUrl.trim();
  }
  const flipbookId = extractHeyzineFlipbookId(boletimUrl);
  if (flipbookId) {
    return `https://cdnc.heyzine.com/flip-book/cover/${flipbookId}.jpg`;
  }
  return FALLBACK_BOLETIM_COVER;
}

export function loadSignageConfig(): SignageConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SIGNAGE_CONFIG;
    const parsed = JSON.parse(raw) as Partial<SignageConfig>;
    return {
      ...DEFAULT_SIGNAGE_CONFIG,
      ...parsed,
      durations: {
        ...DEFAULT_SIGNAGE_CONFIG.durations,
        ...(parsed.durations || {})
      },
      photos: Array.isArray(parsed.photos) ? parsed.photos : DEFAULT_SIGNAGE_CONFIG.photos,
      galleryItems: Array.isArray(parsed.galleryItems)
        ? parsed.galleryItems
        : DEFAULT_SIGNAGE_CONFIG.galleryItems,
      galleryLayoutMode: parsed.galleryLayoutMode || DEFAULT_SIGNAGE_CONFIG.galleryLayoutMode,
      galleryMosaicCount: parsed.galleryMosaicCount || DEFAULT_SIGNAGE_CONFIG.galleryMosaicCount,
      teamMembers: Array.isArray(parsed.teamMembers)
        ? parsed.teamMembers
        : DEFAULT_SIGNAGE_CONFIG.teamMembers,
      birthdays: Array.isArray(parsed.birthdays)
        ? parsed.birthdays
        : DEFAULT_SIGNAGE_CONFIG.birthdays,
      events: Array.isArray(parsed.events) ? parsed.events : DEFAULT_SIGNAGE_CONFIG.events,
      tickerMessages: Array.isArray(parsed.tickerMessages)
        ? parsed.tickerMessages
        : DEFAULT_SIGNAGE_CONFIG.tickerMessages,
      boletimSummary: Array.isArray(parsed.boletimSummary)
        ? parsed.boletimSummary
        : DEFAULT_SIGNAGE_CONFIG.boletimSummary
    };
  } catch {
    return DEFAULT_SIGNAGE_CONFIG;
  }
}

export function saveSignageConfig(config: SignageConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Erro ao salvar configurações no localStorage:', err);
  }
}
