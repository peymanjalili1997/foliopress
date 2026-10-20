import {
  FontOption,
  GlobalDocumentSettings,
  PageSizeSpec,
  PageTemplateId,
  PortfolioBlock,
  PortfolioPage,
} from '../types/portfolio';

export const ENGLISH_FONTS: FontOption[] = [
  // Editorial Serif
  {
    name: 'Cormorant Garamond',
    family: "'Cormorant Garamond', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Architectural Monograph & Spatial Form',
  },
  {
    name: 'Playfair Display',
    family: "'Playfair Display', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'High-Contrast Editorial Exhibition',
  },
  {
    name: 'Fraunces',
    family: "'Fraunces', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Warm Contemporary Old-Style Serif',
  },
  {
    name: 'Bodoni Moda',
    family: "'Bodoni Moda', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Milanese Luxury & Fine Art Press',
  },
  {
    name: 'Libre Baskerville',
    family: "'Libre Baskerville', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Classic Literary & Book Typography',
  },
  {
    name: 'Lora',
    family: "'Lora', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Balanced Contemporary Narrative Prose',
  },
  {
    name: 'Cinzel',
    family: "'Cinzel', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Classical Inscriptional Proportions',
  },
  // Architectural Sans
  {
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Modern Neo-Grotesque Studio Clarity',
  },
  {
    name: 'Outfit',
    family: "'Outfit', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Geometric Precision & Clean Grid',
  },
  {
    name: 'Manrope',
    family: "'Manrope', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Swiss Rationalist Engineering Sans',
  },
  {
    name: 'DM Sans',
    family: "'DM Sans', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Low-Contrast Legible Editorial Body',
  },
  {
    name: 'Archivo',
    family: "'Archivo', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Structured Exhibition & Museum Sans',
  },
  // Display & Avant-Garde
  {
    name: 'Syne',
    family: "'Syne', -apple-system, sans-serif",
    category: 'Display & Avant-Garde',
    sample: 'Art Center Avant-Garde Headline',
  },
  {
    name: 'Bricolage Grotesque',
    family: "'Bricolage Grotesque', -apple-system, sans-serif",
    category: 'Display & Avant-Garde',
    sample: 'Expressive Editorial Display Sans',
  },
  // Technical Mono
  {
    name: 'JetBrains Mono',
    family: "'JetBrains Mono', monospace",
    category: 'Technical Mono',
    sample: '01 · SCALE 1:100 · ELEVATION +14.2M',
  },
  {
    name: 'IBM Plex Mono',
    family: "'IBM Plex Mono', monospace",
    category: 'Technical Mono',
    sample: 'SPEC_SHEET // ARCHIVAL INDEX 2026',
  },
];

export const PAGE_SIZE_PRESETS: PageSizeSpec[] = [
  {
    id: 'a4-portrait',
    label: 'A4 Portrait',
    dimensionsLabel: '210 × 297 mm',
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
    orientation: 'portrait',
  },
  {
    id: 'a4-landscape',
    label: 'A4 Landscape',
    dimensionsLabel: '297 × 210 mm',
    widthMm: 297,
    heightMm: 210,
    widthPx: 1123,
    heightPx: 794,
    orientation: 'landscape',
  },
  {
    id: 'letter-portrait',
    label: 'US Letter Portrait',
    dimensionsLabel: '8.5 × 11 in',
    widthMm: 215.9,
    heightMm: 279.4,
    widthPx: 816,
    heightPx: 1056,
    orientation: 'portrait',
  },
  {
    id: 'letter-landscape',
    label: 'US Letter Landscape',
    dimensionsLabel: '11 × 8.5 in',
    widthMm: 279.4,
    heightMm: 215.9,
    widthPx: 1056,
    heightPx: 816,
    orientation: 'landscape',
  },
  {
    id: 'deck-16-9',
    label: '16:9 Presentation (Landscape)',
    dimensionsLabel: '297 × 167 mm',
    widthMm: 297,
    heightMm: 167,
    widthPx: 1123,
    heightPx: 632,
    orientation: 'landscape',
  },
  {
    id: 'deck-4-3',
    label: '4:3 Slide (Landscape)',
    dimensionsLabel: '297 × 223 mm',
    widthMm: 297,
    heightMm: 222.75,
    widthPx: 1056,
    heightPx: 792,
    orientation: 'landscape',
  },
];

export interface GlobalThemePreset {
  id: string;
  name: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  borderColor: string;
}

