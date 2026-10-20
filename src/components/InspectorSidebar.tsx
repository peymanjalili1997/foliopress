import React, { useRef, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Briefcase,
  Check,
  FilePlus2,
  Grid,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  ListOrdered,
  Palette,
  Plus,
  Quote,
  RefreshCw,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Trash2,
  Type,
  Upload,
} from 'lucide-react';
import {
  CURATED_VISUAL_PLATES,
  ENGLISH_FONTS,
  FONT_PAIRINGS,
  GLOBAL_THEMES,
  PAGE_SIZE_PRESETS,
  PAGE_TEMPLATES,
  createUid,
} from '../data/editorialAssets';
import {
  GlobalDocumentSettings,
  ImageFilterType,
  ImageStyle,
  PageSizeId,
  PageTemplateId,
  PortfolioBlock,
  PortfolioPage,
  ProcessStepItem,
  ServiceOfferItem,
  TextStyle,
  TextTargetField,
} from '../types/portfolio';
import { GoogleFontPicker } from './GoogleFontPicker';
import { getCleanFontName, loadGoogleFont, searchGoogleFonts } from '../utils/googleFonts';

export type InspectorTab = 'element' | 'page' | 'global';

interface InspectorSidebarProps {
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  currentPage: PortfolioPage;
  selectedBlock: PortfolioBlock | null;
  activeTextTarget?: TextTargetField;
  onSelectTextTarget?: (target: TextTargetField) => void;
  globalSettings: GlobalDocumentSettings;
  onUpdateBlock: (blockId: string, patch: Partial<PortfolioBlock>) => void;
  onUpdateTextStyle: (patch: Partial<TextStyle>, target?: TextTargetField) => void;
  onUpdateImageStyle: (patch: Partial<ImageStyle>) => void;
  onUpdatePage: (patch: Partial<PortfolioPage>) => void;
  onApplyTemplateToPage: (templateId: PageTemplateId) => void;
  onAddPageWithTemplate: (templateId: PageTemplateId) => void;
  onUpdateGlobalSettings: (patch: Partial<GlobalDocumentSettings>) => void;
  onApplyGlobalFontsToAllPages: (headingFont: string, bodyFont: string, monoFont: string) => void;
  onOpenStockLibrary?: () => void;
}

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  activeTab,
  onTabChange,
  currentPage,
  selectedBlock,
  activeTextTarget = 'primary',
  onSelectTextTarget,
  globalSettings,
  onUpdateBlock,
  onUpdateTextStyle,
  onUpdateImageStyle,
  onUpdatePage,
  onApplyTemplateToPage,
  onAddPageWithTemplate,
  onUpdateGlobalSettings,
  onApplyGlobalFontsToAllPages,
  onOpenStockLibrary,
}) => {
  const primaryUploadRef = useRef<HTMLInputElement | null>(null);
  const secondaryUploadRef = useRef<HTMLInputElement | null>(null);
  const [sidebarTemplateFilter, setSidebarTemplateFilter] = useState<'all' | 'portrait' | 'landscape'>('all');
  const [sidebarFontSearch, setSidebarFontSearch] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isSecondary = false) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBlock) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (selectedBlock.type === 'before-after') {
        if (isSecondary) {
          onUpdateBlock(selectedBlock.id, { afterImageUrl: dataUrl, secondaryImageUrl: dataUrl });
        } else {
          onUpdateBlock(selectedBlock.id, { beforeImageUrl: dataUrl, imageUrl: dataUrl });
        }
      } else if (isSecondary) {
        onUpdateBlock(selectedBlock.id, { secondaryImageUrl: dataUrl });
      } else {
        onUpdateBlock(selectedBlock.id, { imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const hasImage =
    selectedBlock &&
    (selectedBlock.type === 'image' ||
      selectedBlock.type === 'split-media-text' ||
      selectedBlock.type === 'dual-image' ||
      selectedBlock.type === 'device-mockup' ||
      selectedBlock.type === 'before-after' ||
      selectedBlock.type === 'multi-photo-grid');

  const currentImgStyle: ImageStyle = selectedBlock?.imageStyle || {
    height: 360,
    objectFit: 'cover',
    zoom: 1,
    filter: 'none',
    borderRadius: 0,
    showBorder: false,
  };

  // Determine if selected block has multiple text layers
  const multiTextTargets: { id: TextTargetField; label: string }[] = [];
  if (selectedBlock) {
    if (selectedBlock.type === 'heading') {
      multiTextTargets.push(
        { id: 'kicker', label: 'Kicker' },
        { id: 'primary', label: 'Headline' },
        { id: 'secondary', label: 'Subtitle' }
      );
    } else if (selectedBlock.type === 'pull-quote') {
      multiTextTargets.push(
        { id: 'primary', label: 'Quote Body' },
        { id: 'kicker', label: 'Attribution / Author' }
      );
    } else if (selectedBlock.type === 'two-column-text') {
      multiTextTargets.push(
        { id: 'primary', label: 'Left Column' },
        { id: 'secondary', label: 'Right Column' }
      );
    }
  }

  const getActiveStyle = (): TextStyle => {
    const fallbackStyle: TextStyle = {
      fontFamily: globalSettings.bodyFont || "'Plus Jakarta Sans', sans-serif",
      fontSize: 14,
      fontWeight: 400,
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      color: '#1c1917',
      lineHeight: 1.5,
      letterSpacing: 0,
      textTransform: 'none',
    };

    if (!selectedBlock) {
      return fallbackStyle;
    }

    if (activeTextTarget === 'kicker') {
      return (
        selectedBlock.kickerTextStyle || {
          ...fallbackStyle,
          fontFamily: globalSettings.monoFont || "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 500,
          color: '#78716c',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }
      );
    }

    if (activeTextTarget === 'secondary') {
      return (
        selectedBlock.secondaryTextStyle || {
          ...fallbackStyle,
          fontFamily: globalSettings.bodyFont || "'Plus Jakarta Sans', -apple-system, sans-serif",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 1.5,
          color: '#57534e',
          letterSpacing: 0,
          textTransform: 'none',
        }
      );
    }

    return selectedBlock.textStyle || fallbackStyle;
  };

  const activeStyle = getActiveStyle();

  return (
    <aside className="w-80 bg-white border-l border-stone-200/90 flex flex-col h-full shrink-0 select-none">
      {/* Segmented Inspector Tabs */}
      <div className="p-2.5 border-b border-stone-200">
        <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            type="button"
            onClick={() => onTabChange('element')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'element'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Element</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('page')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'page'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Page</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('global')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'global'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Global</span>
          </button>
        </div>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* TAB 1: ELEMENT INSPECTOR */}
        {activeTab === 'element' && (
          <>
            {!selectedBlock ? (
              <div className="py-10 px-4 text-center border border-dashed border-stone-200 rounded-lg space-y-2">
                <Layers className="w-6 h-6 text-stone-400 mx-auto" />
                <p className="text-xs font-medium text-stone-700">No Block Selected</p>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Click any heading, text paragraph, or image plate on the page canvas to customize its
                  English font, sizing, or visual framing.
                </p>
              </div>
            ) : (
              <>
                {/* Image Controls if Block Contains Image */}
                {hasImage && (
                  <div className="space-y-4 pb-5 border-b border-stone-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                        <span>Image Plate & Framing</span>
                      </h3>
                    </div>

                    <input
                      ref={primaryUploadRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                    <input
                      ref={secondaryUploadRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => primaryUploadRef.current?.click()}
                        className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {selectedBlock.type === 'dual-image'
                            ? 'Upload Left Image Plate'
                            : selectedBlock.type === 'before-after'
                            ? 'Upload "Before" Image Plate'
                            : 'Upload Custom Image'}
                        </span>
                      </button>

                      {(selectedBlock.type === 'dual-image' || selectedBlock.type === 'before-after') && (
                        <button
                          type="button"
                          onClick={() => secondaryUploadRef.current?.click()}
                          className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors border border-stone-200"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {selectedBlock.type === 'before-after'
                              ? 'Upload "After" Image Plate'
                              : 'Upload Right Image Plate'}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Height & Zoom Sliders */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <div className="flex justify-between text-[11px] text-stone-600 mb-1 tabular-nums">
                          <span>Plate Height</span>
                          <span className="font-medium text-stone-900">{currentImgStyle.height} px</span>
                        </div>
                        <input
                          type="range"
                          min={140}
                          max={640}
                          step={10}
                          value={currentImgStyle.height}
                          onChange={(e) => onUpdateImageStyle({ height: Number(e.target.value) })}
                          className="w-full accent-stone-900 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-stone-600 mb-1 tabular-nums">
                          <span>Image Scale / Crop Zoom</span>
                          <span className="font-medium text-stone-900">
                            {Math.round(currentImgStyle.zoom * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={1.5}
                          step={0.05}
                          value={currentImgStyle.zoom}
                          onChange={(e) => onUpdateImageStyle({ zoom: Number(e.target.value) })}
                          className="w-full accent-stone-900 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Fit Mode & Filter */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Fit Mode</label>
                        <div className="flex p-0.5 bg-stone-100 rounded-md">
                          {(['cover', 'contain'] as const).map((fit) => (
                            <button
                              key={fit}
                              type="button"
                              onClick={() => onUpdateImageStyle({ objectFit: fit })}
                              className={`flex-1 py-1 text-[11px] font-medium capitalize rounded transition-colors ${
                                currentImgStyle.objectFit === fit
                                  ? 'bg-white text-stone-900 shadow-xs'
                                  : 'text-stone-600'
                              }`}
                            >
                              {fit}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Tone Filter</label>
                        <select
                          value={currentImgStyle.filter}
                          onChange={(e) =>
                            onUpdateImageStyle({ filter: e.target.value as ImageFilterType })
                          }
                          className="w-full h-7 px-2 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-800"
                        >
                          <option value="none">Natural Color</option>
                          <option value="grayscale">Monochrome B&W</option>
                          <option value="warm">Warm Archival</option>
                          <option value="contrast">High Contrast</option>
                        </select>
                      </div>
                    </div>

                    {/* Curated Architectural & Design Plates Picker */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-medium text-stone-600 mb-2">
                        Curated Studio Plates (Click to Apply)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {CURATED_VISUAL_PLATES.map((plate) => (
                          <button
                            key={plate.id}
                            type="button"
                            onClick={() => onUpdateBlock(selectedBlock.id, { imageUrl: plate.url })}
                            className={`group relative aspect-4/3 rounded overflow-hidden border transition-all ${
                              selectedBlock.imageUrl === plate.url
                                ? 'border-stone-900 ring-2 ring-stone-900/20'
                                : 'border-stone-200 hover:border-stone-400'
                            }`}
                            title={plate.title}
                          >
                            <img
                              src={plate.url}
                              alt={plate.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                      {onOpenStockLibrary && (
                        <button
                          type="button"
                          onClick={onOpenStockLibrary}
                          className="w-full mt-2.5 py-2 px-3 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Browse Architectural Stock Library</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Multi-Photo Grid Settings in Sidebar */}
                {selectedBlock.type === 'multi-photo-grid' && (
                  <div className="space-y-3 pb-5 border-b border-stone-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                        <Grid className="w-3.5 h-3.5 text-stone-500" />
                        <span>Photo Grid Layout</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const currentGrid = selectedBlock.gridImages || [];
                          const nextPlates = CURATED_VISUAL_PLATES;
                          const newPlate = nextPlates[(currentGrid.length + 1) % nextPlates.length];
                          const newItem = {
                            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                            url: newPlate.url,
                            caption: `Detail ${String.fromCharCode(65 + (currentGrid.length % 26))} — New Detail`,
                          };
                          onUpdateBlock(selectedBlock.id, { gridImages: [...currentGrid, newItem] });
                        }}
                        className="text-[11px] font-medium text-stone-800 hover:text-stone-950 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Photo</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Columns</label>
                      <div className="grid grid-cols-3 gap-1 p-0.5 bg-stone-100 rounded-md">
                        {([2, 3, 4] as const).map((col) => {
                          const activeCol = selectedBlock.gridColumns || 3;
                          return (
                            <button
                              key={col}
                              type="button"
                              onClick={() => onUpdateBlock(selectedBlock.id, { gridColumns: col })}
                              className={`py-1 text-xs font-medium rounded transition-colors ${
                                activeCol === col
                                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                                  : 'text-stone-600'
                              }`}
                            >
                              {col} Cols
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] text-stone-500">
                        Photos in Grid ({selectedBlock.gridImages?.length || 3})
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(selectedBlock.gridImages || []).map((photo, pIdx) => (
                          <div
                            key={photo.id || pIdx}
                            className="flex items-center gap-2 p-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                          >
                            <img
                              src={photo.url}
                              alt=""
                              className="w-10 h-10 object-cover rounded shrink-0 bg-stone-200"
                            />
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={photo.caption || ''}
                                onChange={(e) => {
                                  const currentGrid = selectedBlock.gridImages || [];
                                  const next = currentGrid.map((p, i) =>
                                    i === pIdx ? { ...p, caption: e.target.value } : p
                                  );
                                  onUpdateBlock(selectedBlock.id, { gridImages: next });
                                }}
                                placeholder="Caption..."
                                className="w-full text-xs px-1.5 py-0.5 border border-stone-200 rounded bg-white text-stone-900"
                              />
                            </div>
                            {(selectedBlock.gridImages?.length || 0) > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const currentGrid = selectedBlock.gridImages || [];
                                  const next = currentGrid.filter((_, i) => i !== pIdx);
                                  onUpdateBlock(selectedBlock.id, { gridImages: next });
                                }}
                                className="p-1 text-stone-400 hover:text-red-500"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {onOpenStockLibrary && (
                        <button
                          type="button"
                          onClick={onOpenStockLibrary}
                          className="w-full mt-2.5 py-2 px-3 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Browse Architectural Stock Library</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Client Testimonial Inspector */}
                {selectedBlock.type === 'client-testimonial' && (
                  <div className="space-y-3 pb-5 border-b border-stone-200">
                    <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-amber-600" />
                      <span>Client Testimonial Settings</span>
                    </h3>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={selectedBlock.clientName || ''}
                        onChange={(e) => onUpdateBlock(selectedBlock.id, { clientName: e.target.value })}
                        placeholder="e.g. Dr. Elena Rostova"
                        className="w-full h-8 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Title / Role</label>
                        <input
                          type="text"
                          value={selectedBlock.clientRole || ''}
                          onChange={(e) => onUpdateBlock(selectedBlock.id, { clientRole: e.target.value })}
                          placeholder="e.g. Managing Director"
                          className="w-full h-8 px-2 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Company</label>
                        <input
                          type="text"
                          value={selectedBlock.clientCompany || ''}
                          onChange={(e) => onUpdateBlock(selectedBlock.id, { clientCompany: e.target.value })}
                          placeholder="e.g. Vanguard Trust"
                          className="w-full h-8 px-2 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Star Rating (1 - 5)</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => onUpdateBlock(selectedBlock.id, { clientRating: star })}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= (selectedBlock.clientRating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={selectedBlock.testimonialVerified !== false}
                          onChange={(e) =>
                            onUpdateBlock(selectedBlock.id, { testimonialVerified: e.target.checked })
                          }
                          className="rounded border-stone-300 text-stone-900 focus:ring-0"
                        />
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Show Verified Client Badge</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={!!selectedBlock.isNdaProtected}
                          onChange={(e) =>
                            onUpdateBlock(selectedBlock.id, { isNdaProtected: e.target.checked })
                          }
                          className="rounded border-stone-300 text-stone-900 focus:ring-0"
                        />
                        <span>NDA / Confidentiality Protected Badge</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Services Grid Inspector */}
                {selectedBlock.type === 'services-grid' && (
                  <div className="space-y-3 pb-5 border-b border-stone-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                        <span>Services & Capabilities</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const currentOffers: ServiceOfferItem[] = selectedBlock.serviceOffers || [];
                          if (currentOffers.length >= 8) return;
                          const nextNum =
                            currentOffers.length + 1 < 10
                              ? `0${currentOffers.length + 1}`
                              : `${currentOffers.length + 1}`;
                          onUpdateBlock(selectedBlock.id, {
                            serviceOffers: [
                              ...currentOffers,
                              {
                                id: typeof createUid === 'function' ? createUid('so') : `so-${Date.now()}`,
                                number: nextNum,
                                title: 'New Service Discipline',
                                description: 'Detailed scope of services and deliverables.',
                                tags: ['Consultation', 'Execution'],
                              },
                            ],
                          });
                        }}
                        className="text-[11px] font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Service</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Section Header / Kicker</label>
                      <input
                        type="text"
                        value={selectedBlock.kicker || ''}
                        onChange={(e) => onUpdateBlock(selectedBlock.id, { kicker: e.target.value })}
                        placeholder="e.g. PART 02 · CORE SERVICES & SCOPE OF ENGAGEMENT"
                        className="w-full h-8 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900 font-mono text-[10px]"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {(selectedBlock.serviceOffers || []).map((offer, oIdx) => (
                        <div
                          key={offer.id || oIdx}
                          className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={offer.number}
                              onChange={(e) => {
                                const next = [...(selectedBlock.serviceOffers || [])];
                                next[oIdx] = { ...offer, number: e.target.value };
                                onUpdateBlock(selectedBlock.id, { serviceOffers: next });
                              }}
                              className="w-12 h-6 px-1.5 text-xs font-mono font-bold bg-white border border-stone-200 rounded text-amber-700"
                            />
                            {(selectedBlock.serviceOffers || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (selectedBlock.serviceOffers || []).filter((_, i) => i !== oIdx);
                                  onUpdateBlock(selectedBlock.id, { serviceOffers: next });
                                }}
                                className="text-stone-400 hover:text-red-500 p-1"
                                title="Remove Service"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] text-stone-500 mb-0.5">Service Title</label>
                            <input
                              type="text"
                              value={offer.title}
                              onChange={(e) => {
                                const next = [...(selectedBlock.serviceOffers || [])];
                                next[oIdx] = { ...offer, title: e.target.value };
                                onUpdateBlock(selectedBlock.id, { serviceOffers: next });
                              }}
                              className="w-full h-7 px-2 text-xs bg-white border border-stone-200 rounded text-stone-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-stone-500 mb-0.5">Description</label>
                            <textarea
                              rows={2}
                              value={offer.description}
                              onChange={(e) => {
                                const next = [...(selectedBlock.serviceOffers || [])];
                                next[oIdx] = { ...offer, description: e.target.value };
                                onUpdateBlock(selectedBlock.id, { serviceOffers: next });
                              }}
                              className="w-full p-1.5 text-xs bg-white border border-stone-200 rounded text-stone-800 resize-none leading-snug"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-stone-500 mb-0.5">Tags (Comma-separated)</label>
                            <input
                              type="text"
                              value={(offer.tags || []).join(', ')}
                              onChange={(e) => {
                                const rawTags = e.target.value
                                  .split(',')
                                  .map((t) => t.trim())
                                  .filter(Boolean);
                                const next = [...(selectedBlock.serviceOffers || [])];
                                next[oIdx] = { ...offer, tags: rawTags };
                                onUpdateBlock(selectedBlock.id, { serviceOffers: next });
                              }}
                              placeholder="e.g. Masterplanning, Concept, BIM"
                              className="w-full h-7 px-2 text-xs bg-white border border-stone-200 rounded text-stone-700 font-mono text-[10px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process Steps Inspector */}
                {selectedBlock.type === 'process-steps' && (
                  <div className="space-y-3 pb-5 border-b border-stone-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                        <ListOrdered className="w-3.5 h-3.5 text-amber-600" />
                        <span>Process & Methodology Steps</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const currentSteps: ProcessStepItem[] = selectedBlock.processSteps || [];
                          if (currentSteps.length >= 8) return;
                          const nextNum =
                            currentSteps.length + 1 < 10
                              ? `0${currentSteps.length + 1}`
                              : `${currentSteps.length + 1}`;
                          onUpdateBlock(selectedBlock.id, {
                            processSteps: [
                              ...currentSteps,
                              {
                                id: typeof createUid === 'function' ? createUid('ps') : `ps-${Date.now()}`,
                                stepNumber: nextNum,
                                title: 'New Methodology Phase',
                                description: 'Detail execution steps, deliverables, and milestones.',
                              },
                            ],
                          });
                        }}
                        className="text-[11px] font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Step</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Process Header / Kicker</label>
                      <input
                        type="text"
                        value={selectedBlock.kicker || ''}
                        onChange={(e) => onUpdateBlock(selectedBlock.id, { kicker: e.target.value })}
                        placeholder="e.g. 04 · STRATEGY, PROCESS & METHODOLOGY"
                        className="w-full h-8 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900 font-mono text-[10px]"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {(selectedBlock.processSteps || []).map((step, sIdx) => (
                        <div
                          key={step.id || sIdx}
                          className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={step.stepNumber}
                              onChange={(e) => {
                                const next = [...(selectedBlock.processSteps || [])];
                                next[sIdx] = { ...step, stepNumber: e.target.value };
                                onUpdateBlock(selectedBlock.id, { processSteps: next });
                              }}
                              className="w-12 h-6 px-1.5 text-xs font-mono font-bold bg-white border border-stone-200 rounded text-amber-700"
                            />
                            {(selectedBlock.processSteps || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (selectedBlock.processSteps || []).filter((_, i) => i !== sIdx);
                                  onUpdateBlock(selectedBlock.id, { processSteps: next });
                                }}
                                className="text-stone-400 hover:text-red-500 p-1"
                                title="Remove Step"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] text-stone-500 mb-0.5">Step Title</label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const next = [...(selectedBlock.processSteps || [])];
                                next[sIdx] = { ...step, title: e.target.value };
                                onUpdateBlock(selectedBlock.id, { processSteps: next });
                              }}
                              className="w-full h-7 px-2 text-xs bg-white border border-stone-200 rounded text-stone-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-stone-500 mb-0.5">Description</label>
                            <textarea
                              rows={2}
                              value={step.description}
                              onChange={(e) => {
                                const next = [...(selectedBlock.processSteps || [])];
                                next[sIdx] = { ...step, description: e.target.value };
                                onUpdateBlock(selectedBlock.id, { processSteps: next });
                              }}
                              className="w-full p-1.5 text-xs bg-white border border-stone-200 rounded text-stone-800 resize-none leading-snug"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Typography & Styling Section */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-stone-500" />
                      <span>Typography & Styling</span>
                    </h3>
                    <span className="text-[11px] text-stone-500 tabular-nums font-mono">
                      {activeStyle.fontSize}px
                    </span>
                  </div>

                  {/* Multi-Text Layer Switcher if Block contains multiple text fields */}
                  {multiTextTargets.length > 0 && (
                    <div className="p-2 bg-stone-100 rounded-lg space-y-1.5 border border-stone-200/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                          Editing Layer
                        </span>
                        <span className="text-[10px] font-medium text-stone-800">
                          {multiTextTargets.find((t) => t.id === activeTextTarget)?.label || 'Headline'}
                        </span>
                      </div>
                      <div className="grid grid-flow-col auto-cols-fr gap-1 bg-stone-200/60 p-0.5 rounded-md">
                        {multiTextTargets.map((tgt) => (
                          <button
                            key={tgt.id}
                            type="button"
                            onClick={() => onSelectTextTarget?.(tgt.id)}
                            className={`px-2 py-1 text-[11px] font-medium rounded transition-all text-center truncate ${
                              activeTextTarget === tgt.id
                                ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                                : 'text-stone-700 hover:text-stone-900 hover:bg-white/70'
                            }`}
                          >
                            {tgt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Online Google Font Selector Popover */}
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">
                      Online Google Font Selector
                    </label>
                    <GoogleFontPicker
                      value={activeStyle.fontFamily}
                      onChange={async (family) => {
                        await loadGoogleFont(family);
                        onUpdateTextStyle({ fontFamily: family }, activeTextTarget);
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Font Size & Weight */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                        <span>Font Size</span>
                        <span className="tabular-nums font-mono text-stone-900">{activeStyle.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min={9}
                        max={84}
                        value={activeStyle.fontSize}
                        onChange={(e) =>
                          onUpdateTextStyle({ fontSize: Number(e.target.value) }, activeTextTarget)
                        }
                        className="w-full accent-stone-900 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                        <span>Weight</span>
                        <span className="tabular-nums font-mono text-stone-900">{activeStyle.fontWeight}</span>
                      </div>
                      <select
                        value={activeStyle.fontWeight}
                        onChange={(e) =>
                          onUpdateTextStyle({ fontWeight: Number(e.target.value) }, activeTextTarget)
                        }
                        className="w-full h-7 px-2 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900"
                      >
                        <option value={300}>300 Light</option>
                        <option value={400}>400 Regular</option>
                        <option value={500}>500 Medium</option>
                        <option value={600}>600 Semi-Bold</option>
                        <option value={700}>700 Bold</option>
                        <option value={800}>800 Extra Bold</option>
                      </select>
                    </div>
                  </div>

                  {/* Line Height & Letter Spacing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                        <span>Line Height</span>
                        <span className="tabular-nums font-mono text-stone-900">
                          {activeStyle.lineHeight || 1.4}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.8}
                        max={2.4}
                        step={0.05}
                        value={activeStyle.lineHeight || 1.4}
                        onChange={(e) =>
                          onUpdateTextStyle({ lineHeight: Number(e.target.value) }, activeTextTarget)
                        }
                        className="w-full accent-stone-900 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                        <span>Tracking</span>
                        <span className="tabular-nums font-mono text-stone-900">
                          {activeStyle.letterSpacing || 0}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-1}
                        max={8}
                        step={0.5}
                        value={activeStyle.letterSpacing || 0}
                        onChange={(e) =>
                          onUpdateTextStyle({ letterSpacing: Number(e.target.value) }, activeTextTarget)
                        }
                        className="w-full accent-stone-900 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Text Alignment & Uppercase */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center p-0.5 bg-stone-100 rounded-md border border-stone-200/80">
                      {(
                        [
                          { align: 'left', icon: AlignLeft, label: 'Align Left' },
                          { align: 'center', icon: AlignCenter, label: 'Align Center' },
                          { align: 'right', icon: AlignRight, label: 'Align Right' },
                          { align: 'justify', icon: AlignJustify, label: 'Justify' },
                        ] as const
                      ).map(({ align, icon: Icon, label }) => (
                        <button
                          key={align}
                          type="button"
                          title={label}
                          onClick={() => onUpdateTextStyle({ textAlign: align }, activeTextTarget)}
                          className={`w-7 h-6 flex items-center justify-center rounded transition-colors ${
                            (activeStyle.textAlign || 'left') === align
                              ? 'bg-stone-900 text-white shadow-2xs'
                              : 'text-stone-700 hover:bg-white/70'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateTextStyle(
                          {
                            textTransform:
                              activeStyle.textTransform === 'uppercase' ? 'none' : 'uppercase',
                          },
                          activeTextTarget
                        )
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all flex items-center gap-1.5 ${
                        activeStyle.textTransform === 'uppercase'
                          ? 'border-stone-900 bg-stone-900 text-white shadow-2xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider">AA</span>
                      <span>ALL CAPS</span>
                    </button>
                  </div>

                  {/* Text Color Row */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-500">Color Palette</span>
                    <div className="flex items-center gap-1">
                      {['#1c1917', '#44403c', '#78716c', '#2563eb', '#b45309'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateTextStyle({ color: c }, activeTextTarget)}
                          style={{ backgroundColor: c }}
                          className={`w-5 h-5 rounded-full border transition-all ${
                            activeStyle.color === c
                              ? 'ring-2 ring-stone-900 ring-offset-1 scale-110'
                              : 'border-stone-300 hover:scale-105'
                          }`}
                        />
                      ))}
                      <input
                        type="color"
                        value={activeStyle.color || '#1c1917'}
                        onChange={(e) =>
                          onUpdateTextStyle({ color: e.target.value }, activeTextTarget)
                        }
                        className="w-6 h-6 p-0 border border-stone-200 rounded cursor-pointer ml-1"
                        title="Custom Color"
                      />
                    </div>
                  </div>

                  {/* Font Family Live Gallery */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-stone-900">
                        Live Google Font Directory
                      </label>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {sidebarFontSearch
                          ? `${searchGoogleFonts(sidebarFontSearch, 'All', 50).length} found`
                          : '1,938 Google Fonts'}
                      </span>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
                      <input
                        type="text"
                        value={sidebarFontSearch}
                        onChange={(e) => setSidebarFontSearch(e.target.value)}
                        placeholder="Live search (e.g. Poppins, Oswald, Inter)..."
                        className="w-full pl-8 pr-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
                      />
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {searchGoogleFonts(sidebarFontSearch, 'All', 50).map((font) => {
                        const isCurrent =
                          getCleanFontName(activeStyle.fontFamily).toLowerCase() ===
                          font.name.toLowerCase();
                        return (
                          <button
                            key={font.name}
                            type="button"
                            onMouseEnter={() => loadGoogleFont(font.name)}
                            onClick={async () => {
                              await loadGoogleFont(font.name);
                              onUpdateTextStyle({ fontFamily: font.family }, activeTextTarget);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                              isCurrent
                                ? 'border-stone-900 bg-stone-900/5 text-stone-950 font-medium ring-1 ring-stone-900/20'
                                : 'border-stone-200/80 hover:border-stone-300 text-stone-800 hover:bg-stone-50'
                            }`}
                          >
                            <div className="min-w-0">
                              <div
                                style={{ fontFamily: font.family }}
                                className="text-sm font-medium truncate"
                              >
                                {font.name}
                              </div>
                              <div className="text-[10px] text-stone-400 truncate">
                                {font.category}
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* TAB 2: PAGE LAYOUT & TEMPLATES */}
        {activeTab === 'page' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-stone-900">Page Identification</h3>
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">
                  Page Title (Sidebar Index)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={currentPage.title}
                  onChange={(e) => onUpdatePage({ title: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">
                  Running Header Chapter Label
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={currentPage.sectionLabel}
                  onChange={(e) => onUpdatePage({ sectionLabel: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Page Orientation & Size Override */}
              <div className="pt-1">
                <label className="block text-[11px] text-stone-500 mb-1">
                  Orientation & Size for this Page
                </label>
                <select
                  value={currentPage.pageSizeOverride || 'inherit'}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdatePage({
                      pageSizeOverride: val === 'inherit' ? undefined : (val as PageSizeId),
                    });
                  }}
                  className="w-full h-8 px-2 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900"
                >
                  <option value="inherit">
                    Document Default ({PAGE_SIZE_PRESETS.find((p) => p.id === globalSettings.pageSize)?.label || 'Global'})
                  </option>
                  <optgroup label="Horizontal / Landscape">
                    <option value="a4-landscape">A4 Landscape (297 × 210 mm)</option>
                    <option value="deck-16-9">16:9 Presentation (297 × 167 mm)</option>
                    <option value="letter-landscape">US Letter Landscape (11 × 8.5 in)</option>
                    <option value="deck-4-3">4:3 Slide (297 × 223 mm)</option>
                  </optgroup>
                  <optgroup label="Vertical / Portrait">
                    <option value="a4-portrait">A4 Portrait (210 × 297 mm)</option>
                    <option value="letter-portrait">US Letter Portrait (8.5 × 11 in)</option>
                  </optgroup>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!currentPage.hideHeader}
                    onChange={(e) => onUpdatePage({ hideHeader: !e.target.checked })}
                    className="rounded border-stone-300 accent-stone-900"
                  />
                  <span>Show Header on this Page</span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!currentPage.hideFooter}
                    onChange={(e) => onUpdatePage({ hideFooter: !e.target.checked })}
                    className="rounded border-stone-300 accent-stone-900"
                  />
                  <span>Show Footer & Page Number</span>
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-stone-900">Editorial Page Templates</h3>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Switch the current page layout or append a new pre-structured page to your portfolio.
              </p>

              {/* Orientation Category Filter */}
              <div className="flex p-0.5 bg-stone-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setSidebarTemplateFilter('all')}
                  className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all ${
                    sidebarTemplateFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({PAGE_TEMPLATES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTemplateFilter('portrait')}
                  className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all ${
                    sidebarTemplateFilter === 'portrait'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Portrait ({PAGE_TEMPLATES.filter((t) => t.orientation === 'portrait').length})
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTemplateFilter('landscape')}
                  className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all ${
                    sidebarTemplateFilter === 'landscape'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Landscape ({PAGE_TEMPLATES.filter((t) => t.orientation === 'landscape').length})
                </button>
              </div>

              <div className="space-y-2.5">
                {PAGE_TEMPLATES.filter(
                  (t) => sidebarTemplateFilter === 'all' || t.orientation === sidebarTemplateFilter
                ).map((tpl) => {
                  const isCurrent = currentPage.templateId === tpl.id;
                  const isPortrait = tpl.orientation === 'portrait';
                  return (
                    <div
                      key={tpl.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isCurrent
                          ? 'border-stone-900 bg-stone-50/90'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-stone-900">{tpl.name}</span>
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.2 rounded ${
                              isPortrait
                                ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                : 'bg-blue-50 text-blue-800 border border-blue-200/60'
                            }`}
                          >
                            {isPortrait ? 'Portrait' : 'Landscape'}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                            {tpl.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug mb-2.5">
                        {tpl.description}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onApplyTemplateToPage(tpl.id)}
                          className="flex-1 py-1.5 px-2 text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Apply Here</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddPageWithTemplate(tpl.id)}
                          className="flex-1 py-1.5 px-2 text-[11px] font-medium bg-stone-900 hover:bg-stone-800 text-white rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <FilePlus2 className="w-3 h-3" />
                          <span>+ New Page</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GLOBAL DOCUMENT FORMATTING */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            {/* Page Size & Orientation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-stone-900">Document Dimensions & Format</h3>
              </div>

              {/* Fast Orientation Segmented Switch */}
              <div>
                <label className="block text-[11px] text-stone-500 mb-1.5">
                  Page Orientation
                </label>
                {(() => {
                  const currentSpec =
                    PAGE_SIZE_PRESETS.find((p) => p.id === globalSettings.pageSize) ||
                    PAGE_SIZE_PRESETS[0];
                  const isLand = currentSpec.orientation === 'landscape';

                  return (
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => {
                          if (globalSettings.pageSize === 'a4-landscape') {
                            onUpdateGlobalSettings({ pageSize: 'a4-portrait' });
                          } else if (globalSettings.pageSize === 'letter-landscape') {
                            onUpdateGlobalSettings({ pageSize: 'letter-portrait' });
                          } else if (isLand) {
                            onUpdateGlobalSettings({ pageSize: 'a4-portrait' });
                          }
                        }}
                        className={`py-1.5 px-3 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ${
                          !isLand
                            ? 'bg-white text-stone-900 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="2" width="14" height="20" rx="2" />
                        </svg>
                        <span>Portrait</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (globalSettings.pageSize === 'a4-portrait') {
                            onUpdateGlobalSettings({ pageSize: 'a4-landscape' });
                          } else if (globalSettings.pageSize === 'letter-portrait') {
                            onUpdateGlobalSettings({ pageSize: 'letter-landscape' });
                          } else if (!isLand) {
                            onUpdateGlobalSettings({ pageSize: 'a4-landscape' });
                          }
                        }}
                        className={`py-1.5 px-3 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ${
                          isLand
                            ? 'bg-white text-stone-900 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                        </svg>
                        <span>Landscape</span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Presets List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-stone-500 block">
                  Select Dimension Preset:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PAGE_SIZE_PRESETS.map((preset) => {
                    const active = globalSettings.pageSize === preset.id;
                    const isLand = preset.orientation === 'landscape';
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => onUpdateGlobalSettings({ pageSize: preset.id })}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          active
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 hover:border-stone-300 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <svg
                            className={`w-3 h-3 shrink-0 ${active ? 'text-white' : 'text-stone-400'}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            {isLand ? (
                              <rect x="2" y="5" width="20" height="14" rx="2" />
                            ) : (
                              <rect x="5" y="2" width="14" height="20" rx="2" />
                            )}
                          </svg>
                          <div className="text-xs font-semibold truncate">{preset.label}</div>
                        </div>
                        <div
                          className={`text-[10px] tabular-nums mt-0.5 ${
                            active ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {preset.dimensionsLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Global Paper Stock & Color Theme */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <h3 className="text-xs font-semibold text-stone-900">Archival Paper & Color Palette</h3>
              <div className="space-y-2">
                {GLOBAL_THEMES.map((theme) => {
                  const active = globalSettings.themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() =>
                        onUpdateGlobalSettings({
                          themeId: theme.id,
                          backgroundColor: theme.backgroundColor,
                          textColor: theme.textColor,
                          mutedTextColor: theme.mutedTextColor,
                          accentColor: theme.accentColor,
                          borderColor: theme.borderColor,
                        })
                      }
                      className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-3 ${
                        active
                          ? 'border-stone-900 ring-1 ring-stone-900/20 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          style={{
                            backgroundColor: theme.backgroundColor,
                            borderColor: theme.borderColor,
                          }}
                          className="w-7 h-7 rounded-full border shrink-0 flex items-center justify-center shadow-2xs"
                        >
                          <span
                            style={{ backgroundColor: theme.textColor }}
                            className="w-2.5 h-2.5 rounded-full"
                          />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-stone-900 truncate">
                            {theme.name}
                          </div>
                          <div className="text-[10px] text-stone-500 truncate">{theme.subtitle}</div>
                        </div>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Global English Font Pairings */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <h3 className="text-xs font-semibold text-stone-900">
                Global Typography Pairings (All Pages)
              </h3>
              <p className="text-[11px] text-stone-500">
                Unify headings, body prose, and captions across every page in one click.
              </p>
              <div className="space-y-2">
                {FONT_PAIRINGS.map((pair) => {
                  const isCurrent =
                    globalSettings.headingFont === pair.headingFont &&
                    globalSettings.bodyFont === pair.bodyFont;
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      onClick={async () => {
                        await Promise.all([
                          loadGoogleFont(pair.headingFont),
                          loadGoogleFont(pair.bodyFont),
                          loadGoogleFont(pair.monoFont),
                        ]);
                        onApplyGlobalFontsToAllPages(
                          pair.headingFont,
                          pair.bodyFont,
                          pair.monoFont
                        );
                      }}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                        isCurrent
                          ? 'border-stone-900 bg-stone-900/5'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div
                        style={{ fontFamily: pair.headingFont }}
                        className="text-sm font-medium text-stone-900"
                      >
                        {pair.name}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{pair.description}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Global Google Fonts */}
              <div className="pt-3 space-y-2.5 border-t border-stone-200/80">
                <div className="text-xs font-semibold text-stone-900">
                  Custom Global Google Fonts
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">
                    Primary Headline Typeface
                  </label>
                  <GoogleFontPicker
                    value={globalSettings.headingFont}
                    onChange={(font) => {
                      loadGoogleFont(font);
                      onUpdateGlobalSettings({ headingFont: font });
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">
                    Body Prose Typeface
                  </label>
                  <GoogleFontPicker
                    value={globalSettings.bodyFont}
                    onChange={(font) => {
                      loadGoogleFont(font);
                      onUpdateGlobalSettings({ bodyFont: font });
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">
                    Monospace & Plate Caption Typeface
                  </label>
                  <GoogleFontPicker
                    value={globalSettings.monoFont}
                    onChange={(font) => {
                      loadGoogleFont(font);
                      onUpdateGlobalSettings({ monoFont: font });
                    }}
                    className="w-full"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onApplyGlobalFontsToAllPages(
                      globalSettings.headingFont,
                      globalSettings.bodyFont,
                      globalSettings.monoFont
                    )
                  }
                  className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Apply Global Fonts to All Pages & Blocks</span>
                </button>
              </div>
            </div>

            {/* Page Margin & Running Header/Footer Settings */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="text-xs font-semibold text-stone-900">Margins & Folio Numbering</h3>

              <div>
                <div className="flex justify-between text-[11px] text-stone-600 mb-1 tabular-nums">
                  <span>Global Page Margin</span>
                  <span className="font-medium text-stone-900">{globalSettings.pageMargin} px</span>
                </div>
                <input
                  type="range"
                  min={32}
                  max={80}
                  step={4}
                  value={globalSettings.pageMargin}
                  onChange={(e) =>
                    onUpdateGlobalSettings({ pageMargin: Number(e.target.value) })
                  }
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">
                  Page Numbering Format
                </label>
                <select
                  value={globalSettings.pageNumberStyle}
                  onChange={(e) =>
                    onUpdateGlobalSettings({
                      pageNumberStyle: e.target.value as GlobalDocumentSettings['pageNumberStyle'],
                    })
                  }
                  className="w-full h-8 px-2 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900"
                >
                  <option value="leading-zero">01, 02, 03 (Archival Leading Zero)</option>
                  <option value="fraction">01 / 04 (Index Fraction)</option>
                  <option value="simple">Page 1, Page 2</option>
                  <option value="none">Hidden</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">
                  Running Header Text (Left)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={globalSettings.headerLeftText}
                  onChange={(e) => onUpdateGlobalSettings({ headerLeftText: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">
                  Running Footer Text (Left)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={globalSettings.footerLeftText}
                  onChange={(e) => onUpdateGlobalSettings({ footerLeftText: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
