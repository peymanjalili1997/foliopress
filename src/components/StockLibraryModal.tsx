import React, { useState } from 'react';
import { Check, Filter, Image as ImageIcon, Plus, Sparkles, X } from 'lucide-react';
import { ARCHITECTURAL_STOCK_LIBRARY, StockVisualPlate } from '../data/stockLibrary';

interface StockLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlate: (plate: StockVisualPlate) => void;
  selectedImageUrl?: string;
}

export const StockLibraryModal: React.FC<StockLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPlate,
  selectedImageUrl,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = ['All', 'Travertine & Stone', 'Exposed Concrete', 'Timber & Joinery', 'Atmospheric & Light'];

  const filteredPlates = ARCHITECTURAL_STOCK_LIBRARY.filter((plate) => {
    const matchesCat = activeCategory === 'All' || plate.category === activeCategory;
    const matchesSearch =
      plate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200/90 flex items-center justify-between shrink-0 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="w-4 h-4 text-stone-200" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Architectural Visuals & Materials Library
              </h2>
              <p className="text-xs text-stone-500">
                1-click curated high-resolution plates: Roman travertine, architectural concrete, timber joinery, and shadow studies.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 font-medium rounded-md transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter visuals..."
            className="h-8 px-3 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900 w-48"
          />
        </div>

        {/* Plates Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPlates.map((plate) => {
              const isSelected = selectedImageUrl === plate.url;
              return (
                <div
                  key={plate.id}
                  onClick={() => {
                    onSelectPlate(plate);
                    onClose();
                  }}
                  className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all flex flex-col bg-stone-50 ${
                    isSelected
                      ? 'border-stone-900 ring-2 ring-stone-900/20 shadow-md'
                      : 'border-stone-200 hover:border-stone-400 hover:shadow-sm'
                  }`}
                >
                  <div className="relative aspect-4/3 w-full bg-stone-200 overflow-hidden">
                    <img
                      src={plate.url}
                      alt={plate.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded-lg shadow-md">
                        Use this Plate
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {plate.title}
                      </h4>
                      <span className="text-[10px] font-mono text-stone-400 shrink-0">
                        {plate.aspectRatio}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                      {plate.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200/90 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Clicking any visual plate immediately applies it to the active block plate.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
