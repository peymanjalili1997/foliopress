/**
 * Google Fonts Dynamic Loader & Directory
 */

import { ALL_GOOGLE_FONTS } from '../data/allGoogleFonts';
import { FontOption } from '../types/portfolio';

export { ALL_GOOGLE_FONTS };

const loadedFonts = new Set<string>();

/**
 * Extracts the primary font family name from a CSS font-family string.
 * e.g. "'Cormorant Garamond', Georgia, serif" -> "Cormorant Garamond"
 */
export function getCleanFontName(fontFamily: string): string {
  if (!fontFamily) return '';
  const first = fontFamily.split(',')[0].trim();
  return first.replace(/['"]/g, '').trim();
}

/**
 * Dynamically loads a Google Font by name into document.head
 */
export function loadGoogleFont(fontInput: string): Promise<boolean> {
  const cleanName = getCleanFontName(fontInput);
  if (!cleanName) return Promise.resolve(false);

  // Standard web-safe fonts that don't need network loading
  const webSafe = new Set([
    'sans-serif',
    'serif',
    'monospace',
    'system-ui',
    'arial',
    'georgia',
    'times new roman',
    'courier new',
    'helvetica',
    '-apple-system',
  ]);
  if (webSafe.has(cleanName.toLowerCase())) return Promise.resolve(true);

  if (loadedFonts.has(cleanName)) return Promise.resolve(true);

  const elementId = `google-font-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  if (typeof document === 'undefined') return Promise.resolve(false);

  if (document.getElementById(elementId)) {
    loadedFonts.add(cleanName);
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.id = elementId;
    link.rel = 'stylesheet';
    // Load common weights: 300, 400, 500, 600, 700 + italic 400
    const formattedFamily = cleanName.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFamily}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap`;

    link.onload = () => {
      loadedFonts.add(cleanName);
      if (document.fonts && document.fonts.load) {
        document.fonts
          .load(`16px "${cleanName}"`)
          .then(() => resolve(true))
          .catch(() => resolve(true));
      } else {
        resolve(true);
      }
    };

    link.onerror = () => {
      // Fallback: try loading with standard weight 400 if variable axis is unavailable
      const fallbackLink = document.createElement('link');
      fallbackLink.id = `${elementId}-fallback`;
      fallbackLink.rel = 'stylesheet';
      fallbackLink.href = `https://fonts.googleapis.com/css2?family=${formattedFamily}&display=swap`;
      fallbackLink.onload = () => {
        loadedFonts.add(cleanName);
        resolve(true);
      };
      fallbackLink.onerror = () => resolve(false);
      document.head.appendChild(fallbackLink);
    };

    document.head.appendChild(link);
  });
}

/**
 * Pre-curated, extensive Google Fonts directory
 */
