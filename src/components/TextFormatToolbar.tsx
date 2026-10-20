import React, { useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeftRight,
  Bold,
  Columns,
  FileText,
  Grid3X3,
  Heading1,
  Image as ImageIcon,
  Italic,
  Laptop,
  LayoutGrid,
  Minus,
  Palette,
  QrCode,
  Quote,
  Sparkles,
  SplitSquareVertical,
  Tags,
  Type,
  Underline,
} from 'lucide-react';
import { BlockType, PortfolioBlock, TextStyle, TextTargetField } from '../types/portfolio';
import { GoogleFontPicker } from './GoogleFontPicker';

interface TextFormatToolbarProps {
  selectedBlock: PortfolioBlock | null;
  activeTextTarget?: TextTargetField;
  onSelectTextTarget?: (target: TextTargetField) => void;
  onUpdateTextStyle: (patch: Partial<TextStyle>, target?: TextTargetField) => void;
  onAddBlock: (type: BlockType) => void;
  onAiPolishText?: (style: 'editorial' | 'concise' | 'technical' | 'grammar') => void;
  defaultHeadingFont: string;
}

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

export const TextFormatToolbar: React.FC<TextFormatToolbarProps> = ({
  selectedBlock,
  activeTextTarget = 'primary',
  onSelectTextTarget,
  onUpdateTextStyle,
  onAddBlock,
  onAiPolishText,
  defaultHeadingFont,
}) => {
  // Determine available text targets for currently selected block
  const getTargetsForBlock = (): Array<{ id: TextTargetField; label: string }> => {
    if (!selectedBlock) return [];
    if (selectedBlock.type === 'heading') {
      return [
        { id: 'primary', label: 'Headline' },
        { id: 'secondary', label: 'Subtitle' },
        { id: 'kicker', label: 'Kicker' },
      ];
    }
    if (selectedBlock.type === 'pull-quote') {
      return [
        { id: 'primary', label: 'Quote' },
        { id: 'kicker', label: 'Attribution' },
      ];
    }
    if (selectedBlock.type === 'two-column-text') {
      return [
        { id: 'primary', label: 'Column 1' },
        { id: 'secondary', label: 'Column 2' },
      ];
    }
    return [{ id: 'primary', label: 'Text' }];
  };

  const targets = getTargetsForBlock();

  // Determine active typography style based on current target
  const getActiveStyle = (): TextStyle => {
    if (!selectedBlock) {
      return {
        fontFamily: defaultHeadingFont,
        fontSize: 16,
        fontWeight: 400,
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'left',
        lineHeight: 1.5,
        letterSpacing: 0,
        textTransform: 'none',
      };
    }

    if (activeTextTarget === 'kicker') {
      return (
        selectedBlock.kickerTextStyle || {
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 500,
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: selectedBlock.textStyle?.textAlign || 'left',
          lineHeight: 1.4,
          letterSpacing: 0.12,
          textTransform: 'uppercase',
        }
      );
    }

    if (activeTextTarget === 'secondary') {
      return (
        selectedBlock.secondaryTextStyle || {
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          fontSize: 14,
          fontWeight: 400,
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: selectedBlock.textStyle?.textAlign || 'left',
          lineHeight: 1.55,
          letterSpacing: 0,
          textTransform: 'none',
        }
      );
    }

    return selectedBlock.textStyle;
  };

  const activeStyle = getActiveStyle();
  const isDisabled = !selectedBlock;

  const handlePatch = (patch: Partial<TextStyle>) => {
    onUpdateTextStyle(patch, activeTextTarget);
  };

  return (
    <div className="bg-white border-b border-stone-200/90 px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Left: Rich Typography Controls for Selected Block */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Block & Multi-Text Target Selector */}
        {selectedBlock && targets.length > 1 && (
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200/80 mr-1 shrink-0">
            <span className="text-[9.5px] text-stone-400 font-mono uppercase px-1 font-semibold">
              Target:
            </span>
            {targets.map((tgt) => (
              <button
                key={tgt.id}
                type="button"
                onClick={() => onSelectTextTarget?.(tgt.id)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-all ${
                  activeTextTarget === tgt.id
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tgt.label}
              </button>
            ))}
          </div>
        )}

        {/* Font Family (Online Google Fonts Loader) & Sizing */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-stone-200">
          <GoogleFontPicker
            disabled={isDisabled}
            value={activeStyle.fontFamily}
            onChange={(family) => handlePatch({ fontFamily: family })}
          />

          {/* Font Size */}
          <select
            disabled={isDisabled}
            aria-label="Font Size"
            value={Math.round(activeStyle.fontSize)}
            onChange={(e) => handlePatch({ fontSize: Number(e.target.value) })}
            className="h-8 px-2 text-xs tabular-nums font-medium bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900 disabled:opacity-45 cursor-pointer"
          >
            {FONT_SIZES.map((sz) => (
              <option key={sz} value={sz}>
                {sz} px
              </option>
            ))}
          </select>

          {/* Font Weight */}
          <select
            disabled={isDisabled}
            aria-label="Font Weight"
            value={activeStyle.fontWeight}
            onChange={(e) => handlePatch({ fontWeight: Number(e.target.value) })}
            className="h-8 px-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900 disabled:opacity-45 cursor-pointer"
          >
            <option value={300}>Light 300</option>
            <option value={400}>Regular 400</option>
            <option value={500}>Medium 500</option>
            <option value={600}>SemiBold 600</option>
            <option value={700}>Bold 700</option>
            <option value={800}>ExtraBold 800</option>
          </select>
        </div>

        {/* Bold / Italic / Underline / Case */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-stone-200">
          <button
            type="button"
            disabled={isDisabled}
            title="Bold (700)"
            onClick={() =>
              handlePatch({ fontWeight: activeStyle.fontWeight >= 600 ? 400 : 700 })
            }
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-40 ${
              activeStyle.fontWeight >= 600
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={isDisabled}
            title="Italic"
            onClick={() =>
              handlePatch({
                fontStyle: activeStyle.fontStyle === 'italic' ? 'normal' : 'italic',
              })
            }
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-40 ${
              activeStyle.fontStyle === 'italic'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={isDisabled}
            title="Underline"
            onClick={() =>
              handlePatch({
                textDecoration: activeStyle.textDecoration === 'underline' ? 'none' : 'underline',
              })
            }
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-40 ${
              activeStyle.textDecoration === 'underline'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={isDisabled}
            title="Toggle Uppercase Tracking"
            onClick={() =>
              handlePatch({
                textTransform: activeStyle.textTransform === 'uppercase' ? 'none' : 'uppercase',
              })
            }
            className={`px-1.5 h-7 text-[11px] font-semibold tracking-wider flex items-center justify-center rounded transition-colors disabled:opacity-40 whitespace-nowrap shrink-0 ${
              activeStyle.textTransform === 'uppercase'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            AA
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-stone-200">
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
              disabled={isDisabled}
              title={label}
              onClick={() => handlePatch({ textAlign: align })}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-40 ${
                activeStyle.textAlign === align
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Line Height & Letter Spacing */}
        <div className="flex items-center gap-2 pr-2 border-r border-stone-200">
          <label className="flex items-center gap-1 text-[11px] text-stone-500 whitespace-nowrap">
            <span>LH</span>
            <select
              disabled={isDisabled}
              value={activeStyle.lineHeight}
              onChange={(e) => handlePatch({ lineHeight: Number(e.target.value) })}
              className="h-7 px-1.5 text-xs tabular-nums bg-stone-50 border border-stone-200 rounded text-stone-800 disabled:opacity-40"
            >
              <option value={1.05}>1.05</option>
              <option value={1.15}>1.15</option>
              <option value={1.3}>1.30</option>
              <option value={1.5}>1.50</option>
              <option value={1.68}>1.68</option>
              <option value={1.85}>1.85</option>
              <option value={2.0}>2.00</option>
            </select>
          </label>

          <label className="flex items-center gap-1 text-[11px] text-stone-500 whitespace-nowrap">
            <span>Track</span>
            <select
              disabled={isDisabled}
              value={activeStyle.letterSpacing}
              onChange={(e) => handlePatch({ letterSpacing: Number(e.target.value) })}
              className="h-7 px-1.5 text-xs tabular-nums bg-stone-50 border border-stone-200 rounded text-stone-800 disabled:opacity-40"
            >
              <option value={-0.03}>Tight (-0.03em)</option>
              <option value={-0.01}>Slight (-0.01em)</option>
              <option value={0}>Normal (0em)</option>
              <option value={0.04}>Wide (+0.04em)</option>
              <option value={0.1}>Editorial (+0.10em)</option>
              <option value={0.18}>Spaced (+0.18em)</option>
            </select>
          </label>

          {/* Text Color Picker */}
          <label
            title="Custom Text Color"
            className={`flex items-center gap-1 cursor-pointer ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <input
              type="color"
              disabled={isDisabled}
              value={activeStyle.color || '#161514'}
              onChange={(e) => handlePatch({ color: e.target.value })}
              className="w-6 h-6 rounded border border-stone-300 cursor-pointer p-0 bg-transparent"
            />
          </label>

          {/* AI Text Polishing Assistant */}
          {onAiPolishText && (
            <div className="relative group/ai">
              <button
                type="button"
                disabled={isDisabled}
                className="h-7 px-2 text-[11px] font-medium bg-gradient-to-r from-amber-50 to-stone-100 hover:from-amber-100 hover:to-stone-200 border border-amber-300/60 rounded flex items-center gap-1 text-stone-800 transition-colors disabled:opacity-40"
                title="AI Writing Assistant — Polish or Refine English prose"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>AI Polish</span>
              </button>
              {!isDisabled && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-lg py-1 hidden group-hover/ai:block z-30">
                  <button
                    type="button"
                    onClick={() => onAiPolishText('editorial')}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-800 hover:bg-stone-100"
                  >
                    Architectural Monograph
                  </button>
                  <button
                    type="button"
                    onClick={() => onAiPolishText('concise')}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-800 hover:bg-stone-100"
                  >
                    Concise & Crisp
                  </button>
                  <button
                    type="button"
                    onClick={() => onAiPolishText('technical')}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-800 hover:bg-stone-100"
                  >
                    Technical Specifications
                  </button>
                  <button
                    type="button"
                    onClick={() => onAiPolishText('grammar')}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-800 hover:bg-stone-100"
                  >
                    Fix English Flow
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Block Adder Strip */}
      <div className="flex items-center gap-1 shrink-0 overflow-x-auto py-0.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 pr-1 border-r border-stone-200 mr-1 hidden lg:inline">
          + Block:
        </span>
        <button
          type="button"
          onClick={() => onAddBlock('heading')}
          title="Add Editorial Section Heading"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <Heading1 className="w-3.5 h-3.5" />
          <span>Heading</span>
        </button>

        <button
          type="button"
          onClick={() => onAddBlock('paragraph')}
          title="Add Body Paragraph"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Text</span>
        </button>

        <button
          type="button"
          onClick={() => onAddBlock('image')}
          title="Add Full-Width Image Plate"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image</span>
        </button>

        <button
          type="button"
          onClick={() => onAddBlock('split-media-text')}
          title="Add Split Media + Text Column"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>

        <button
          type="button"
          onClick={() => onAddBlock('device-mockup')}
          title="Add MacBook / iPhone Mockup Frame"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <Laptop className="w-3.5 h-3.5 text-stone-600" />
          <span>Mockup</span>
        </button>

        <button
          type="button"
          onClick={() => onAddBlock('before-after')}
          title="Add Before / After Comparison"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-stone-600" />
          <span>Before/After</span>
        </button>

        <button
          type="button"
          onClick={() => onAddBlock('multi-photo-grid')}
          title="Add Multi-Photo Detail Grid"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <Grid3X3 className="w-3.5 h-3.5 text-stone-600" />
          <span>Grid</span>
        </button>

        <button
          type="button"
          onClick={() => onAddBlock('color-palette')}
          title="Add Color Palette Swatches"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span>Palette</span>
        </button>

        <button
          type="button"
          onClick={() => onAddBlock('qr-code')}
          title="Add Scannable QR Code Card"
          className="px-2 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <QrCode className="w-3.5 h-3.5 text-stone-600" />
          <span>QR</span>
        </button>
      </div>
    </div>
  );
};
