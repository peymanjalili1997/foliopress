import React, { useState } from 'react';
import {
  FileText,
  Layout,
  Plus,
  Sparkles,
  X,
  Smartphone,
  QrCode,
  BookOpen,
  Grid,
  Columns,
  Image as ImageIcon,
  Check,
  Compass,
} from 'lucide-react';
import { PAGE_TEMPLATES } from '../data/editorialAssets';
import { PageTemplateId } from '../types/portfolio';

export interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPage: (config: {
    orientation: 'portrait' | 'landscape';
    templateId: PageTemplateId | 'blank';
    title: string;
  }) => void;
  suggestedPageNumber: number;
}

export const AddPageModal: React.FC<AddPageModalProps> = ({
  isOpen,
  onClose,
  onAddPage,
  suggestedPageNumber,
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [templateFilter, setTemplateFilter] = useState<'all' | 'portrait' | 'landscape'>('portrait');
  const [selectedTemplateId, setSelectedTemplateId] = useState<PageTemplateId | 'blank'>('editorial-split');
  const [title, setTitle] = useState<string>('');

  if (!isOpen) return null;

  const handleOrientationChange = (next: 'portrait' | 'landscape') => {
    setOrientation(next);
    setTemplateFilter(next);
    // Auto-select the first appropriate template if not blank
    if (selectedTemplateId !== 'blank') {
      const firstMatching = PAGE_TEMPLATES.find((t) => t.orientation === next);
      if (firstMatching) {
        setSelectedTemplateId(firstMatching.id);
        if (!title || title.startsWith('Page ')) {
          setTitle(firstMatching.name);
        }
      }
    }
  };

  const handleSelectTemplate = (id: PageTemplateId | 'blank') => {
    setSelectedTemplateId(id);
    if (!title || title.startsWith('Page ')) {
      if (id === 'blank') {
        setTitle(`Page ${suggestedPageNumber} — Blank`);
      } else {
        const found = PAGE_TEMPLATES.find((t) => t.id === id);
        if (found) setTitle(found.name);
      }
    }
  };

  const handleConfirm = () => {
    const finalTitle =
      title.trim() ||
      (selectedTemplateId === 'blank'
        ? `Page ${suggestedPageNumber}`
        : PAGE_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name || `Page ${suggestedPageNumber}`);

    onAddPage({
      orientation,
      templateId: selectedTemplateId,
      title: finalTitle,
    });
    onClose();
  };

  const getTemplateIcon = (id: PageTemplateId) => {
    switch (id) {
      case 'cover-monograph':
      case 'cover-landscape':
        return <BookOpen className="w-4 h-4" />;
      case 'editorial-split':
      case 'dual-comparison':
        return <Columns className="w-4 h-4" />;
      case 'visual-showcase':
      case 'photo-lookbook':
        return <ImageIcon className="w-4 h-4" />;
      case 'before-after-spread':
        return <Sparkles className="w-4 h-4" />;
      case 'case-study':
        return <Layout className="w-4 h-4" />;
      case 'biography-cv':
        return <FileText className="w-4 h-4" />;
      case 'uiux-casestudy':
        return <Smartphone className="w-4 h-4" />;
      case 'architecture-detail':
        return <Grid className="w-4 h-4" />;
      case 'contact-qr':
        return <QrCode className="w-4 h-4" />;
      default:
        return <Layout className="w-4 h-4" />;
    }
  };

  const portraitTemplates = PAGE_TEMPLATES.filter((t) => t.orientation === 'portrait');
  const landscapeTemplates = PAGE_TEMPLATES.filter((t) => t.orientation === 'landscape');

  const displayedTemplates =
    templateFilter === 'all'
      ? PAGE_TEMPLATES
      : PAGE_TEMPLATES.filter((t) => t.orientation === templateFilter);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200/80 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-stone-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between shrink-0 bg-stone-50/50">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-stone-700" />
              <span>Add New Page</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select orientation and starting layout for your portfolio spread.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* STEP 1: ORIENTATION PICKER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                1. Page Orientation
              </label>
              <span className="text-[11px] text-stone-400">
                Determines canvas aspect ratio
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Portrait */}
              <button
                type="button"
                onClick={() => handleOrientationChange('portrait')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  orientation === 'portrait'
                    ? 'border-stone-900 bg-stone-900/5 ring-2 ring-stone-900/10'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="w-7 h-10 border-2 border-stone-900/80 rounded-xs shrink-0 flex items-center justify-center bg-stone-100 mt-0.5 shadow-2xs">
                  <div className="w-3.5 h-0.5 bg-stone-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">
                      Portrait
                    </span>
                    {orientation === 'portrait' && (
                      <Check className="w-4 h-4 text-stone-900" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Vertical spread · A4 Portrait (210 × 297 mm)
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                    {portraitTemplates.length} Vertical Templates
                  </span>
                </div>
              </button>

              {/* Landscape */}
              <button
                type="button"
                onClick={() => handleOrientationChange('landscape')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  orientation === 'landscape'
                    ? 'border-stone-900 bg-stone-900/5 ring-2 ring-stone-900/10'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="w-10 h-7 border-2 border-stone-900/80 rounded-xs shrink-0 flex items-center justify-center bg-stone-100 mt-1 shadow-2xs">
                  <div className="w-5 h-0.5 bg-stone-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">
                      Landscape
                    </span>
                    {orientation === 'landscape' && (
                      <Check className="w-4 h-4 text-stone-900" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Horizontal spread · A4 Landscape or 16:9 Deck
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded">
                    {landscapeTemplates.length} Horizontal Templates
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: TEMPLATE / CONTENT PICKER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                2. Starting Layout & Template
              </label>

              {/* Segmented Category Filter */}
              <div className="inline-flex rounded-lg p-0.5 bg-stone-100 border border-stone-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setTemplateFilter('portrait')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    templateFilter === 'portrait'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Portrait ({portraitTemplates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateFilter('landscape')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    templateFilter === 'landscape'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Landscape ({landscapeTemplates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    templateFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({PAGE_TEMPLATES.length})
                </button>
              </div>
            </div>

            {/* Blank Canvas Option */}
            <button
              type="button"
              onClick={() => handleSelectTemplate('blank')}
              className={`w-full p-3.5 rounded-xl border transition-all flex items-center gap-3.5 text-left ${
                selectedTemplateId === 'blank'
                  ? 'border-stone-900 bg-stone-900/5 ring-2 ring-stone-900/10'
                  : 'border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/50'
              }`}
            >
              <div className="w-9 h-9 rounded-lg border border-dashed border-stone-400/80 flex items-center justify-center text-stone-500 shrink-0 bg-white">
                <Plus className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-900">
                      Blank Canvas
                    </span>
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-mono">
                      Custom
                    </span>
                  </div>
                  {selectedTemplateId === 'blank' && (
                    <Check className="w-4 h-4 text-stone-900" />
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Start with a clean page and add customized headlines, plates, or mockups freely.
                </p>
              </div>
            </button>

            {/* Pre-built Templates Grid */}
            <div className="space-y-1.5 pt-0.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {displayedTemplates.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  const isPortrait = tpl.orientation === 'portrait';
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900/5 ring-2 ring-stone-900/10'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 shrink-0 mt-0.5">
                        {getTemplateIcon(tpl.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-stone-900 truncate">
                            {tpl.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />}
                        </div>

                        {/* Orientation Badge & Category Badge */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[9.5px] font-medium px-1.5 py-0.2 rounded flex items-center gap-1 ${
                              isPortrait
                                ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                : 'bg-blue-50 text-blue-800 border border-blue-200/60'
                            }`}
                          >
                            {isPortrait ? 'Portrait' : 'Landscape'}
                          </span>
                          <span className="text-[9.5px] uppercase tracking-wider font-mono text-stone-400">
                            {tpl.badge}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                          {tpl.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 3: PAGE TITLE */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              3. Page Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Architectural Monograph, Case Study 02..."
              className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between gap-2.5 shrink-0">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-stone-400" />
            <span>
              Target: <strong className="text-stone-800 capitalize">{orientation}</strong> spread
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