export const EXTENDED_GOOGLE_FONTS: FontOption[] = [
  // --- Editorial Serif ---
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
  {
    name: 'EB Garamond',
    family: "'EB Garamond', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Humanist Renaissance Book Type',
  },
  {
    name: 'Instrument Serif',
    family: "'Instrument Serif', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Modern Digital Editorial Precision',
  },
  {
    name: 'Merriweather',
    family: "'Merriweather', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Designed for High Editorial Legibility',
  },
  {
    name: 'Prata',
    family: "'Prata', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Didone Teardrop Terminal Elegance',
  },
  {
    name: 'Italiana',
    family: "'Italiana', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Italian Master Architectural Calligraphy',
  },
  {
    name: 'Marcellus',
    family: "'Marcellus', Georgia, serif",
    category: 'Editorial Serif',
    sample: 'Roman Inscription Trajanic Tectonics',
  },

  // --- Architectural Sans ---
  {
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Modern Neo-Grotesque Studio Clarity',
  },
  {
    name: 'Inter',
    family: "'Inter', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Geometric Neutral High-Density Sans',
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
  {
    name: 'Montserrat',
    family: "'Montserrat', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Urban Civic Monograph Proportions',
  },
  {
    name: 'Poppins',
    family: "'Poppins', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Balanced Pure Geometric Circles',
  },
  {
    name: 'Urbanist',
    family: "'Urbanist', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Crisp Architectural Spatial Sans',
  },
  {
    name: 'Work Sans',
    family: "'Work Sans', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Early Grotesque Print Heritage',
  },
  {
    name: 'Space Grotesk',
    family: "'Space Grotesk', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Technical Brutalist Grotesk Rhythm',
  },
  {
    name: 'Raleway',
    family: "'Raleway', -apple-system, sans-serif",
    category: 'Architectural Sans',
    sample: 'Art-Deco Inspired Geometric Display',
  },

  // --- Display & Avant-Garde ---
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
  {
    name: 'Oswald',
    family: "'Oswald', -apple-system, sans-serif",
    category: 'Display & Avant-Garde',
    sample: 'Condensed Gothic Billboard Headline',
  },
  {
    name: 'Cinzel Decorative',
    family: "'Cinzel Decorative', Georgia, serif",
    category: 'Display & Avant-Garde',
    sample: 'Ornate Monumental Monograph Title',
  },
  {
    name: 'Abril Fatface',
    family: "'Abril Fatface', Georgia, serif",
    category: 'Display & Avant-Garde',
    sample: 'Dramatic Title Page Presence',
  },
  {
    name: 'Six Caps',
    family: "'Six Caps', -apple-system, sans-serif",
    category: 'Display & Avant-Garde',
    sample: 'Ultra-Narrow Compressed Monograph Poster',
  },

  // --- Technical Mono ---
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
  {
    name: 'Space Mono',
    family: "'Space Mono', monospace",
    category: 'Technical Mono',
    sample: 'RETRO_COMPUTATIONAL_GEOMETRY',
  },
  {
    name: 'Roboto Mono',
    family: "'Roboto Mono', monospace",
    category: 'Technical Mono',
    sample: 'PRECISION // DIMENSIONS_297x210',
  },
  {
    name: 'Fira Code',
    family: "'Fira Code', monospace",
    category: 'Technical Mono',
    sample: 'ARCHITECTURAL_ENGINEERING_DATA',
  },
];

export const POPULAR_GOOGLE_FONTS = new Set([
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Playfair Display',
  'Oswald',
  'Raleway',
  'Merriweather',
  'Lora',
  'Nunito',
  'Rubik',
  'Work Sans',
  'Plus Jakarta Sans',
  'DM Sans',
  'Cinzel',
  'Cormorant Garamond',
  'Space Grotesk',
  'Syne',
  'JetBrains Mono',
  'Bebas Neue',
  'Manrope',
  'Urbanist',
  'Outfit',
  'Epilogue',
  'Cabin',
  'Fira Sans',
  'Abril Fatface',
  'Dancing Script',
  'Pacifico',
  'Caveat',
  'Great Vibes',
  'Sacramento',
  'Cinzel Decorative',
  'Libre Baskerville',
  'EB Garamond',
  'Spectral',
  'Bodoni Moda',
  'Fraunces',
  'Newsreader',
  'Space Mono',
  'Inconsolata',
  'Fira Code',
  'Source Code Pro',
  'Kanit',
  'Quicksand',
  'Barlow',
  'Ubuntu',
]);

export function inferFontCategory(name: string): 'Serif' | 'Sans' | 'Display' | 'Mono' {
  const lower = name.toLowerCase();
  if (lower.includes('mono') || lower.includes('code')) return 'Mono';
  if (
    lower.includes('serif') ||
    lower.includes('garamond') ||
    lower.includes('minion') ||
    lower.includes('didot') ||
    lower.includes('bodoni') ||
    lower.includes('baskerville') ||
    lower.includes('caslon') ||
    lower.includes('roman') ||
    lower.includes('spectral') ||
    lower.includes('newsreader') ||
    lower.includes('fraunces') ||
    lower.includes('lora') ||
    lower.includes('merriweather') ||
    lower.includes('cormorant')
  ) {
    return 'Serif';
  }
  if (
    lower.includes('script') ||
    lower.includes('brush') ||
    lower.includes('hand') ||
    lower.includes('callig') ||
    lower.includes('vibes') ||
    lower.includes('dancing') ||
    lower.includes('pacifico') ||
    lower.includes('caveat') ||
    lower.includes('sacramento') ||
    lower.includes('lobster') ||
    lower.includes('display') ||
    lower.includes('fatface') ||
    lower.includes('bebas') ||
    lower.includes('cinzel') ||
    lower.includes('syne')
  ) {
    return 'Display';
  }
  return 'Sans';
}

export function searchGoogleFonts(
  query: string,
  categoryFilter: string = 'All',
  limit: number = 75
): FontOption[] {
  const q = query.trim().toLowerCase();

  // If no query, return curated editorial list matching category filter
  if (!q) {
    return EXTENDED_GOOGLE_FONTS.filter((f) => {
      if (categoryFilter === 'All') return true;
      return f.category.toLowerCase().includes(categoryFilter.toLowerCase());
    });
  }

  // Rank and search across all 1,938 Google Fonts
  const scored: { name: string; score: number }[] = [];

  for (const name of ALL_GOOGLE_FONTS) {
    const n = name.toLowerCase();
    let score = 0;
    if (n === q) score = 100;
    else if (n.startsWith(q)) score = 80;
    else if (n.split(/\s+/).some((w) => w.startsWith(q))) score = 60;
    else if (n.includes(q)) score = 40;
    else continue;

    if (POPULAR_GOOGLE_FONTS.has(name)) score += 15;

    // Filter by category if requested
    if (categoryFilter !== 'All') {
      const cat = inferFontCategory(name);
      if (cat !== categoryFilter) continue;
    }

    scored.push({ name, score });
  }

  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return scored.slice(0, limit).map((item) => {
    // Check if item is in our curated list to get its exact sample & category
    const curated = EXTENDED_GOOGLE_FONTS.find(
      (c) => c.name.toLowerCase() === item.name.toLowerCase()
    );
    if (curated) return curated;

    const cat = inferFontCategory(item.name);
    const catLabel =
      cat === 'Serif'
        ? 'Editorial Serif'
        : cat === 'Sans'
        ? 'Architectural Sans'
        : cat === 'Mono'
        ? 'Technical Mono'
        : 'Display Typeface';

    const fallback =
      cat === 'Serif' ? 'Georgia, serif' : cat === 'Mono' ? 'monospace' : 'sans-serif';

    return {
      name: item.name,
      family: `'${item.name}', ${fallback}`,
      category: `${catLabel} · Google Font`,
      sample: 'Architectural portfolio & design monograph',
    };
  });
}