export const GLOBAL_THEMES: GlobalThemePreset[] = [
  {
    id: 'warm-archival',
    name: 'Warm Archival Paper',
    subtitle: 'Cotton rag off-white with deep charcoal ink',
    backgroundColor: '#FAF8F5',
    textColor: '#161514',
    mutedTextColor: '#6E6A64',
    accentColor: '#9A3412',
    borderColor: '#E5E0D8',
  },
  {
    id: 'gallery-white',
    name: 'Pure Gallery White',
    subtitle: 'Crisp museum white with stark obsidian contrast',
    backgroundColor: '#FFFFFF',
    textColor: '#111111',
    mutedTextColor: '#666666',
    accentColor: '#2563EB',
    borderColor: '#E5E7EB',
  },
  {
    id: 'alabaster-stone',
    name: 'Alabaster Limestone',
    subtitle: 'Cool mineral gray-white for industrial & product design',
    backgroundColor: '#F3F4F6',
    textColor: '#0F172A',
    mutedTextColor: '#64748B',
    accentColor: '#0F766E',
    borderColor: '#CBD5E1',
  },
  {
    id: 'raw-travertine',
    name: 'Sandstone Monograph',
    subtitle: 'Warm travertine tone inspired by European art books',
    backgroundColor: '#F2ECE1',
    textColor: '#1C1917',
    mutedTextColor: '#78716C',
    accentColor: '#B45309',
    borderColor: '#DCD3C4',
  },
  {
    id: 'obsidian-noir',
    name: 'Obsidian Exhibition',
    subtitle: 'Deep matte carbon canvas with silver-white typography',
    backgroundColor: '#0C0C0E',
    textColor: '#F4F4F6',
    mutedTextColor: '#9CA3AF',
    accentColor: '#EAB308',
    borderColor: '#27272A',
  },
];

export interface FontPairingPreset {
  id: string;
  name: string;
  description: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
}

