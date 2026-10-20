import React, { useRef } from 'react';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Copy,
  ImagePlus,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { CURATED_VISUAL_PLATES, PAGE_SIZE_PRESETS } from '../data/editorialAssets';
import {
  GlobalDocumentSettings,
  ImageFilterType,
  PortfolioBlock,
  PortfolioPage,
  SpecItem,
  TextStyle,
} from '../types/portfolio';

interface PageCanvasProps {
  page: PortfolioPage;
  pageIndex: number;
  totalPages: number;
  globalSettings: GlobalDocumentSettings;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onUpdateBlock: (blockId: string, patch: Partial<PortfolioBlock>) => void;
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  onDuplicateBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  isExportMode?: boolean;
  scale?: number;
}

function getFilterCss(filter?: ImageFilterType): string {
  switch (filter) {
    case 'grayscale':
      return 'grayscale(100%) contrast(1.06)';
    case 'warm':
      return 'sepia(22%) contrast(1.03) brightness(0.99)';
    case 'contrast':
      return 'contrast(1.22) saturate(0.92)';
    default:
      return 'none';
  }
}

function formatPageNumber(
  index: number,
  total: number,
  style: GlobalDocumentSettings['pageNumberStyle']
): string {
  const num = index + 1;
  const padded = num < 10 ? `0${num}` : `${num}`;
  const paddedTotal = total < 10 ? `0${total}` : `${total}`;
  switch (style) {
    case 'leading-zero':
      return padded;
    case 'fraction':
      return `${padded} / ${paddedTotal}`;
    case 'simple':
      return `Page ${num}`;
    case 'none':
      return '';
  }
}

