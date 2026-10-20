import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  X,
} from 'lucide-react';
import { PAGE_SIZE_PRESETS } from '../data/editorialAssets';
import { GlobalDocumentSettings, PortfolioPage } from '../types/portfolio';
import { PageCanvas } from './PageCanvas';

interface PresentationViewProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PortfolioPage[];
  initialPageIndex?: number;
  globalSettings: GlobalDocumentSettings;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  isOpen,
  onClose,
  pages,
  initialPageIndex = 0,
  globalSettings,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialPageIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  // Sync initial page
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialPageIndex);
    }
  }, [isOpen, initialPageIndex]);

  const currentPage = pages[currentIndex] || pages[0];
  const activeSizeId = currentPage?.pageSizeOverride || globalSettings.pageSize;
  const sizeSpec =
    PAGE_SIZE_PRESETS.find((s) => s.id === activeSizeId) || PAGE_SIZE_PRESETS[0];

  // Auto-calculate exact scale to fit window viewport
  useEffect(() => {
    if (!isOpen) return;

    const computeScale = () => {
      const availWidth = window.innerWidth - 80;
      const availHeight = window.innerHeight - 120;
      const scaleX = availWidth / sizeSpec.widthPx;
      const scaleY = availHeight / sizeSpec.heightPx;
      const fitScale = Math.min(scaleX, scaleY, 1.25);
      setScale(Math.max(fitScale, 0.35));
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [isOpen, sizeSpec.widthPx, sizeSpec.heightPx]);

  // Keyboard navigation: ArrowLeft, ArrowRight, Space, Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(i + 1, pages.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pages.length, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  const currentNumStr = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
  const totalNumStr = pages.length < 10 ? `0${pages.length}` : `${pages.length}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0C] text-stone-200 flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Floating Presentation Ribbon */}
      <header className="h-14 px-6 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <span
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            className="text-lg font-semibold tracking-wide text-white"
          >
            {globalSettings.portfolioTitle}
          </span>
          <span className="text-stone-600">·</span>
          <span className="text-xs text-stone-400 font-medium truncate max-w-sm">
            {currentPage.title}
          </span>
        </div>

        {/* Center: Slide indicator & Keyboard hints */}
        <div className="flex items-center gap-3 text-xs tabular-nums text-stone-400">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="p-1 rounded hover:bg-stone-800 disabled:opacity-20 text-white"
              title="Previous Slide (← / ArrowLeft)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white px-1 tracking-wider">
              {currentNumStr} / {totalNumStr}
            </span>
            <button
              type="button"
              disabled={currentIndex === pages.length - 1}
              onClick={() => setCurrentIndex((i) => Math.min(pages.length - 1, i + 1))}
              className="p-1 rounded hover:bg-stone-800 disabled:opacity-20 text-white"
              title="Next Slide (→ / ArrowRight / Space)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="hidden sm:inline text-stone-600 text-[11px]">
            [Use ← / → keys or Space]
          </span>
        </div>

        {/* Right: Fullscreen & Exit */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Exit Presentation Mode (ESC)"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close (ESC)</span>
          </button>
        </div>
      </header>

      {/* Main Centered Stage */}
      <main className="flex-1 flex items-center justify-center p-6 overflow-hidden relative">
        {/* Subtle Next/Prev Click zones on left & right sides */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/60 hover:bg-stone-900 text-stone-400 hover:text-white transition-all backdrop-blur-xs z-30"
            title="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {currentIndex < pages.length - 1 && (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/60 hover:bg-stone-900 text-stone-400 hover:text-white transition-all backdrop-blur-xs z-30"
            title="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div className="shadow-[0_25px_70px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-200">
          <PageCanvas
            page={currentPage}
            pageIndex={currentIndex}
            totalPages={pages.length}
            globalSettings={globalSettings}
            selectedBlockId={null}
            onSelectBlock={() => {}}
            onUpdateBlock={() => {}}
            onMoveBlock={() => {}}
            onDuplicateBlock={() => {}}
            onDeleteBlock={() => {}}
            isExportMode={true}
            scale={scale}
          />
        </div>
      </main>

      {/* Bottom Thumbnail Scrubber Drawer */}
      <footer className="h-16 px-6 bg-stone-950/80 border-t border-stone-800/80 flex items-center justify-center gap-2 overflow-x-auto shrink-0">
        {pages.map((p, idx) => {
          const isActive = idx === currentIndex;
          const num = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all tabular-nums whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white text-stone-950 shadow-md scale-105'
                  : 'bg-stone-900/90 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <span className="font-mono text-[11px] opacity-60">{num}</span>
              <span className="truncate max-w-[120px]">{p.title}</span>
            </button>
          );
        })}
      </footer>
    </div>
  );
};