export const FONT_PAIRINGS: FontPairingPreset[] = [
  {
    id: 'monograph-classic',
    name: 'Venice Architecture Monograph',
    description: 'Cormorant Garamond + Plus Jakarta Sans',
    headingFont: "'Cormorant Garamond', Georgia, serif",
    bodyFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
    monoFont: "'JetBrains Mono', monospace",
  },
  {
    id: 'swiss-rational',
    name: 'Zurich Industrial Studio',
    description: 'Outfit + Manrope + IBM Plex Mono',
    headingFont: "'Outfit', -apple-system, sans-serif",
    bodyFont: "'Manrope', -apple-system, sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
  {
    id: 'avant-garde-gallery',
    name: 'Contemporary Art Biennal',
    description: 'Syne + DM Sans',
    headingFont: "'Syne', -apple-system, sans-serif",
    bodyFont: "'DM Sans', -apple-system, sans-serif",
    monoFont: "'JetBrains Mono', monospace",
  },
  {
    id: 'editorial-luxury',
    name: 'Milanese Editorial Press',
    description: 'Bodoni Moda + Plus Jakarta Sans',
    headingFont: "'Bodoni Moda', Georgia, serif",
    bodyFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
  {
    id: 'literary-curator',
    name: 'Curatorial Essay & Exhibition',
    description: 'Fraunces + Lora',
    headingFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Lora', Georgia, serif",
    monoFont: "'JetBrains Mono', monospace",
  },
];

// Helper to encode SVG cleanly as a data URI for zero-latency, infinite-DPI PDF rendering
function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export interface CuratedVisualPlate {
  id: string;
  title: string;
  category: string;
  aspect: string;
  url: string;
}

export const CURATED_VISUAL_PLATES: CuratedVisualPlate[] = [
  {
    id: 'plate-concrete-pavilion',
    title: 'Coastal Concrete Pavilion — Horizon Study',
    category: 'Architecture',
    aspect: '16:10',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 780" width="1200" height="780">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#D9D2C5"/>
            <stop offset="62%" stop-color="#EAE4D8"/>
            <stop offset="100%" stop-color="#C8BFA8"/>
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#2D373C"/>
            <stop offset="50%" stop-color="#3F4D54"/>
            <stop offset="100%" stop-color="#242C30"/>
          </linearGradient>
          <linearGradient id="wallLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#F3EFE6"/>
            <stop offset="100%" stop-color="#D5CCBC"/>
          </linearGradient>
          <linearGradient id="wallShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4A463F"/>
            <stop offset="100%" stop-color="#2B2925"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="780" fill="url(#sky)"/>
        <!-- Warm low sun disc -->
        <circle cx="880" cy="340" r="115" fill="#F7EFE0" opacity="0.75"/>
        <!-- Distant sea horizon -->
        <rect x="0" y="450" width="1200" height="120" fill="url(#sea)"/>
        <!-- Foreground travertine terrace -->
        <polygon points="0,570 1200,570 1200,780 0,780" fill="#CFC6B4"/>
        <!-- Long architectural cast shadow -->
        <polygon points="0,570 740,570 980,780 0,780" fill="#23211E" opacity="0.85"/>
        <!-- Brutalist cantilevered roof slab -->
        <polygon points="80,150 960,150 910,235 80,235" fill="url(#wallLight)"/>
        <polygon points="80,235 910,235 875,265 80,265" fill="url(#wallShadow)"/>
        <!-- Left monolithic concrete wall -->
        <rect x="80" y="235" width="230" height="395" fill="url(#wallShadow)"/>
        <!-- Illuminated inner courtyard column -->
        <rect x="520" y="265" width="76" height="335" fill="url(#wallLight)"/>
        <rect x="596" y="265" width="28" height="335" fill="url(#wallShadow)"/>
        <!-- Reflected water pool -->
        <polygon points="310,595 890,595 960,730 260,730" fill="#1E2528"/>
        <line x1="310" y1="595" x2="890" y2="595" stroke="#EAE4D8" stroke-width="2" opacity="0.6"/>
        <!-- Subtle architectural grid lines -->
        <line x1="80" y1="390" x2="310" y2="390" stroke="#181715" stroke-width="1.5" opacity="0.35"/>
        <line x1="195" y1="235" x2="195" y2="630" stroke="#181715" stroke-width="1.5" opacity="0.35"/>
      </svg>
    `),
  },
  {
    id: 'plate-travertine-gallery',
    title: 'Gallery Atrium — Natural Light & Stone',
    category: 'Interior Architecture',
    aspect: '4:3',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
        <defs>
          <linearGradient id="bgWall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#EBE5DA"/>
            <stop offset="100%" stop-color="#D2C8B8"/>
          </linearGradient>
          <linearGradient id="sunBeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#F5EFE4" stop-opacity="0.2"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="900" fill="url(#bgWall)"/>
        <!-- Recessed gallery alcove -->
        <rect x="180" y="90" width="520" height="580" fill="#C2B7A4"/>
        <polygon points="180,90 235,140 235,620 180,670" fill="#8C8270"/>
        <rect x="235" y="140" width="465" height="480" fill="#DFD7C8"/>
        <!-- Diagonal window light beam -->
        <polygon points="420,0 790,0 1120,670 670,670" fill="url(#sunBeam)"/>
        <!-- Minimalist sculptural plinth -->
        <rect x="370" y="420" width="190" height="250" fill="#F4F0E8"/>
        <polygon points="560,420 605,400 605,645 560,670" fill="#9E9483"/>
        <!-- Sculptural bronze vessel on plinth -->
        <circle cx="465" cy="360" r="58" fill="#2A2421"/>
        <path d="M 435 305 Q 465 260 495 305 Z" fill="#473E39"/>
        <!-- Floor plane -->
        <polygon points="0,670 1200,670 1200,900 0,900" fill="#B5AA97"/>
        <polygon points="370,670 605,645 920,900 540,900" fill="#6E6557" opacity="0.55"/>
        <!-- Fine architectural joint lines -->
        <line x1="0" y1="670" x2="1200" y2="670" stroke="#7A7062" stroke-width="1.5"/>
        <line x1="700" y1="0" x2="700" y2="670" stroke="#B5AA97" stroke-width="1.5"/>
      </svg>
    `),
  },
  {
    id: 'plate-industrial-lamp',
    title: 'Luminance 04 — Anodized Aluminum Lamp',
    category: 'Industrial Design',
    aspect: '1:1',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900">
        <defs>
          <linearGradient id="studioBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E6E7E9"/>
            <stop offset="70%" stop-color="#D4D6DA"/>
            <stop offset="100%" stop-color="#B8BBC2"/>
          </linearGradient>
          <linearGradient id="metalCylinder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#52565E"/>
            <stop offset="28%" stop-color="#D8DCE3"/>
            <stop offset="55%" stop-color="#9FA5B0"/>
            <stop offset="85%" stop-color="#2E3136"/>
            <stop offset="100%" stop-color="#6C717A"/>
          </linearGradient>
          <radialGradient id="warmGlow" cx="50%" cy="55%" r="45%">
            <stop offset="0%" stop-color="#FFF3D1" stop-opacity="0.95"/>
            <stop offset="50%" stop-color="#F5D08A" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#E6E7E9" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="900" height="900" fill="url(#studioBg)"/>
        <!-- Stone pedestal surface -->
        <rect x="0" y="660" width="900" height="240" fill="#C5C7CC"/>
        <line x1="0" y1="660" x2="900" y2="660" stroke="#999CA3" stroke-width="2"/>
        <!-- Soft cast shadow -->
        <ellipse cx="530" cy="685" rx="210" ry="26" fill="#4B4E54" opacity="0.45"/>
        <!-- Warm ambient light halo -->
        <circle cx="450" cy="410" r="290" fill="url(#warmGlow)"/>
        <!-- Lamp monolithic base -->
        <rect x="372" y="340" width="156" height="335" rx="6" fill="url(#metalCylinder)"/>
        <!-- Lamp cantilevered dome shade -->
        <path d="M 210 355 C 210 195, 690 195, 690 355 Z" fill="url(#metalCylinder)"/>
        <ellipse cx="450" cy="355" rx="240" ry="22" fill="#FFF9EB"/>
        <!-- Technical dimension ticks -->
        <line x1="150" y1="235" x2="150" y2="675" stroke="#52565E" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="115" y="460" fill="#52565E" font-family="monospace" font-size="14" transform="rotate(-90 115 460)">H: 420 MM</text>
      </svg>
    `),
  },
  {
    id: 'plate-axonometric-grid',
    title: 'Modular Timber System — Structural Axonometric',
    category: 'Technical Drawing',
    aspect: '4:3',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
        <rect width="1200" height="900" fill="#141619"/>
        <!-- Blueprint fine coordinate grid -->
        <g stroke="#23272E" stroke-width="1">
          <line x1="0" y1="150" x2="1200" y2="150"/><line x1="0" y1="300" x2="1200" y2="300"/>
          <line x1="0" y1="450" x2="1200" y2="450"/><line x1="0" y1="600" x2="1200" y2="600"/>
          <line x1="0" y1="750" x2="1200" y2="750"/>
          <line x1="200" y1="0" x2="200" y2="900"/><line x1="400" y1="0" x2="400" y2="900"/>
          <line x1="600" y1="0" x2="600" y2="900"/><line x1="800" y1="0" x2="800" y2="900"/>
          <line x1="1000" y1="0" x2="1000" y2="900"/>
        </g>
        <!-- Isometric architectural frame -->
        <g stroke="#E2E8F0" stroke-width="2" fill="none">
          <polygon points="600,140 960,320 600,500 240,320" fill="#1E232B" fill-opacity="0.7"/>
          <polygon points="600,340 960,520 600,700 240,520" fill="#252B35" fill-opacity="0.7"/>
          <line x1="240" y1="320" x2="240" y2="660"/>
          <line x1="600" y1="500" x2="600" y2="840"/>
          <line x1="960" y1="320" x2="960" y2="660"/>
          <line x1="420" y1="230" x2="420" y2="570" stroke="#94A3B8" stroke-dasharray="6 6"/>
          <line x1="780" y1="230" x2="780" y2="570" stroke="#94A3B8" stroke-dasharray="6 6"/>
        </g>
        <!-- Highlighted structural core -->
        <polygon points="510,275 690,365 600,410 420,320" fill="#D97706" fill-opacity="0.35" stroke="#F59E0B" stroke-width="2"/>
        <!-- Technical annotations -->
        <text x="76" y="88" fill="#94A3B8" font-family="monospace" font-size="16" letter-spacing="2">DWG NO. A-402 // AXONOMETRIC PROJECTION</text>
        <text x="76" y="835" fill="#64748B" font-family="monospace" font-size="14">SCALE 1:50  ·  CLT TIMBER MATRIX  ·  ZURICH STUDIO</text>
      </svg>
    `),
  },
  {
    id: 'plate-portrait-architect',
    title: 'Studio Principal — Monochrome Portrait',
    category: 'Editorial Portrait',
    aspect: '3:4',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1040" width="800" height="1040">
        <defs>
          <linearGradient id="portraitBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#222220"/>
            <stop offset="100%" stop-color="#111110"/>
          </linearGradient>
          <linearGradient id="rimLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#EAE6DF"/>
            <stop offset="35%" stop-color="#9E9A93"/>
            <stop offset="100%" stop-color="#1C1C1A"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1040" fill="url(#portraitBg)"/>
        <!-- Dramatic architectural background shadow slash -->
        <polygon points="0,0 520,0 180,1040 0,1040" fill="#2E2D2A"/>
        <!-- Minimalist editorial portrait bust silhouette with rim light -->
        <circle cx="410" cy="370" r="128" fill="url(#rimLight)"/>
        <path d="M 175 1040 C 175 720, 300 585, 410 585 C 520 585, 645 720, 645 1040 Z" fill="#161615" stroke="#5A5751" stroke-width="2"/>
        <!-- High-neck collar detail -->
        <rect x="348" y="520" width="124" height="75" rx="8" fill="#0B0B0A" stroke="#6E6A63" stroke-width="1.5"/>
        <!-- Subtle golden ratio composition lines -->
        <line x1="60" y1="60" x2="740" y2="60" stroke="#5A5751" stroke-width="1" opacity="0.5"/>
        <line x1="60" y1="980" x2="740" y2="980" stroke="#5A5751" stroke-width="1" opacity="0.5"/>
      </svg>
    `),
  },
  {
    id: 'plate-nordic-courtyard',
    title: 'Nordic Museum Wing — Daylight Study',
    category: 'Architecture',
    aspect: '16:10',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 780" width="1200" height="780">
        <rect width="1200" height="780" fill="#E9ECEE"/>
        <!-- Rhythmic colonnade -->
        <g fill="#CFD5D9">
          <rect x="110" y="100" width="75" height="510"/>
          <rect x="290" y="100" width="75" height="510"/>
          <rect x="470" y="100" width="75" height="510"/>
          <rect x="650" y="100" width="75" height="510"/>
          <rect x="830" y="100" width="75" height="510"/>
          <rect x="1010" y="100" width="75" height="510"/>
        </g>
        <!-- Illuminated faces of columns -->
        <g fill="#F9FAFB">
          <rect x="92" y="100" width="18" height="510"/>
          <rect x="272" y="100" width="18" height="510"/>
          <rect x="452" y="100" width="18" height="510"/>
          <rect x="632" y="100" width="18" height="510"/>
          <rect x="812" y="100" width="18" height="510"/>
          <rect x="992" y="100" width="18" height="510"/>
        </g>
        <!-- Upper entablature beam -->
        <rect x="60" y="40" width="1080" height="65" fill="#DFE4E7"/>
        <line x1="60" y1="105" x2="1140" y2="105" stroke="#9AA5B1" stroke-width="2"/>
        <!-- Polished concrete floor with diagonal sun stripes -->
        <rect x="0" y="610" width="1200" height="170" fill="#B8C0C7"/>
        <g fill="#F1F5F9" opacity="0.65">
          <polygon points="185,610 272,610 170,780 80,780"/>
          <polygon points="365,610 452,610 350,780 260,780"/>
          <polygon points="545,610 632,610 530,780 440,780"/>
          <polygon points="725,610 812,610 710,780 620,780"/>
          <polygon points="905,610 992,610 890,780 800,780"/>
        </g>
      </svg>
    `),
  },
];

