export type SlideId =
  | 'vinheta'
  | 'boletim'
  | 'destaques'
  | 'galeria'
  | 'equipe'
  | 'aniversariantes'
  | 'comunicados'
  | 'relogio';

export type GalleryMediaType = 'image' | 'video';

export type GalleryLayoutMode = 'individual' | 'coletivo' | 'carrossel';

export interface GalleryMediaItem {
  id: string;
  url: string;
  mediaType: GalleryMediaType; // 'image' (PNG/JPG) | 'video' (MP4)
  title: string;
  caption: string;
  location: string; // Ex: "BR-319/AM · Km 112", "BR-230/AM · Humaitá"
  date: string;
}

export interface HighlightPhoto {
  id: string;
  url: string;
  title: string;
  highway: string; // Ex: "BR-319/AM", "BR-230/AM", "Drenagem", "Pontes", "VISITA INSTITUCIONAL"
  description: string;
  date: string;
  boletimPage?: string; // Ex: "04" -> "📖 Confira no Boletim - Pág. 04"
  useHeyzinePageImage?: boolean; // Se true, usa https://cdn.heyzine.com/flip-book/page/[ID]/[PAGINA].jpg
}

export interface TeamMember {
  id: string;
  name: string; // Ex: "Engenheiro Patrick Modera", "Técnico Virgílio Modera"
  role: string; // Cargo
  highway: string; // Rodovia de atuação (ex: "BR-319/AM · Trecho Supervisionado")
  unit: string; // Empresa / Núcleo (ex: "Modera Engenharia • SCB BIM & GIS")
  photoUrl: string;
  recognitionMessage: string; // Mensagem de reconhecimento pelo trabalho prestado
}

export interface BirthdayPerson {
  id: string;
  name: string;
  role: string;
  day: string; // e.g. "10/10"
  unit: string;
  photoUrl: string;
}

export interface ImportantEvent {
  id: string;
  title: string;
  date: string;
  category: 'Curso & Capacitação' | 'Segurança & QSMS' | 'Gestão & BIM/GIS' | 'Institucional DNIT';
  description: string;
  highlight?: boolean;
}

export interface SlideDurations {
  vinheta: number; // default 9s
  boletim: number; // Capa Expandida + QR Code (default 18s)
  destaquesPerPhoto: number; // default 12s (10 a 15s por destaque)
  galeria: number; // Galeria Interativa Dinâmica (default 12s)
  equipe: number; // Conheça a Equipe do Mês (default 15s)
  aniversariantes: number; // default 15s
  comunicados: number; // default 15s
  relogio: number; // Relógio Digital & Previsão do Tempo Semanal (default 15s)
}

export type WeatherLocationPresetId =
  | 'auto_geo'
  | 'manaus_br319'
  | 'humaita_br230'
  | 'labrea_br230'
  | 'porto_velho_br319'
  | 'careiro_br319'
  | 'apui_br230';

export interface SignageConfig {
  customLogoUrl?: string;
  logoVariant?: 'light-badge' | 'dark-adaptive';
  vignetteVideoUrl: string; // MP4 URL or DataURL for the Vinheta
  vignetteTagline?: string; // Frase da vinheta (ex: "Trafegue conosco ⮕")
  vignetteFullscreenEnabled: boolean; // Toggle: Exibir Vinheta em Tela Cheia
  vignetteAsBackground: boolean; // Toggle: Usar Vídeo como Fundo Animado (Glassmorphism)
  boletimUrl: string;
  boletimCoverUrl?: string; // Optional custom cover URL; if empty, auto-derived from Heyzine URL
  boletimMonth: string; // e.g. "Outubro"
  boletimTitle: string;
  boletimEdition: string;
  boletimSummary: string[];
  tickerMessages: string[];
  photos: HighlightPhoto[];
  galleryItems: GalleryMediaItem[]; // Slide "Mural da Galeria Interativa" (Fotos PNG/JPG & Vídeos MP4)
  galleryLayoutMode: GalleryLayoutMode; // 'individual' | 'coletivo' | 'carrossel'
  galleryMosaicCount: 2 | 3 | 4; // Quantidade de itens no Modo Coletivo (Mosaico/Grid)
  teamMembers: TeamMember[]; // Slide "Conheça a Equipe do Mês"
  birthdays: BirthdayPerson[];
  events: ImportantEvent[];
  durations: SlideDurations;
  motivationalQuote: string; // Default: "Segurança e Qualidade na Infraestrutura Rodoviária"
  motivationalAuthor: string;
  weatherLocationId: WeatherLocationPresetId;
  weatherManualOverrideCity?: string; // Ex: "Manaus", "Humaitá", "Lábrea", "Porto Velho"
  weatherCity: string;
  weatherTemp: number;
  weatherCondition: string;
}