export const PageCanvas: React.FC<PageCanvasProps> = ({
  page,
  pageIndex,
  totalPages,
  globalSettings,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  isExportMode = false,
  scale = 1,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadTargetRef = useRef<{ blockId: string; isSecondary?: boolean } | null>(null);

  const activePageSizeId = page.pageSizeOverride || globalSettings.pageSize;
  const sizeSpec =
    PAGE_SIZE_PRESETS.find((s) => s.id === activePageSizeId) || PAGE_SIZE_PRESETS[0];

  const pageBg = page.backgroundColor || globalSettings.backgroundColor;
  const pageInk = page.textColor || globalSettings.textColor;
  const mutedInk = globalSettings.mutedTextColor;
  const borderCol = globalSettings.borderColor;
  const accentCol = globalSettings.accentColor;

  const triggerImageUpload = (blockId: string, isSecondary = false) => {
    uploadTargetRef.current = { blockId, isSecondary };
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = uploadTargetRef.current;
    if (!file || !target) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (target.isSecondary) {
        onUpdateBlock(target.blockId, { secondaryImageUrl: dataUrl });
      } else {
        onUpdateBlock(target.blockId, { imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDropFile = (
    e: React.DragEvent<HTMLDivElement>,
    blockId: string,
    isSecondary = false
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (isSecondary) {
        onUpdateBlock(blockId, { secondaryImageUrl: dataUrl });
      } else {
        onUpdateBlock(blockId, { imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const cycleCuratedPlate = (block: PortfolioBlock, isSecondary = false) => {
    const currentUrl = isSecondary ? block.secondaryImageUrl : block.imageUrl;
    const currentIdx = CURATED_VISUAL_PLATES.findIndex((p) => p.url === currentUrl);
    const nextPlate = CURATED_VISUAL_PLATES[(currentIdx + 1) % CURATED_VISUAL_PLATES.length];
    if (isSecondary) {
      onUpdateBlock(block.id, { secondaryImageUrl: nextPlate.url });
    } else {
      onUpdateBlock(block.id, { imageUrl: nextPlate.url });
    }
  };

  const buildTextCss = (style: TextStyle, fallbackColor = pageInk): React.CSSProperties => ({
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    textAlign: style.textAlign,
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}em`,
    textTransform: style.textTransform,
    color: style.color || fallbackColor,
  });

  const renderEditableText = (
    value: string,
    onChange: (val: string) => void,
    style: React.CSSProperties,
    placeholder: string,
    multiline = true
  ) => {
    if (isExportMode) {
      return (
        <div style={style} className="whitespace-pre-wrap break-words">
          {value}
        </div>
      );
    }

    if (!multiline) {
      return (
        <input
          type="text"
          dir="ltr"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={style}
          className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-0 m-0"
        />
      );
    }

    return (
      <div className="relative w-full">
        {/* Mirror div determines exact natural height so textarea never clips or scrolls */}
        <div
          aria-hidden="true"
          style={style}
          className="whitespace-pre-wrap break-words invisible pointer-events-none min-h-[1.4em]"
        >
          {value ? `${value}\n` : placeholder}
        </div>
        <textarea
          dir="ltr"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={style}
          className="absolute inset-0 w-full h-full resize-none overflow-hidden bg-transparent border-0 focus:outline-none focus:ring-0 p-0 m-0"
        />
      </div>
    );
  };

  const renderImageContainer = (
    block: PortfolioBlock,
    imageUrl: string | undefined,
    caption: string | undefined,
    isSecondary = false
  ) => {
    const imgStyle = block.imageStyle || {
      height: 360,
      objectFit: 'cover',
      zoom: 1,
      filter: 'none',
      borderRadius: 0,
      showBorder: false,
    };

    return (
      <div className="flex flex-col gap-2 w-full">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDropFile(e, block.id, isSecondary)}
          style={{
            height: `${imgStyle.height}px`,
            borderRadius: `${imgStyle.borderRadius}px`,
            border: imgStyle.showBorder ? `1px solid ${borderCol}` : 'none',
          }}
          className="relative w-full overflow-hidden bg-stone-200/50 group/img"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={caption || 'Portfolio plate'}
              referrerPolicy="no-referrer"
              style={{
                objectFit: imgStyle.objectFit,
                transform: imgStyle.zoom !== 1 ? `scale(${imgStyle.zoom})` : undefined,
                filter: getFilterCss(imgStyle.filter),
              }}
              className="w-full h-full transition-transform duration-200 block"
            />
          ) : (
            <div
              style={{ borderColor: borderCol, color: mutedInk }}
              className="w-full h-full flex flex-col items-center justify-center border border-dashed p-6 text-center"
            >
              <ImagePlus className="w-7 h-7 mb-2 opacity-60" />
              <span className="text-xs font-medium">Drop an image here or click Upload</span>
            </div>
          )}

          {/* Hover Image Action Overlay (Hidden in PDF Export) */}
          {!isExportMode && (
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-150 bg-stone-950/85 text-white px-2.5 py-1.5 rounded-md shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerImageUpload(block.id, isSecondary);
                }}
                className="flex items-center gap-1 text-[11px] font-medium hover:text-amber-300 transition-colors whitespace-nowrap"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Image</span>
              </button>
              <span className="text-stone-600">·</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cycleCuratedPlate(block, isSecondary);
                }}
                className="flex items-center gap-1 text-[11px] font-medium hover:text-amber-300 transition-colors whitespace-nowrap"
                title="Cycle Curated Architectural Plate"
              >
                <Sparkles className="w-3 h-3" />
                <span>Swap Plate</span>
              </button>
            </div>
          )}
        </div>

        {/* Image Caption */}
        {(caption !== undefined || !isExportMode) && (
          <div className="pt-0.5">
            {renderEditableText(
              caption || '',
              (val) =>
                onUpdateBlock(
                  block.id,
                  isSecondary ? { secondaryImageCaption: val } : { imageCaption: val }
                ),
              {
                fontFamily: globalSettings.monoFont,
                fontSize: '10.5px',
                fontWeight: 400,
                lineHeight: 1.45,
                letterSpacing: '0.02em',
                color: mutedInk,
                textAlign: block.textStyle.textAlign || 'left',
              },
              'Add figure caption or plate credit...',
              false
            )}
          </div>
        )}
      </div>
    );
  };

  const renderBlockContent = (block: PortfolioBlock) => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="flex flex-col gap-2">
            {(block.kicker !== undefined || !isExportMode) &&
              (!isExportMode || (block.kicker && block.kicker.trim().length > 0)) && (
                <div>
                  {renderEditableText(
                    block.kicker || '',
                    (val) => onUpdateBlock(block.id, { kicker: val }),
                    {
                      fontFamily: globalSettings.monoFont,
                      fontSize: '10.5px',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: accentCol,
                      lineHeight: 1.4,
                      textAlign: block.textStyle.textAlign,
                    },
                    'SECTION KICKER / INDEX...',
                    false
                  )}
                </div>
              )}

            <div>
              {renderEditableText(
                block.text || '',
                (val) => onUpdateBlock(block.id, { text: val }),
                buildTextCss(block.textStyle, pageInk),
                'Enter Headline Title...',
                true
              )}
            </div>

            {(block.secondaryText !== undefined || !isExportMode) &&
              (!isExportMode || (block.secondaryText && block.secondaryText.trim().length > 0)) && (
                <div className="pt-0.5 max-w-2xl">
                  {renderEditableText(
                    block.secondaryText || '',
                    (val) => onUpdateBlock(block.id, { secondaryText: val }),
                    {
                      fontFamily: globalSettings.bodyFont,
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: 1.55,
                      color: mutedInk,
                      textAlign: block.textStyle.textAlign,
                    },
                    'Optional lead subtitle or project location...',
                    true
                  )}
                </div>
              )}
          </div>
        );

      case 'paragraph':
        return (
          <div>
            {renderEditableText(
              block.text || '',
              (val) => onUpdateBlock(block.id, { text: val }),
              buildTextCss(block.textStyle, pageInk),
              'Write editorial narrative, project description, or design notes...',
              true
            )}
          </div>
        );

      case 'image':
        return renderImageContainer(block, block.imageUrl, block.imageCaption, false);

      case 'split-media-text': {
        const isImageLeft = block.splitDirection === 'image-left';
        const ratio = block.splitRatio || '50-50';
        const gridCols =
          ratio === '60-40'
            ? 'grid-cols-12'
            : ratio === '40-60'
            ? 'grid-cols-12'
            : 'grid-cols-2';

        const mediaSpan =
          ratio === '60-40'
            ? 'col-span-7'
            : ratio === '40-60'
            ? 'col-span-5'
            : 'col-span-1';
        const textSpan =
          ratio === '60-40'
            ? 'col-span-5'
            : ratio === '40-60'
            ? 'col-span-7'
            : 'col-span-1';

        const mediaNode = (
          <div className={mediaSpan}>
            {renderImageContainer(block, block.imageUrl, block.imageCaption, false)}
          </div>
        );

        const textNode = (
          <div className={`${textSpan} flex flex-col justify-between`}>
            <div>
              {renderEditableText(
                block.text || '',
                (val) => onUpdateBlock(block.id, { text: val }),
                buildTextCss(block.textStyle, pageInk),
                'Write accompanying project analysis...',
                true
              )}
            </div>
            {!isExportMode && (
              <div className="pt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateBlock(block.id, {
                      splitDirection: isImageLeft ? 'image-right' : 'image-left',
                    });
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-stone-200/60 hover:bg-stone-300/70 text-stone-700 transition-colors"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Flip Image/Text Side</span>
                </button>
              </div>
            )}
          </div>
        );

        return (
          <div className={`grid ${gridCols} gap-7 items-start`}>
            {isImageLeft ? (
              <>
                {mediaNode}
                {textNode}
              </>
            ) : (
              <>
                {textNode}
                {mediaNode}
              </>
            )}
          </div>
        );
      }

      case 'dual-image':
        return (
          <div className="grid grid-cols-2 gap-6 items-start">
            {renderImageContainer(block, block.imageUrl, block.imageCaption, false)}
            {renderImageContainer(
              block,
              block.secondaryImageUrl || CURATED_VISUAL_PLATES[2].url,
              block.secondaryImageCaption,
              true
            )}
          </div>
        );

      case 'two-column-text':
        return (
          <div className="grid grid-cols-2 gap-8 items-start">
            <div>
              {renderEditableText(
                block.text || '',
                (val) => onUpdateBlock(block.id, { text: val }),
                buildTextCss(block.textStyle, pageInk),
                'Left column narrative prose...',
                true
              )}
            </div>
            <div>
              {renderEditableText(
                block.secondaryText || '',
                (val) => onUpdateBlock(block.id, { secondaryText: val }),
                buildTextCss(block.textStyle, pageInk),
                'Right column narrative prose...',
                true
              )}
            </div>
          </div>
        );

      case 'pull-quote':
        return (
          <div
            style={{ borderColor: borderCol }}
            className="py-4 border-t border-b flex flex-col gap-2"
          >
            {renderEditableText(
              block.text || '',
              (val) => onUpdateBlock(block.id, { text: val }),
              buildTextCss(block.textStyle, pageInk),
              '“Enter architectural pull quote or thesis statement...”',
              true
            )}
            {(block.kicker !== undefined || !isExportMode) && (
              <div>
                {renderEditableText(
                  block.kicker || '',
                  (val) => onUpdateBlock(block.id, { kicker: val }),
                  {
                    fontFamily: globalSettings.monoFont,
                    fontSize: '10.5px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    color: mutedInk,
                  },
                  '— ATTRIBUTION / SOURCE',
                  false
                )}
              </div>
            )}
          </div>
        );

      case 'spec-grid': {
        const specs: SpecItem[] = block.specs || [];
        const updateSpec = (idx: number, patch: Partial<SpecItem>) => {
          const next = specs.map((item, i) => (i === idx ? { ...item, ...patch } : item));
          onUpdateBlock(block.id, { specs: next });
        };
        const addSpec = () => {
          onUpdateBlock(block.id, {
            specs: [
              ...specs,
              { id: `sp-${Date.now()}`, label: 'SPECIFICATION', value: 'Detail Value' },
            ],
          });
        };
        const removeSpec = (idx: number) => {
          onUpdateBlock(block.id, {
            specs: specs.filter((_, i) => i !== idx),
          });
        };

        return (
          <div style={{ borderColor: borderCol }} className="border-t pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
              {specs.map((spec, idx) => (
                <div key={spec.id} className="group/spec relative flex flex-col gap-0.5">
                  {renderEditableText(
                    spec.label,
                    (val) => updateSpec(idx, { label: val }),
                    {
                      fontFamily: globalSettings.monoFont,
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.09em',
                      textTransform: 'uppercase',
                      color: mutedInk,
                    },
                    'LABEL',
                    false
                  )}
                  {renderEditableText(
                    spec.value,
                    (val) => updateSpec(idx, { value: val }),
                    {
                      fontFamily: block.textStyle.fontFamily || globalSettings.bodyFont,
                      fontSize: `${block.textStyle.fontSize || 12.5}px`,
                      fontWeight: 500,
                      color: pageInk,
                      lineHeight: 1.4,
                    },
                    'Value',
                    false
                  )}
                  {!isExportMode && specs.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSpec(idx);
                      }}
                      title="Remove Spec Field"
                      className="opacity-0 group-hover/spec:opacity-100 absolute -top-1 right-0 text-stone-400 hover:text-red-600 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {!isExportMode && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addSpec();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-900"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Metadata Cell</span>
                </button>
              </div>
            )}
          </div>
        );
      }

      case 'divider':
        return (
          <div
            style={{ height: `${block.spacingHeight || 24}px` }}
            className="w-full flex items-center"
          >
            {block.showLine !== false && (
              <div style={{ backgroundColor: borderCol }} className="w-full h-[1px]" />
            )}
          </div>
        );
    }
  };

  const formattedPageNum = formatPageNumber(
    pageIndex,
    totalPages,
    globalSettings.pageNumberStyle
  );

  return (
    <div
      style={{
        width: `${sizeSpec.widthPx * scale}px`,
        height: `${sizeSpec.heightPx * scale}px`,
      }}
      className="relative shrink-0 select-text"
    >
      {/* Hidden File Input for Image Uploads */}
      {!isExportMode && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      {/* Actual Page Surface */}
      <div
        onClick={() => {
          if (!isExportMode) onSelectBlock(null);
        }}
        style={{
          width: `${sizeSpec.widthPx}px`,
          height: `${sizeSpec.heightPx}px`,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
          backgroundColor: pageBg,
          color: pageInk,
          padding: `${globalSettings.pageMargin}px`,
        }}
        className={`relative flex flex-col justify-between overflow-hidden transition-colors duration-200 ${
          isExportMode
            ? ''
            : 'shadow-[0_12px_40px_rgba(0,0,0,0.09)] ring-1 ring-stone-900/10'
        }`}
      >
        {/* Top Running Header */}
        {globalSettings.showRunningHeader && !page.hideHeader ? (
          <header
            style={{
              borderColor: borderCol,
              fontFamily: globalSettings.monoFont,
              color: mutedInk,
            }}
            className="pb-3.5 mb-6 border-b flex items-center justify-between text-[10px] tracking-[0.12em] uppercase shrink-0"
          >
            <span>{globalSettings.headerLeftText || globalSettings.portfolioTitle}</span>
            <span>{page.sectionLabel || globalSettings.headerRightText}</span>
          </header>
        ) : (
          <div className="shrink-0" />
        )}

        {/* Main Page Content Blocks */}
        <div className="flex-1 flex flex-col justify-between gap-6 min-h-0">
          <div className="flex flex-col gap-6">
            {page.blocks.map((block, bIdx) => {
              const isSelected = !isExportMode && selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onClick={(e) => {
                    if (!isExportMode) {
                      e.stopPropagation();
                      onSelectBlock(block.id);
                    }
                  }}
                  className={`relative group/block transition-all ${
                    isExportMode
                      ? ''
                      : isSelected
                      ? 'ring-1 ring-blue-600/80 bg-blue-500/[0.02] rounded-sm -m-2 p-2'
                      : 'hover:ring-1 hover:ring-stone-400/50 rounded-sm -m-2 p-2'
                  }`}
                >
                  {/* Floating Block Action Bar when selected or hovered */}
                  {!isExportMode && (
                    <div
                      className={`absolute -top-3.5 right-1 z-20 flex items-center gap-0.5 bg-stone-900 text-white px-1.5 py-0.5 rounded shadow-sm text-[10px] transition-opacity ${
                        isSelected
                          ? 'opacity-100'
                          : 'opacity-0 group-hover/block:opacity-100'
                      }`}
                    >
                      <span className="px-1.5 text-stone-400 uppercase tracking-wider font-mono text-[9px]">
                        {block.type}
                      </span>
                      <button
                        type="button"
                        disabled={bIdx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveBlock(block.id, 'up');
                        }}
                        title="Move Block Up"
                        className="p-1 hover:text-amber-300 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={bIdx === page.blocks.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveBlock(block.id, 'down');
                        }}
                        title="Move Block Down"
                        className="p-1 hover:text-amber-300 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateBlock(block.id);
                        }}
                        title="Duplicate Block"
                        className="p-1 hover:text-amber-300"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBlock(block.id);
                        }}
                        title="Delete Block"
                        className="p-1 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {renderBlockContent(block)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Running Footer */}
        {globalSettings.showRunningFooter && !page.hideFooter ? (
          <footer
            style={{
              borderColor: borderCol,
              fontFamily: globalSettings.monoFont,
              color: mutedInk,
            }}
            className="pt-3.5 mt-6 border-t flex items-center justify-between text-[10px] tracking-[0.1em] uppercase shrink-0 tabular-nums"
          >
            <span>
              {globalSettings.footerLeftText ||
                `${globalSettings.authorName} · ${globalSettings.issueYear}`}
            </span>
            {formattedPageNum && <span className="font-medium">{formattedPageNum}</span>}
          </footer>
        ) : (
          <div className="shrink-0" />
        )}
      </div>
    </div>
  );
};