export interface PageTemplateDescriptor {
  id: PageTemplateId;
  name: string;
  description: string;
  badge: string;
}

export const PAGE_TEMPLATES: PageTemplateDescriptor[] = [
  {
    id: 'cover-monograph',
    name: 'Cover Monograph',
    description: 'Oversized editorial title, curated subtitle, hero plate, and issue credits.',
    badge: 'Cover',
  },
  {
    id: 'editorial-split',
    name: 'Editorial Split',
    description: 'Asymmetric side-by-side visual plate and structured project narrative.',
    badge: 'Split',
  },
  {
    id: 'visual-showcase',
    name: 'Visual Showcase',
    description: 'Full-width architectural plate with technical specification matrix.',
    badge: 'Showcase',
  },
  {
    id: 'dual-comparison',
    name: 'Dual Plate Comparison',
    description: 'Two parallel visual plates with spatial commentary and captions.',
    badge: 'Dual',
  },
  {
    id: 'case-study',
    name: 'Case Study Essay',
    description: 'Two-column critical essay, pull quote, and wide visual documentation.',
    badge: 'Essay',
  },
  {
    id: 'biography-cv',
    name: 'Practice & Curriculum Vitae',
    description: 'Portrait plate, studio philosophy statement, and chronological index.',
    badge: 'Profile',
  },
  {
    id: 'uiux-casestudy',
    name: 'Digital Product & UI/UX Case Study',
    description: 'MacBook/iPhone screen mockup, design challenge narrative, and project color palette.',
    badge: 'UI/UX',
  },
  {
    id: 'architecture-detail',
    name: 'Architectural Details & Materials',
    description: '3-photo material detail strip, structural specs, and project narrative.',
    badge: 'Detail',
  },
  {
    id: 'photo-lookbook',
    name: 'Photographic Lookbook Spread',
    description: 'Full-bleed imagery, pull quote, and technical tools execution stack.',
    badge: 'Lookbook',
  },
  {
    id: 'contact-qr',
    name: 'Contact & Interactive Scan',
    description: 'Interactive scannable QR code, project index, and artist signature statement.',
    badge: 'Contact',
  },
];

