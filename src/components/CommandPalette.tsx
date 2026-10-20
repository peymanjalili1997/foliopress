import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  Command,
  Copy,
  Download,
  Eye,
  FilePlus,
  Image as ImageIcon,
  Layers,
  Layout,
  Maximize2,
  Minimize2,
  Palette,
  Play,
  Redo2,
  Search,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export interface CommandItem {
  id: string;
  category: 'Projects & Files' | 'Pages & Templates' | 'Starter Kits' | 'Archival Themes' | 'Typography' | 'Export & Present' | 'Canvas & View';
  title: string;
  subtitle?: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keep selected item visible while navigating with arrows
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[selectedIndex];
      if (target) {
        target.action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[70vh] animate-in zoom-in-95 duration-100"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-stone-200 bg-white">
          <Search className="w-4 h-4 text-stone-400 absolute left-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search action (e.g. export, dark, add page, kit)..."
            className="w-full pl-8 pr-16 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-stone-900 placeholder:text-stone-400"
          />
          <kbd className="absolute right-4 text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="p-2 overflow-y-auto space-y-1 flex-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              No matching commands found for "{query}".
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  data-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span
                          className={`text-[9px] uppercase tracking-wider font-mono px-1 rounded ${
                            isSelected
                              ? 'bg-stone-800 text-stone-400'
                              : 'bg-stone-200/60 text-stone-500'
                          }`}
                        >
                          {cmd.category}
                        </span>
                      </div>
                      {cmd.subtitle && (
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isSelected ? 'text-stone-300' : 'text-stone-400'
                          }`}
                        >
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <kbd
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-stone-800 text-stone-300'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-stone-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2 border-t border-stone-200 bg-stone-50 text-[10px] text-stone-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="bg-white border px-1 py-0.5 rounded shadow-2xs font-mono">↑</kbd>{' '}
              <kbd className="bg-white border px-1 py-0.5 rounded shadow-2xs font-mono">↓</kbd> to
              navigate
            </span>
            <span>
              <kbd className="bg-white border px-1 py-0.5 rounded shadow-2xs font-mono">↵</kbd> to
              select
            </span>
          </div>
          <span className="font-mono text-stone-400">FolioPress Command Palette</span>
        </div>
      </div>
    </div>
  );
};
