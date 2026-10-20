export type FontCategory = 'Editorial Serif' | 'Architectural Sans' | 'Display & Avant-Garde' | 'Technical Mono';

export interface FontOption {
  name: string;
  family: string;
  category: FontCategory;
  sample: string;
}

export type PageSizeId =
  | 'a4-portrait'
  | 'a4-landscape'
  | 'letter-portrait'
  | 'letter-landscape'
  | 'deck-16-9'
  | 'deck-4-3';

export interface PageSizeSpec {
  id: PageSizeId;
  label: string;
  dimensionsLabel: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  orientation: 'portrait' | 'landscape';
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number; // in em
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  color?: string; // Optional override; defaults to page/global ink
}

export type ImageFilterType = 'none' | 'grayscale' | 'warm' | 'contrast';

export interface ImageStyle {
  height: number; // px on canvas
  objectFit: 'cover' | 'contain';
  zoom: number; // 1 to 1.5
  filter: ImageFilterType;
  borderRadius: number; // px
  showBorder: boolean;
}

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'split-media-text'
  | 'dual-image'
  | 'two-column-text'
  | 'spec-grid'
  | 'pull-quote'
  | 'divider'
  | 'device-mockup'
  | 'color-palette'
  | 'before-after'
  | 'qr-code'
  | 'project-meta'
  | 'multi-photo-grid';

export interface SpecItem {
  id: string;
  label: string;
  value: string;
}

export interface ColorSwatch {
  id: string;
  hex: string;
  name: string;
  code?: string;
}

export type DeviceMockupType = 'macbook' | 'iphone' | 'ipad';

export interface GridImageItem {
  id: string;
  url: string;
  caption?: string;
}

export interface PortfolioBlock {
  id: string;
  type: BlockType;
  // Text fields
  kicker?: string;
  text?: string;
  secondaryText?: string;
  textStyle: TextStyle;
  secondaryTextStyle?: TextStyle;
  // Image fields
  imageUrl?: string;
  imageCaption?: string;
  imageStyle?: ImageStyle;
  secondaryImageUrl?: string;
  secondaryImageCaption?: string;
  // Layout options for split block
  splitDirection?: 'image-left' | 'image-right';
  splitRatio?: '50-50' | '60-40' | '40-60';
  // Metadata spec list
  specs?: SpecItem[];
  // Divider spacing
  spacingHeight?: number;
  showLine?: boolean;
  // Device Mockup
  deviceType?: DeviceMockupType;
  // Color Palette
  swatches?: ColorSwatch[];
  paletteStyle?: 'swatches' | 'circles' | 'minimal-bars';
  // Before / After
  beforeImageUrl?: string;
  beforeCaption?: string;
  beforeLabel?: string;
  afterImageUrl?: string;
  afterCaption?: string;
  afterLabel?: string;
  // QR Code
  qrUrl?: string;
  qrTitle?: string;
  qrSubtitle?: string;
  // Project Meta Strip
  toolsList?: string[];
  // Multi-Photo Grid
  gridImages?: GridImageItem[];
  gridColumns?: 2 | 3 | 4;
}

export type PageTemplateId =
  | 'cover-monograph'
  | 'editorial-split'
  | 'visual-showcase'
  | 'dual-comparison'
  | 'case-study'
  | 'biography-cv'
  | 'uiux-casestudy'
  | 'architecture-detail'
  | 'photo-lookbook'
  | 'contact-qr'
  | 'cover-landscape'
  | 'before-after-spread';

export interface PortfolioPage {
  id: string;
  title: string;
  sectionLabel: string;
  templateId: PageTemplateId;
  backgroundColor?: string; // Optional per-page override
  textColor?: string;
  pageSizeOverride?: PageSizeId; // Optional per-page orientation / dimension override
  hideHeader?: boolean;
  hideFooter?: boolean;
  blocks: PortfolioBlock[];
}

export interface GlobalDocumentSettings {
  portfolioTitle: string;
  authorName: string;
  issueYear: string;
  pageSize: PageSizeId;
  themeId: string;
  backgroundColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  borderColor: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  pageMargin: number; // px (32, 48, 64, 76)
  showRunningHeader: boolean;
  showRunningFooter: boolean;
  pageNumberStyle: 'leading-zero' | 'fraction' | 'simple' | 'none';
  headerLeftText: string;
  headerRightText: string;
  footerLeftText: string;
}