let idCounter = 100;
export function createUid(prefix = 'blk'): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function createBlocksForTemplate(
  templateId: PageTemplateId,
  headingFont: string,
  bodyFont: string,
  monoFont: string
): PortfolioBlock[] {
  switch (templateId) {
    case 'cover-monograph':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'SELECTED ARCHITECTURAL & SPATIAL WORKS · 2022–2026',
          text: 'SILENCE IN MONOLITHIC FORM',
          secondaryText:
            'An archival monograph examining light, raw travertine, and cantilevered coastal structures across Northern Europe and the Mediterranean.',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 48,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.08,
            letterSpacing: -0.02,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'image',
          imageUrl: CURATED_VISUAL_PLATES[0].url,
          imageCaption: 'Fig 01. Cliffside Concrete Pavilion, Mallorca — South Elevation at Dusk.',
          imageStyle: {
            height: 460,
            objectFit: 'cover',
            zoom: 1,
            filter: 'none',
            borderRadius: 0,
            showBorder: false,
          },
          textStyle: {
            fontFamily: monoFont,
            fontSize: 11,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0.03,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'spec-grid',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 12,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.5,
            letterSpacing: 0,
            textTransform: 'none',
          },
          specs: [
            { id: createUid('sp'), label: 'PRINCIPAL ARCHITECT', value: 'Julian Vance, RIBA' },
            { id: createUid('sp'), label: 'PRACTICE LOCATION', value: 'Zurich · London' },
            { id: createUid('sp'), label: 'EDITION', value: 'First Archival Monograph' },
            { id: createUid('sp'), label: 'INQUIRIES', value: 'studio@vance-arch.ch' },
          ],
        },
      ];

    case 'editorial-split':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'PROJECT 01 · CULTURAL INFRASTRUCTURE',
          text: 'Kunsthalle Atrium & Limestone Archive',
          secondaryText: 'Basel, Switzerland — Completed Autumn 2025',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 34,
            fontWeight: 500,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'split-media-text',
          splitDirection: 'image-right',
          splitRatio: '50-50',
          imageUrl: CURATED_VISUAL_PLATES[1].url,
          imageCaption: 'Interior gallery alcove carved from Jura limestone blocks.',
          imageStyle: {
            height: 410,
            objectFit: 'cover',
            zoom: 1,
            filter: 'none',
            borderRadius: 0,
            showBorder: false,
          },
          text: 'Conceived as a vessel for slow contemplation, the Kunsthalle extension replaces ornamental facade treatments with load-bearing Jura travertine walls. Natural daylight enters exclusively through a sawtooth roof lantern, casting calibrated diagonal geometry across the exhibition plinths throughout the solar cycle.\n\nAcoustic stillness is achieved through microporous mineral plaster and recessed oak floor channels that conceal all mechanical ventilation.',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 14,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.7,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'spec-grid',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 12,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.5,
            letterSpacing: 0,
            textTransform: 'none',
          },
          specs: [
            { id: createUid('sp'), label: 'GROSS FLOOR AREA', value: '4,850 m²' },
            { id: createUid('sp'), label: 'PRIMARY MATERIAL', value: 'Honed Jura Travertine' },
            { id: createUid('sp'), label: 'DAYLIGHT FACTOR', value: '4.2% Mean Zenithal' },
            { id: createUid('sp'), label: 'COMMISSION', value: 'International Competition 1st Prize' },
          ],
        },
      ];

    case 'visual-showcase':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'PROJECT 02 · STRUCTURAL AXONOMETRIC',
          text: 'Timber Matrix & Modular Span System',
          secondaryText: 'Cross-laminated spruce grid engineered for column-free exhibition halls.',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 32,
            fontWeight: 500,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'image',
          imageUrl: CURATED_VISUAL_PLATES[3].url,
          imageCaption: 'Drawing A-402 — Exploded isometric projection of the 24-meter timber cassette.',
          imageStyle: {
            height: 440,
            objectFit: 'cover',
            zoom: 1,
            filter: 'none',
            borderRadius: 0,
            showBorder: true,
          },
          textStyle: {
            fontFamily: monoFont,
            fontSize: 11,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0.02,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'paragraph',
          text: 'By pre-tensioning hollow timber box beams with concealed carbon-fiber tendons, the roof diaphragm achieves a 24-meter clear span at half the embodied carbon of conventional steel trusses. Each cassette module integrates acoustic baffling and museum-grade track lighting within a 650mm structural depth.',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 14,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.65,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
      ];

    case 'dual-comparison':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'PROJECT 03 · INDUSTRIAL & TACTILE OBJECTS',
          text: 'Materiality at Human Scale',
          secondaryText: 'Bespoke architectural hardware and luminaire editions developed for the permanent collection.',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 32,
            fontWeight: 500,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'dual-image',
          imageUrl: CURATED_VISUAL_PLATES[2].url,
          imageCaption: 'Plate I. Luminance 04 — Turned solid aluminum table lamp (2700K warm diffuser).',
          secondaryImageUrl: CURATED_VISUAL_PLATES[5].url,
          secondaryImageCaption: 'Plate II. Nordic Wing Colonnade — Precast white mineral concrete rhythm.',
          imageStyle: {
            height: 340,
            objectFit: 'cover',
            zoom: 1,
            filter: 'none',
            borderRadius: 0,
            showBorder: false,
          },
          textStyle: {
            fontFamily: monoFont,
            fontSize: 11,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0.02,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'two-column-text',
          text: 'Every architectural space is experienced through the objects that mediate touch and illumination. Turned from a single billet of recycled 6061 aluminum, the Luminance 04 table lamp translates the cantilevered proportions of our civic pavilions into an intimate domestic artifact.',
          secondaryText: 'The adjoining colonnade study demonstrates how identical geometric ratios govern both macro-scale structural columns and micro-scale luminaire apertures—establishing a continuous visual grammar across scales.',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 13.5,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.65,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
      ];

    case 'case-study':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'CRITICAL ESSAY · SPATIAL TECTONICS',
          text: 'Architecture as Measured Light',
          secondaryText: 'Notes on permanence, weathering, and quietude in contemporary civic building.',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 36,
            fontWeight: 400,
            fontStyle: 'italic',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'pull-quote',
          text: '“True permanence is not resistance to time, but the capacity of raw stone and timber to record the passage of light with dignity.”',
          kicker: '— JULIAN VANCE, ETH ZURICH LECTURE SERIES',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 22,
            fontWeight: 400,
            fontStyle: 'italic',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'two-column-text',
          text: 'When contemporary buildings rely on synthetic cladding systems, they sever the relationship between structural mass and atmospheric perception. In our studio methodology, every wall thickness is calibrated first by thermal inertia and acoustic attenuation, and second by the depth of shadow it casts at equinox.',
          secondaryText: 'Across twelve realized commissions in Switzerland, Spain, and Denmark, we have restricted our palette to four primary materials: board-formed limestone concrete, untreated European oak, raw anodized aluminum, and lime-washed brick.',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 13.5,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.68,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'image',
          imageUrl: CURATED_VISUAL_PLATES[5].url,
          imageCaption: 'Fig 04. Rhythm of cast-in-situ columns along the western cloister.',
          imageStyle: {
            height: 290,
            objectFit: 'cover',
            zoom: 1,
            filter: 'none',
            borderRadius: 0,
            showBorder: false,
          },
          textStyle: {
            fontFamily: monoFont,
            fontSize: 11,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0.02,
            textTransform: 'none',
          },
        },
      ];

    case 'biography-cv':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'STUDIO PROFILE & ARCHIVAL INDEX',
          text: 'Julian Vance & Associates',
          secondaryText: 'Architectural Practice, Industrial Objects & Curatorial Research',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 34,
            fontWeight: 500,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'split-media-text',
          splitDirection: 'image-left',
          splitRatio: '40-60',
          imageUrl: CURATED_VISUAL_PLATES[4].url,
          imageCaption: 'Julian Vance — Studio Principal, Zurich.',
          imageStyle: {
            height: 340,
            objectFit: 'cover',
            zoom: 1,
            filter: 'grayscale',
            borderRadius: 0,
            showBorder: false,
          },
          text: 'Founded in Zurich in 2018, Julian Vance & Associates operates at the intersection of civic architecture, exhibition design, and industrial object fabrication.\n\nFollowing graduate studies at ETH Zurich and architectural apprenticeships in Basel and Tokyo, Vance established the practice to pursue rigorous material economy and timeless spatial proportion. The studio’s work has been exhibited at the Venice Architecture Biennale and published in leading international monographs.',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 14,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.68,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'spec-grid',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 12,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.5,
            letterSpacing: 0,
            textTransform: 'none',
          },
          specs: [
            { id: createUid('sp'), label: '2025 · SWISS ART AWARD', value: 'Winner — Architecture & Spatial Design' },
            { id: createUid('sp'), label: '2024 · VENICE BIENNALE', value: 'Invited Exhibitor, Arsenale Pavilion' },
            { id: createUid('sp'), label: '2022 · VISITING PROFESSOR', value: 'EPFL Lausanne Department of Architecture' },
            { id: createUid('sp'), label: 'EDUCATION', value: 'M.Sc. Architecture, ETH Zurich (Distinction)' },
          ],
        },
      ];

    case 'uiux-casestudy':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'CASE STUDY 04 · DIGITAL PRODUCT & PLATFORM',
          text: 'Vance Spatial Systems — Web Monograph & 3D Viewer',
          secondaryText: 'Responsive web platform and high-fidelity archival viewer for global architecture firms.',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 34,
            fontWeight: 500,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'device-mockup',
          deviceType: 'macbook',
          imageUrl: CURATED_VISUAL_PLATES[0].url,
          imageCaption: 'Fig 01. Desktop interactive catalog running on WebGL rendering engine.',
          textStyle: {
            fontFamily: monoFont,
            fontSize: 11,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'center',
            lineHeight: 1.4,
            letterSpacing: 0.02,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'color-palette',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 12,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.5,
            letterSpacing: 0,
            textTransform: 'none',
          },
          swatches: [
            { id: 'sw-1', hex: '#0C0C0E', name: 'Obsidian Noir', code: 'Surface 900' },
            { id: 'sw-2', hex: '#FAF8F5', name: 'Alabaster Paper', code: 'Base Canvas' },
            { id: 'sw-3', hex: '#2563EB', name: 'Cobalt Focus', code: 'Action Accent' },
            { id: 'sw-4', hex: '#E5E7EB', name: 'Hairline Stone', code: 'Divider 200' },
          ],
        },
        {
          id: createUid('blk'),
          type: 'project-meta',
          toolsList: ['Figma Pro', 'React 19', 'Three.js / WebGL', 'Tailwind CSS', 'TypeScript'],
          textStyle: {
            fontFamily: monoFont,
            fontSize: 11,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
      ];

    case 'architecture-detail':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'MATERIAL STUDIES · TECTONIC ASSEMBLY',
          text: 'Jura Limestone & Cast Bronze Hardware',
          secondaryText: 'Detail joinery and daylight study across the north galleria arcade.',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 32,
            fontWeight: 500,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'multi-photo-grid',
          textStyle: {
            fontFamily: monoFont,
            fontSize: 11,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0.02,
            textTransform: 'none',
          },
          gridImages: [
            { id: 'img-1', url: CURATED_VISUAL_PLATES[1].url, caption: 'Detail A — Honed travertine plinth' },
            { id: 'img-2', url: CURATED_VISUAL_PLATES[2].url, caption: 'Detail B — Anodized aluminum diffuser' },
            { id: 'img-3', url: CURATED_VISUAL_PLATES[3].url, caption: 'Detail C — Timber cassette junction' },
          ],
        },
        {
          id: createUid('blk'),
          type: 'color-palette',
          swatches: [
            { id: 'sw-1', hex: '#1C1917', name: 'Basalt Carbon', code: 'Exterior Metal' },
            { id: 'sw-2', hex: '#D2C8B8', name: 'Jura Travertine', code: 'Loadbearing Stone' },
            { id: 'sw-3', hex: '#B45309', name: 'Cast Bronze', code: 'Hardware Accent' },
            { id: 'sw-4', hex: '#EBE5DA', name: 'Mineral Lime Plaster', code: 'Interior Finish' },
          ],
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 12,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.5,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
      ];

    case 'photo-lookbook':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'PHOTOGRAPHY MONOGRAPH · MONOCHROME EDITION',
          text: 'Shadows of the Mediterranean',
          secondaryText: 'A documentary photographic portfolio captured with 35mm natural window light.',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 36,
            fontWeight: 400,
            fontStyle: 'italic',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'image',
          imageUrl: CURATED_VISUAL_PLATES[4].url,
          imageCaption: 'Plate 08. Monochrome portrait study — Leica M11 · Summilux 35mm f/1.4 · ISO 100.',
          imageStyle: {
            height: 440,
            objectFit: 'cover',
            zoom: 1,
            filter: 'grayscale',
            borderRadius: 0,
            showBorder: false,
          },
          textStyle: {
            fontFamily: monoFont,
            fontSize: 11,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0.02,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'pull-quote',
          text: '“Light creates the room. Shadow gives it silence and memory.”',
          kicker: '— FIELD NOTES FROM MALLORCA & BASEL',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 22,
            fontWeight: 400,
            fontStyle: 'italic',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.4,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
      ];

    case 'contact-qr':
      return [
        {
          id: createUid('blk'),
          type: 'heading',
          kicker: 'EPILOGUE & ARCHIVAL INDEX',
          text: 'Connect & Experience the Full Work',
          secondaryText: 'Selected works, academic lectures, and collaborative commissions across Europe.',
          textStyle: {
            fontFamily: headingFont,
            fontSize: 34,
            fontWeight: 500,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.15,
            letterSpacing: -0.01,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'qr-code',
          qrUrl: 'https://peymanjalili1997.github.io/foliopress/',
          qrTitle: 'Scan to View Full Digital Archive & Interactive Prototypes',
          qrSubtitle:
            'Use any smartphone camera to scan this code and view responsive live websites, video showreels, and verified client testimonials.',
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 13,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.5,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
        {
          id: createUid('blk'),
          type: 'spec-grid',
          specs: [
            { id: createUid('sp'), label: 'DIRECT INQUIRY', value: 'julian@vance-studio.ch' },
            { id: createUid('sp'), label: 'STUDIO LOCATION', value: 'Zurich · Neugasse 29' },
            { id: createUid('sp'), label: 'ONLINE PORTFOLIO', value: 'peymanjalili1997.github.io/foliopress' },
            { id: createUid('sp'), label: 'REPRESENTATION', value: 'Zurich Architecture Agency' },
          ],
          textStyle: {
            fontFamily: bodyFont,
            fontSize: 12,
            fontWeight: 400,
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.5,
            letterSpacing: 0,
            textTransform: 'none',
          },
        },
      ];
  }
}

