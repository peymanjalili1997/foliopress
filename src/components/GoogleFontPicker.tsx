import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Plus, Search, Sparkles, Type } from 'lucide-react';
import { FontOption } from '../types/portfolio';
import { EXTENDED_GOOGLE_FONTS, getCleanFontName, loadGoogleFont } from '../utils/googleFonts';

interface GoogleFontPickerProps {
  value: string;
  onChange: (fontFamily: string) => void;
  disabled?: boolean;
  className?: string;
}

export const GoogleFontPicker: React.FC<GoogleFontPickerProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [customFonts, setCustomFonts] = useState<FontOption[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Ensure current font is loaded online
  useEffect(() => {
    if (value) {
      loadGoogleFont(value);
    }
  }, [value]);

  const allFonts = [...customFonts, ...EXTENDED_GOOGLE_FONTS];

  const filteredFonts = allFonts.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      categoryFilter === 'All' ||
      (categoryFilter === 'Serif' && f.category.includes('Serif')) ||
      (categoryFilter === 'Sans' && f.category.includes('Sans')) ||
      (categoryFilter === 'Display' && f.category.includes('Display')) ||
      (categoryFilter === 'Mono' && f.category.includes('Mono'));
    return matchesSearch && matchesCat;
  });

  const handleSelectFont = async (font: FontOption) => {
    await loadGoogleFont(font.family);
    onChange(font.family);
    setIsOpen(false);
  };

  const handleLoadCustomFont = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const formattedFamily = `'${trimmed}', sans-serif`;
    await loadGoogleFont(trimmed);
    const newFont: FontOption = {
      name: trimmed,
      family: formattedFamily,
      category: 'Online Google Font',
      sample: 'Live Online Google Font',
    };
    setCustomFonts((prev) => [newFont, ...prev.filter((f) => f.name.toLowerCase() !== trimmed.toLowerCase())]);
    onChange(formattedFamily);
    setSearchQuery('');
    setIsOpen(false);
  };

  const exactMatchExists = allFonts.some(
    (f) => f.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ fontFamily: value }}
        className="h-8 px-2.5 text-xs font-medium bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-md text-stone-900 flex items-center justify-between gap-2 min-w-[170px] max-w-[210px] transition-all disabled:opacity-45 disabled:pointer-events-none text-left shadow-2xs"
      >
        <span className="truncate">{cleanCurrentName || 'Select Google Font'}</span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-76 bg-white border border-stone-200/90 rounded-xl shadow-xl z-50 p-2.5 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-100">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim() && !exactMatchExists) {
                  e.preventDefault();
                  handleLoadCustomFont(searchQuery);
                }
              }}
              placeholder="Search or enter any Google Font..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 bg-stone-100/80 rounded-md text-[10px]">
            {['All', 'Serif', 'Sans', 'Display', 'Mono'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`flex-1 py-0.5 rounded font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Arbitrary Google Font Add Option if query doesn't match predefined list */}
          {searchQuery.trim().length > 1 && !exactMatchExists && (
            <button
              type="button"
              onClick={() => handleLoadCustomFont(searchQuery)}
              className="w-full p-2 rounded-lg bg-stone-900 text-white text-xs font-medium flex items-center justify-between gap-2 hover:bg-stone-800 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Load Google Font: <strong>"{searchQuery.trim()}"</strong></span>
              </div>
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Font List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {filteredFonts.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-500">
                No matching fonts found. Press Enter to load "{searchQuery.trim()}" directly from Google Fonts.
              </div>
            ) : (
              filteredFonts.map((font) => {
                const isSelected = cleanCurrentName.toLowerCase() === font.name.toLowerCase();
                return (
                  <button
                    key={font.name}
                    type="button"
                    onMouseEnter={() => loadGoogleFont(font.family)}
                    onClick={() => handleSelectFont(font)}
                    className={`w-full p-2 text-left rounded-lg transition-colors flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-stone-900 text-white'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        style={{ fontFamily: font.family }}
                        className="text-sm font-medium leading-tight truncate"
                      >
                        {font.name}
                      </div>
                      <div
                        className={`text-[10px] truncate mt-0.5 ${
                          isSelected ? 'text-stone-300' : 'text-stone-400'
                        }`}
                      >
                        {font.category}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
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
