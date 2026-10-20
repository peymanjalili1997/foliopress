export interface StockVisualPlate {
  id: string;
  title: string;
  category: 'Travertine & Stone' | 'Exposed Concrete' | 'Timber & Joinery' | 'Atmospheric & Light';
  url: string;
  aspectRatio: string;
  caption: string;
}

export const ARCHITECTURAL_STOCK_LIBRARY: StockVisualPlate[] = [
  // --- Travertine & Stone ---
  {
    id: 'stk-trav-1',
    title: 'Raw Roman Travertine',
    category: 'Travertine & Stone',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:10',
    caption: 'Cross-cut Roman travertine panel with natural porous sedimentary strata.',
  },
  {
    id: 'stk-trav-2',
    title: 'Minimalist Marble Pavilion',
    category: 'Travertine & Stone',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:9',
    caption: 'Honed limestone peristyle and reflection pool at dusk.',
  },
  {
    id: 'stk-trav-3',
    title: 'Monolithic Quarry Wall',
    category: 'Travertine & Stone',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '4:3',
    caption: 'Massive ashlar stone block calibration with calibrated shadow cast.',
  },
  {
    id: 'stk-trav-4',
    title: 'Brutalist Stone Plinth',
    category: 'Travertine & Stone',
    url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:10',
    caption: 'Tactile basalt plinth anchoring a cantilevered steel structure.',
  },

  // --- Exposed Concrete ---
  {
    id: 'stk-conc-1',
    title: 'Board-Formed Concrete Wall',
    category: 'Exposed Concrete',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:9',
    caption: 'Architectural board-marked concrete with wood grain texture and tie-rod accents.',
  },
  {
    id: 'stk-conc-2',
    title: 'Brutalist Concrete Cantilever',
    category: 'Exposed Concrete',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:10',
    caption: 'Cast in-situ architectural concrete volume suspended over natural slope.',
  },
  {
    id: 'stk-conc-3',
    title: 'Fluted Architectural Concrete',
    category: 'Exposed Concrete',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '4:3',
    caption: 'Vertical fluted precast concrete panels framing entrance gallery.',
  },

  // --- Timber & Joinery ---
  {
    id: 'stk-timb-1',
    title: 'Japanese Cedar Screen (格子)',
    category: 'Timber & Joinery',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:10',
    caption: 'Precision-milled vertical cedar louvers calibrating direct solar gain.',
  },
  {
    id: 'stk-timb-2',
    title: 'White Oak Architectural Millwork',
    category: 'Timber & Joinery',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:9',
    caption: 'Quarter-sawn white oak cabinetry with integrated shadow-gap detailing.',
  },
  {
    id: 'stk-timb-3',
    title: 'Charred Timber (Yakisugi)',
    category: 'Timber & Joinery',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '4:3',
    caption: 'Traditional flame-treated cedar cladding offering natural weatherproofing.',
  },

  // --- Atmospheric & Light ---
  {
    id: 'stk-atm-1',
    title: 'Museum Gallery Daylight Factor',
    category: 'Atmospheric & Light',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:10',
    caption: 'Continuous north-facing clerestory glazing bathing plaster walls in indirect light.',
  },
  {
    id: 'stk-atm-2',
    title: 'Mist Over Coastal Cantilever',
    category: 'Atmospheric & Light',
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '16:9',
    caption: 'Atmospheric marine morning light softening harsh monolithic geometries.',
  },
  {
    id: 'stk-atm-3',
    title: 'Minimalist Atrium Void',
    category: 'Atmospheric & Light',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: '4:3',
    caption: 'Double-height central light well connecting subterranean archives.',
  },
];