export const INITIAL_GLOBAL_SETTINGS: GlobalDocumentSettings = {
  portfolioTitle: 'STUDIO VANCE — SELECTED WORKS',
  authorName: 'JULIAN VANCE, RIBA',
  issueYear: '2026 ARCHIVAL EDITION',
  pageSize: 'a4-portrait',
  themeId: 'warm-archival',
  backgroundColor: '#FAF8F5',
  textColor: '#161514',
  mutedTextColor: '#6E6A64',
  accentColor: '#9A3412',
  borderColor: '#E5E0D8',
  headingFont: "'Cormorant Garamond', Georgia, serif",
  bodyFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
  monoFont: "'JetBrains Mono', monospace",
  pageMargin: 56,
  showRunningHeader: true,
  showRunningFooter: true,
  pageNumberStyle: 'leading-zero',
  headerLeftText: 'STUDIO VANCE · ZURICH / LONDON',
  headerRightText: 'ARCHITECTURAL MONOGRAPH 2022–2026',
  footerLeftText: 'ALL RIGHTS RESERVED · ARCHIVAL PORTFOLIO',
};

export const INITIAL_PAGES: PortfolioPage[] = [
  {
    id: 'page-1',
    title: 'Cover Monograph',
    sectionLabel: '01 · Cover',
    templateId: 'cover-monograph',
    hideHeader: true,
    hideFooter: false,
    blocks: createBlocksForTemplate(
      'cover-monograph',
      INITIAL_GLOBAL_SETTINGS.headingFont,
      INITIAL_GLOBAL_SETTINGS.bodyFont,
      INITIAL_GLOBAL_SETTINGS.monoFont
    ),
  },
  {
    id: 'page-2',
    title: 'Kunsthalle Atrium',
    sectionLabel: '02 · Cultural',
    templateId: 'editorial-split',
    hideHeader: false,
    hideFooter: false,
    blocks: createBlocksForTemplate(
      'editorial-split',
      INITIAL_GLOBAL_SETTINGS.headingFont,
      INITIAL_GLOBAL_SETTINGS.bodyFont,
      INITIAL_GLOBAL_SETTINGS.monoFont
    ),
  },
  {
    id: 'page-3',
    title: 'Materiality & Objects',
    sectionLabel: '03 · Objects',
    templateId: 'dual-comparison',
    hideHeader: false,
    hideFooter: false,
    blocks: createBlocksForTemplate(
      'dual-comparison',
      INITIAL_GLOBAL_SETTINGS.headingFont,
      INITIAL_GLOBAL_SETTINGS.bodyFont,
      INITIAL_GLOBAL_SETTINGS.monoFont
    ),
  },
  {
    id: 'page-4',
    title: 'Practice & Biography',
    sectionLabel: '04 · Profile',
    templateId: 'biography-cv',
    hideHeader: false,
    hideFooter: false,
    blocks: createBlocksForTemplate(
      'biography-cv',
      INITIAL_GLOBAL_SETTINGS.headingFont,
      INITIAL_GLOBAL_SETTINGS.bodyFont,
      INITIAL_GLOBAL_SETTINGS.monoFont
    ),
  },
];
