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
import { ENGLISH_FONTS } from '../data/editorialAssets';
import { BlockType, PortfolioBlock, TextStyle } from '../types/portfolio';

interface TextFormatToolbarProps {
  selectedBlock: PortfolioBlock | null;
  onUpdateTextStyle: (patch: Partial<TextStyle>) => void;
  onAddBlock: (type: BlockType) => void;
  onAiPolishText?: (style: 'editorial' | 'concise' | 'technical' | 'grammar') => void;
  defaultHeadingFont: string;
}

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

export const TextFormatToolbar: React.FC<TextFormatToolbarProps> = ({
  selectedBlock,
  onUpdateTextStyle,
  onAddBlock,
  defaultHeadingFont,
}) => {
  const activeStyle: TextStyle = selectedBlock?.textStyle || {
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

  const isDisabled = !selectedBlock;

  return (
    <div className="bg-white border-b border-stone-200/90 px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Left: Rich Typography Controls for Selected Block */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1.5 pr-2 border-r border-stone-200">
          <Type className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <select
            disabled={isDisabled}
            aria-label="English Font Family"
            value={activeStyle.fontFamily}
            onChange={(e) => onUpdateTextStyle({ fontFamily: e.target.value })}
            style={{ fontFamily: activeStyle.fontFamily }}
            className="h-8 px-2.5 text-xs font-medium bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900 disabled:opacity-45 cursor-pointer min-w-[175px]"
          >
            {(['Editorial Serif', 'Architectural Sans', 'Display & Avant-Garde', 'Technical Mono'] as const).map(
              (cat) => (
                <optgroup key={cat} label={cat}>
                  {ENGLISH_FONTS.filter((f) => f.category === cat).map((font) => (
                    <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>
                      {font.name}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </select>

          {/* Font Size */}
          <select
            disabled={isDisabled}
            aria-label="Font Size"
            value={Math.round(activeStyle.fontSize)}
            onChange={(e) => onUpdateTextStyle({ fontSize: Number(e.target.value) })}
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
            onChange={(e) => onUpdateTextStyle({ fontWeight: Number(e.target.value) })}
            className="h-8 px-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900 disabled:opacity-45 cursor-pointer"
          >
            <option value={300}>Light 300</option>
            <option value={400}>Regular 400</option>
            <option value={500}>Medium 500</option>
            <option value={600}>SemiBold 600</option>
            <option value={700}>Bold 700</option>
          </select>
        </div>

        {/* Bold / Italic / Underline / Case */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-stone-200">
          <button
            type="button"
            disabled={isDisabled}
            title="Bold (700)"
            onClick={() =>
              onUpdateTextStyle({ fontWeight: activeStyle.fontWeight >= 600 ? 400 : 700 })
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
              onUpdateTextStyle({
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
              onUpdateTextStyle({
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
              onUpdateTextStyle({
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

        {/* Text Alignment (Default Left-Aligned LTR) */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-stone-200">
          {(
            [
              { align: 'left', icon: AlignLeft, label: 'Align Left (LTR Default)' },
              { align: 'center', icon: AlignCenter, label: 'Align Center' },
              { align: 'right', icon: AlignRight, label: 'Align Right' },
              { align: 'justify', icon: AlignJustify, label: 'Justify Editorial Prose' },
            ] as const
          ).map(({ align, icon: Icon, label }) => (
            <button
              key={align}
              type="button"
              disabled={isDisabled}
              title={label}
              onClick={() => onUpdateTextStyle({ textAlign: align })}
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
              onChange={(e) => onUpdateTextStyle({ lineHeight: Number(e.target.value) })}
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
              onChange={(e) => onUpdateTextStyle({ letterSpacing: Number(e.target.value) })}
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
              onChange={(e) => onUpdateTextStyle({ color: e.target.value })}
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
                <div className="absolute left-0 top-full mt-1 hidden group-hover/ai:flex flex-col bg-white border border-stone-200 rounded-lg shadow-xl py-1 z-30 min-w-[210px]">
                  <button
                    type="button"
                    onClick={() => onAiPolishText('editorial')}
                    className="px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  >
                    🏛️ Architectural Monograph Tone
                  </button>
                  <button
                    type="button"
                    onClick={() => onAiPolishText('concise')}
                    className="px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  >
                    ⚡ Concise & Impactful
                  </button>
                  <button
                    type="button"
                    onClick={() => onAiPolishText('technical')}
                    className="px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  >
                    📐 Technical / Case Study Precision
                  </button>
                  <button
                    type="button"
                    onClick={() => onAiPolishText('grammar')}
                    className="px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  >
                    ✍️ Grammar & Vocabulary Polish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Insert Block Buttons onto Current Page */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        <span className="text-[11px] font-medium text-stone-400 mr-1 whitespace-nowrap shrink-0">
          Insert:
        </span>
        <button
          type="button"
          onClick={() => onAddBlock('heading')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
        >
          <Heading1 className="w-3.5 h-3.5" />
          <span>Heading</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('paragraph')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Text</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('image')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('device-mockup')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          title="MacBook / iPhone Device Mockup Frame"
        >
          <Laptop className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mockup</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('color-palette')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          title="Project Color Palette & Swatches"
        >
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span>Palette</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('before-after')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          title="Before / After Project Comparison"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
          <span>Before/After</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('qr-code')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          title="Interactive QR Code Scan Card"
        >
          <QrCode className="w-3.5 h-3.5 text-blue-600" />
          <span>QR Code</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('split-media-text')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('multi-photo-grid')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          title="3-Photo Detail Grid"
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('project-meta')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          title="Software & Tools Stack Chips"
        >
          <Tags className="w-3.5 h-3.5" />
          <span>Stack</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('pull-quote')}
          className="px-2 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
        >
          <Quote className="w-3.5 h-3.5" />
          <span>Quote</span>
        </button>
        <button
          type="button"
          onClick={() => onAddBlock('divider')}
          className="px-1.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md flex items-center gap-0.5 transition-colors whitespace-nowrap shrink-0"
          title="Insert Architectural Rule / Spacer"
        >
          <Minus className="w-3.5 h-3.5" />
          <span>Rule</span>
        </button>
      </div>
    </div>
  );
};
