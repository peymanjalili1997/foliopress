import React from 'react';
import { ArrowRight, Check, Compass, FileText, Layers, Sparkles, X } from 'lucide-react';
import { STARTER_KITS, StarterKit } from '../data/starterKits';

interface StarterKitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyKit: (kit: StarterKit) => void;
}

export const StarterKitsModal: React.FC<StarterKitsModalProps> = ({
  isOpen,
  onClose,
  onApplyKit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-200/90 flex items-center justify-between shrink-0 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                1-Click Multi-Page Starter Kits
              </h2>
              <p className="text-xs text-stone-500">
                Instantly load an expertly curated, publication-ready multi-page portfolio structure.
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

        {/* Modal Body / Kit Cards */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STARTER_KITS.map((kit) => {
              const isPortrait = kit.orientation === 'portrait';
              return (
                <div
                  key={kit.id}
                  className="p-5 rounded-xl border border-stone-200 hover:border-stone-900/40 bg-white hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Kit Badges */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                          isPortrait
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : 'bg-blue-50 text-blue-900 border-blue-200'
                        }`}
                      >
                        {kit.badge}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        {kit.pageCount} Pages
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-950">
                        {kit.name}
                      </h3>
                      <p className="text-xs font-medium text-stone-500 mt-0.5">
                        {kit.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {kit.description}
                    </p>

                    {/* Included Pages Pill List */}
                    <div className="pt-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                        Included Pages:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {kit.pages.map((p, idx) => (
                          <span
                            key={p.id}
                            className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200/60 truncate max-w-[140px]"
                          >
                            {idx + 1}. {p.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">Replaces current draft</span>
                    <button
                      type="button"
                      onClick={() => {
                        onApplyKit(kit);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Load Kit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3.5 border-t border-stone-200/90 bg-stone-50 text-[11px] text-stone-500 flex items-center justify-between">
          <span>Tip: You can always use <strong>Undo (Ctrl+Z / Cmd+Z)</strong> to revert back to your previous pages.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-700 hover:text-stone-900 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
