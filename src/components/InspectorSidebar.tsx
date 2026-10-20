import React, { useRef } from 'react';
import {
  Check,
  FilePlus2,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Palette,
  RefreshCw,
  Sliders,
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
} from '../data/editorialAssets';
import {
  GlobalDocumentSettings,
  ImageFilterType,
  ImageStyle,
  PageTemplateId,
  PortfolioBlock,
  PortfolioPage,
  TextStyle,
} from '../types/portfolio';

export type InspectorTab = 'element' | 'page' | 'global';

interface InspectorSidebarProps {
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  currentPage: PortfolioPage;
  selectedBlock: PortfolioBlock | null;
  globalSettings: GlobalDocumentSettings;
  onUpdateBlock: (blockId: string, patch: Partial<PortfolioBlock>) => void;
  onUpdateTextStyle: (patch: Partial<TextStyle>) => void;
  onUpdateImageStyle: (patch: Partial<ImageStyle>) => void;
  onUpdatePage: (patch: Partial<PortfolioPage>) => void;
  onApplyTemplateToPage: (templateId: PageTemplateId) => void;
  onAddPageWithTemplate: (templateId: PageTemplateId) => void;
  onUpdateGlobalSettings: (patch: Partial<GlobalDocumentSettings>) => void;
  onApplyGlobalFontsToAllPages: (headingFont: string, bodyFont: string, monoFont: string) => void;
}

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  activeTab,
  onTabChange,
  currentPage,
  selectedBlock,
  globalSettings,
  onUpdateBlock,
  onUpdateTextStyle,
  onUpdateImageStyle,
  onUpdatePage,
  onApplyTemplateToPage,
  onAddPageWithTemplate,
  onUpdateGlobalSettings,
  onApplyGlobalFontsToAllPages,
}) => {
  const primaryUploadRef = useRef<HTMLInputElement | null>(null);
  const secondaryUploadRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isSecondary = false) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBlock) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (isSecondary) {
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
                            : 'Upload Custom Image'}
                        </span>
                      </button>

                      {selectedBlock.type === 'dual-image' && (
                        <button
                          type="button"
                          onClick={() => secondaryUploadRef.current?.click()}
                          className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Right Image Plate</span>
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
                    </div>
                  </div>
                )}

                {/* English Font Family Gallery for Selected Block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-stone-500" />
                      <span>English Typeface Selection</span>
                    </h3>
                    <span className="text-[11px] text-stone-400 tabular-nums">
                      {selectedBlock.textStyle.fontSize}px
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {ENGLISH_FONTS.map((font) => {
                      const isCurrent = selectedBlock.textStyle.fontFamily === font.family;
                      return (
                        <button
                          key={font.name}
                          type="button"
                          onClick={() => onUpdateTextStyle({ fontFamily: font.family })}
                          className={`w-full text-left px-3 py-2 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                            isCurrent
                              ? 'border-stone-900 bg-stone-900/5 text-stone-950'
                              : 'border-stone-200/80 hover:border-stone-300 text-stone-800'
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
                              {font.category} · {font.sample}
                            </div>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />}
                        </button>
                      );
                    })}
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
                  <optgroup label="Horizontal / Landscape (افقی)">
                    <option value="a4-landscape">A4 Landscape (297 × 210 mm)</option>
                    <option value="deck-16-9">16:9 Presentation (297 × 167 mm)</option>
                    <option value="letter-landscape">US Letter Landscape (11 × 8.5 in)</option>
                    <option value="deck-4-3">4:3 Slide (297 × 223 mm)</option>
                  </optgroup>
                  <optgroup label="Vertical / Portrait (عمودی)">
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

              <div className="space-y-2.5">
                {PAGE_TEMPLATES.map((tpl) => {
                  const isCurrent = currentPage.templateId === tpl.id;
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
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                          {tpl.badge}
                        </span>
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

        {/* TAB 3: GLOBAL DOCUMENT FORMATTING ("قالببندی کلی") */}
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
                  Page Orientation (جهت صفحات)
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
                        <span>Portrait (عمودی)</span>
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
                        <span>Landscape (افقی)</span>
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
                      onClick={() =>
                        onApplyGlobalFontsToAllPages(
                          pair.headingFont,
                          pair.bodyFont,
                          pair.monoFont
                        )
                      }
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
