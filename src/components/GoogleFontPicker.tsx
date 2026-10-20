import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Loader2, Search, Sparkles, Type, X } from 'lucide-react';
import { FontOption } from '../types/portfolio';
import {
  ALL_GOOGLE_FONTS,
  getCleanFontName,
  loadGoogleFont,
  searchGoogleFonts,
} from '../utils/googleFonts';

interface GoogleFontPickerProps {
  value: string;
  onChange: (fontFamily: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const GoogleFontPicker: React.FC<GoogleFontPickerProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder = 'Select Google Font',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const cleanCurrentName = getCleanFontName(value);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      // Auto focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Ensure current font is loaded online
  useEffect(() => {
    if (value) {
      loadGoogleFont(value);
    }
  }, [value]);

  // Real-time search across all 1,938 Google Fonts
  const matchingFonts = searchGoogleFonts(searchQuery, categoryFilter, 80);

  const exactMatch = matchingFonts.find(
    (f) => f.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const handleSelectFont = async (font: FontOption | string) => {
    const fontName = typeof font === 'string' ? font.trim() : font.name;
    const fontFamily =
      typeof font === 'string' ? `'${fontName}', sans-serif` : font.family;

    if (!fontName) return;

    setIsLoading(true);
    await loadGoogleFont(fontName);
    setIsLoading(false);

    onChange(fontFamily);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchingFonts.length > 0) {
        handleSelectFont(matchingFonts[0]);
      } else if (searchQuery.trim()) {
        handleSelectFont(searchQuery.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative block w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ fontFamily: value }}
        className="h-8 px-2.5 text-xs font-medium bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-md text-stone-900 flex items-center justify-between gap-2 w-full transition-all disabled:opacity-45 disabled:pointer-events-none text-left shadow-2xs"
        title={cleanCurrentName ? `Active Font: ${cleanCurrentName}` : placeholder}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Type className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="truncate">{cleanCurrentName || placeholder}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isLoading && <Loader2 className="w-3 h-3 text-stone-500 animate-spin" />}
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </div>
      </button>

      {/* Real-time Google Fonts Search Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 w-full bg-white border border-stone-200/90 rounded-xl shadow-2xl z-50 p-2.5 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search 1,900+ Google Fonts..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-0.5 text-stone-400 hover:text-stone-700 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills & Results Count */}
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <div className="flex items-center gap-0.5 p-0.5 bg-stone-100/90 rounded-md shrink-0">
              {['All', 'Sans', 'Serif', 'Display', 'Mono'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="text-stone-400 tabular-nums truncate text-[9.5px]">
              {searchQuery
                ? `${matchingFonts.length} match${matchingFonts.length === 1 ? '' : 'es'}`
                : `${ALL_GOOGLE_FONTS.length.toLocaleString()} Fonts`}
            </span>
          </div>

          {/* Direct Arbitrary Query Action */}
          {searchQuery.trim().length > 1 && !exactMatch && (
            <button
              type="button"
              onClick={() => handleSelectFont(searchQuery.trim())}
              className="w-full p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center justify-between gap-2 transition-colors shadow-2xs text-left"
            >
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">
                  Load Google Font: <strong>"{searchQuery.trim()}"</strong>
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-300 bg-stone-800 px-1.5 py-0.5 rounded shrink-0">
                ↵ Enter
              </span>
            </button>
          )}

          {/* Real-time Matching Fonts List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
            {matchingFonts.length === 0 ? (
              <div className="py-6 px-3 text-center space-y-1">
                <p className="text-xs font-medium text-stone-700">No matching font in catalog</p>
                <p className="text-[11px] text-stone-400">
                  Press <strong>Enter</strong> to fetch "{searchQuery.trim()}" directly from Google Fonts CDN.
                </p>
              </div>
            ) : (
              matchingFonts.map((font) => {
                const isSelected =
                  cleanCurrentName.toLowerCase() === font.name.toLowerCase();
                return (
                  <button
                    key={font.name}
                    type="button"
                    onMouseEnter={() => loadGoogleFont(font.name)}
                    onClick={() => handleSelectFont(font)}
                    className={`w-full p-2 text-left rounded-lg transition-all flex items-center justify-between gap-2 group ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          style={{ fontFamily: font.family }}
                          className="text-sm font-medium leading-tight truncate"
                        >
                          {font.name}
                        </div>
                        {isSelected && (
                          <span className="text-[9px] bg-stone-800 text-stone-300 px-1 rounded uppercase tracking-wider font-mono">
                            Current
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] truncate mt-0.5 ${
                          isSelected ? 'text-stone-300' : 'text-stone-400'
                        }`}
                      >
                        {font.category}
                      </div>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white shrink-0" />
                    ) : (
                      <span className="text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono shrink-0">
                        Apply
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
