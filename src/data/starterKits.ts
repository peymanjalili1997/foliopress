import { GlobalDocumentSettings, PageSizeId, PortfolioPage } from '../types/portfolio';
import { createBlocksForTemplate } from './editorialAssets';

export interface StarterKit {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  orientation: 'portrait' | 'landscape';
  pageSize: PageSizeId;
  pageCount: number;
  description: string;
  themeId: string;
  globalSettings: Partial<GlobalDocumentSettings>;
  pages: PortfolioPage[];
}

export const STARTER_KITS: StarterKit[] = [
  {
    id: 'global-case-study',
    name: 'Global 6-Part Case Study Kit',
    subtitle: 'High-Converting International Freelance Standard',
    badge: '4 Pages · A4 Landscape',
    orientation: 'landscape',
    pageSize: 'a4-landscape',
    pageCount: 4,
    description:
      'Engineered specifically for winning international freelance & studio commissions: includes Landscape Hero, Story & 3-Column Services Matrix, Full 6-Part Client Case Study, and Before/After deliverables with verified testimonials.',
    themeId: 'swiss-minimal',
    globalSettings: {
      pageSize: 'a4-landscape',
      themeId: 'swiss-minimal',
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      mutedTextColor: '#6B7280',
      accentColor: '#B45309',
      borderColor: '#E5E7EB',
      headingFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
      bodyFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      pageMargin: 48,
      headerLeftText: 'PEYMAN JALILI · GLOBAL CLIENT CASE STUDIES',
      headerRightText: 'SELECTED COMMISSIONS 2026',
      footerLeftText: 'CONFIDENTIAL WORK SAMPLES · ALL RIGHTS RESERVED',
    },
    pages: [
      {
        id: 'kit-gcs-p1',
        title: 'Landscape Title Sheet',
        sectionLabel: '01 · Project Overview',
        templateId: 'cover-landscape',
        pageSizeOverride: 'a4-landscape',
        hideHeader: true,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'cover-landscape',
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
      {
        id: 'kit-gcs-p2',
        title: 'Story, Vision & Service Matrix',
        sectionLabel: '02 · Studio Capabilities',
        templateId: 'story-services-intro',
        pageSizeOverride: 'a4-landscape',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'story-services-intro',
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
      {
        id: 'kit-gcs-p3',
        title: '6-Part In-Depth Client Case Study',
        sectionLabel: '03 · Flagship Project',
        templateId: 'case-study-6step',
        pageSizeOverride: 'a4-landscape',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'case-study-6step',
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
      {
        id: 'kit-gcs-p4',
        title: 'Deliverables & Before / After',
        sectionLabel: '04 · Transformation Proof',
        templateId: 'before-after-spread',
        pageSizeOverride: 'a4-landscape',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'before-after-spread',
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
    ],
  },
  {
    id: 'architecture-monograph',
    name: 'Architectural Monograph',
    subtitle: 'Minimalist Travertine & Spatial Volume',
    badge: '4 Pages · A4 Portrait',
    orientation: 'portrait',
    pageSize: 'a4-portrait',
    pageCount: 4,
    description:
      'Complete publication monograph layout featuring a cover sheet, architectural narrative, high-resolution visual plate spread, and project specifications.',
    themeId: 'warm-archival',
    globalSettings: {
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
      headerLeftText: 'STUDIO VANCE · ARCHITECTURAL WORKS',
      headerRightText: 'MONOGRAPH 2026',
      footerLeftText: 'ALL RIGHTS RESERVED · CONFIDENTIAL PORTFOLIO',
    },
    pages: [
      {
        id: 'kit-arch-p1',
        title: 'Cover Monograph',
        sectionLabel: '01 · Title Sheet',
        templateId: 'cover-monograph',
        hideHeader: true,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'cover-monograph',
          "'Cormorant Garamond', Georgia, serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
      {
        id: 'kit-arch-p2',
        title: 'Concept & Narrative',
        sectionLabel: '02 · Concept & Site',
        templateId: 'editorial-split',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'editorial-split',
          "'Cormorant Garamond', Georgia, serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
      {
        id: 'kit-arch-p3',
        title: 'Before & After Transformation',
        sectionLabel: '03 · Renovation Study',
        templateId: 'before-after-spread',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'before-after-spread',
          "'Cormorant Garamond', Georgia, serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
      {
        id: 'kit-arch-p4',
        title: 'Specifications & Gallery',
        sectionLabel: '04 · Technical Index',
        templateId: 'case-study',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'case-study',
          "'Cormorant Garamond', Georgia, serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
    ],
  },
  {
    id: 'interior-showcase',
    name: 'Interior Design Showcase',
    subtitle: 'Nordic Timber, Light & Materiality',
    badge: '4 Pages · A4 Landscape',
    orientation: 'landscape',
    pageSize: 'a4-landscape',
    pageCount: 4,
    description:
      'Spacious landscape portfolio tailored for interior designers, furniture curators, and renovation studios with dual plate spreads and before/after comparisons.',
    themeId: 'travertine',
    globalSettings: {
      pageSize: 'a4-landscape',
      themeId: 'travertine',
      backgroundColor: '#F5F2EB',
      textColor: '#1F1E1B',
      mutedTextColor: '#706C62',
      accentColor: '#854D0E',
      borderColor: '#DDD6C6',
      headingFont: "'Playfair Display', Georgia, serif",
      bodyFont: "'Inter', -apple-system, sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      pageMargin: 48,
      headerLeftText: 'ATELIER LINDQVIST · INTERIORS',
      headerRightText: 'RESIDENTIAL MONOGRAPH',
      footerLeftText: 'CURATED MATERIALITY & SPATIAL FORM',
    },
    pages: [
      {
        id: 'kit-int-p1',
        title: 'Landscape Title Sheet',
        sectionLabel: '01 · Project Overview',
        templateId: 'cover-landscape',
        pageSizeOverride: 'a4-landscape',
        hideHeader: true,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'cover-landscape',
          "'Playfair Display', Georgia, serif",
          "'Inter', -apple-system, sans-serif",
          "'IBM Plex Mono', monospace"
        ),
      },
      {
        id: 'kit-int-p2',
        title: 'Material Moodboard Spread',
        sectionLabel: '02 · Finishes & Palette',
        templateId: 'dual-comparison',
        pageSizeOverride: 'a4-landscape',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'dual-comparison',
          "'Playfair Display', Georgia, serif",
          "'Inter', -apple-system, sans-serif",
          "'IBM Plex Mono', monospace"
        ),
      },
      {
        id: 'kit-int-p3',
        title: 'Spatial Transformation',
        sectionLabel: '03 · Renovation Analysis',
        templateId: 'before-after-spread',
        pageSizeOverride: 'a4-landscape',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'before-after-spread',
          "'Playfair Display', Georgia, serif",
          "'Inter', -apple-system, sans-serif",
          "'IBM Plex Mono', monospace"
        ),
      },
      {
        id: 'kit-int-p4',
        title: 'Detail Gallery & Finishes',
        sectionLabel: '04 · Joinery Index',
        templateId: 'photo-lookbook',
        pageSizeOverride: 'a4-landscape',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'photo-lookbook',
          "'Playfair Display', Georgia, serif",
          "'Inter', -apple-system, sans-serif",
          "'IBM Plex Mono', monospace"
        ),
      },
    ],
  },
  {
    id: 'executive-pitch',
    name: 'Executive Pitch & Bio',
    subtitle: 'Concise 2-Page Career Teaser',
    badge: '2 Pages · Fast Application',
    orientation: 'portrait',
    pageSize: 'a4-portrait',
    pageCount: 2,
    description:
      'Ultra-compact two-page portfolio teaser designed for rapid job applications, jury submissions, and firm intros that demand maximum impact in under 2 minutes.',
    themeId: 'swiss-minimal',
    globalSettings: {
      pageSize: 'a4-portrait',
      themeId: 'swiss-minimal',
      backgroundColor: '#FFFFFF',
      textColor: '#0A0A0A',
      mutedTextColor: '#525252',
      accentColor: '#DC2626',
      borderColor: '#E5E5E5',
      headingFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
      bodyFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      pageMargin: 48,
      headerLeftText: 'PEYMAN JALILI · LEAD ARCHITECT',
      headerRightText: 'SELECTED WORKS',
      footerLeftText: 'WWW.FOLIOSTUDIO.ARCH · AVAILABLE FOR COMMISSIONS',
    },
    pages: [
      {
        id: 'kit-exec-p1',
        title: 'Executive Cover',
        sectionLabel: '01 · Overview',
        templateId: 'cover-monograph',
        hideHeader: true,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'cover-monograph',
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
      {
        id: 'kit-exec-p2',
        title: 'Curated Works & Projects',
        sectionLabel: '02 · Practice & Profile',
        templateId: 'biography-cv',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'biography-cv',
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'Plus Jakarta Sans', -apple-system, sans-serif",
          "'JetBrains Mono', monospace"
        ),
      },
    ],
  },
  {
    id: 'competition-deck',
    name: '16:9 Presentation Deck',
    subtitle: 'Widescreen Slide Monograph',
    badge: '4 Slides · 16:9 Widescreen',
    orientation: 'landscape',
    pageSize: 'deck-16-9',
    pageCount: 4,
    description:
      'Widescreen architectural presentation pitch deck calibrated for client boardroom projectors, virtual meetings, and screen sharing with clean slide indices.',
    themeId: 'obsidian-night',
    globalSettings: {
      pageSize: 'deck-16-9',
      themeId: 'obsidian-night',
      backgroundColor: '#0F0E0E',
      textColor: '#F5F5F4',
      mutedTextColor: '#A8A29E',
      accentColor: '#F59E0B',
      borderColor: '#292524',
      headingFont: "'Space Grotesk', -apple-system, sans-serif",
      bodyFont: "'Inter', -apple-system, sans-serif",
      monoFont: "'Space Mono', monospace",
      pageMargin: 40,
      headerLeftText: 'COMPETITION SCHEME · PHASE 02',
      headerRightText: 'CONFIDENTIAL REVIEW',
      footerLeftText: 'PRESENTATION DECK · COPYRIGHT 2026',
    },
    pages: [
      {
        id: 'kit-deck-p1',
        title: 'Title Slide',
        sectionLabel: '01 · Project Title',
        templateId: 'cover-landscape',
        pageSizeOverride: 'deck-16-9',
        hideHeader: true,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'cover-landscape',
          "'Space Grotesk', -apple-system, sans-serif",
          "'Inter', -apple-system, sans-serif",
          "'Space Mono', monospace"
        ),
      },
      {
        id: 'kit-deck-p2',
        title: 'Spatial Concept & Narrative',
        sectionLabel: '02 · Concept Design',
        templateId: 'visual-showcase',
        pageSizeOverride: 'deck-16-9',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'visual-showcase',
          "'Space Grotesk', -apple-system, sans-serif",
          "'Inter', -apple-system, sans-serif",
          "'Space Mono', monospace"
        ),
      },
      {
        id: 'kit-deck-p3',
        title: 'Materiality & Plates',
        sectionLabel: '03 · Tectonic Systems',
        templateId: 'dual-comparison',
        pageSizeOverride: 'deck-16-9',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'dual-comparison',
          "'Space Grotesk', -apple-system, sans-serif",
          "'Inter', -apple-system, sans-serif",
          "'Space Mono', monospace"
        ),
      },
      {
        id: 'kit-deck-p4',
        title: 'Gallery & Deliverables',
        sectionLabel: '04 · Masterplan Grid',
        templateId: 'architecture-detail',
        pageSizeOverride: 'deck-16-9',
        hideHeader: false,
        hideFooter: false,
        blocks: createBlocksForTemplate(
          'architecture-detail',
          "'Space Grotesk', -apple-system, sans-serif",
          "'Inter', -apple-system, sans-serif",
          "'Space Mono', monospace"
        ),
      },
    ],
  },
];
