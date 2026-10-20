import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  CheckCircle2,
  Copy,
  ExternalLink,
  ImagePlus,
  Laptop,
  Palette,
  Plus,
  QrCode,
  Quote,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  Trash2,
  Upload,
} from 'lucide-react';
import { CURATED_VISUAL_PLATES, PAGE_SIZE_PRESETS, createUid } from '../data/editorialAssets';
import {
  ColorSwatch,
  DeviceMockupType,
  GlobalDocumentSettings,
  GridImageItem,
  ImageFilterType,
  PortfolioBlock,
  PortfolioPage,
  ProcessStepItem,
  ServiceOfferItem,
  SpecItem,
  TextStyle,
  TextTargetField,
} from '../types/portfolio';
import { MockupFrame } from './MockupFrames';

const QrCodeDisplay: React.FC<{ url: string; size?: number; inkColor: string }> = ({
  url,
  size = 110,
  inkColor,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url || 'https://github.com', {
      margin: 1,
      width: size * 2,
      color: {
        dark: inkColor || '#111111',
        light: '#00000000',
      },
    })
      .then(setDataUrl)
      .catch(() => {});
  }, [url, size, inkColor]);

  if (!dataUrl) {
    return <div style={{ width: size, height: size }} className="bg-stone-200/50 animate-pulse rounded" />;
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      style={{ width: `${size}px`, height: `${size}px` }}
      className="block"
    />
  );
};

interface PageCanvasProps {
  page: PortfolioPage;
  pageIndex: number;
  totalPages: number;
  globalSettings: GlobalDocumentSettings;
  selectedBlockId: string | null;
  activeTextTarget?: TextTargetField;
  onSelectTextTarget?: (target: TextTargetField) => void;
  onSelectBlock: (blockId: string | null) => void;
  onUpdateBlock: (blockId: string, patch: Partial<PortfolioBlock>) => void;
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  onDuplicateBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onInsertDroppedImages?: (imageUrls: string[]) => void;
  isExportMode?: boolean;
  scale?: number;
  showBleedGuides?: boolean;
  showColumnGrid?: boolean;
  allPages?: PortfolioPage[];
  onNavigatePage?: (pageId: string) => void;
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
  activeTextTarget = 'primary',
  onSelectTextTarget,
  onSelectBlock,
  onUpdateBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onInsertDroppedImages,
  isExportMode = false,
  scale = 1,
  showBleedGuides = false,
  showColumnGrid = false,
  allPages,
  onNavigatePage,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCanvasDragOver, setIsCanvasDragOver] = useState(false);
  const uploadTargetRef = useRef<{
    blockId: string;
    field: 'imageUrl' | 'secondaryImageUrl' | 'beforeImageUrl' | 'afterImageUrl' | 'gridImage';
    gridIndex?: number;
  } | null>(null);

  const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isExportMode) return;
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      e.preventDefault();
      setIsCanvasDragOver(true);
    }
  };

  const handleCanvasDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (isExportMode) return;
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsCanvasDragOver(false);
  };

  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isExportMode) return;
    e.preventDefault();
    setIsCanvasDragOver(false);
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const promises = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises).then((urls) => {
      if (urls.length > 0 && onInsertDroppedImages) {
        onInsertDroppedImages(urls);
      }
    });
  };

  const activePageSizeId = page.pageSizeOverride || globalSettings.pageSize;
  const sizeSpec =
    PAGE_SIZE_PRESETS.find((s) => s.id === activePageSizeId) || PAGE_SIZE_PRESETS[0];

  const pageBg = page.backgroundColor || globalSettings.backgroundColor;
  const pageInk = page.textColor || globalSettings.textColor;
  const mutedInk = globalSettings.mutedTextColor;
  const borderCol = globalSettings.borderColor;
  const accentCol = globalSettings.accentColor;

  const triggerImageUpload = (
    blockId: string,
    field: 'imageUrl' | 'secondaryImageUrl' | 'beforeImageUrl' | 'afterImageUrl' | 'gridImage' = 'imageUrl',
    gridIndex?: number
  ) => {
    uploadTargetRef.current = { blockId, field, gridIndex };
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
      const pageBlocks = page?.blocks || [];
      const targetBlock = pageBlocks.find((b) => b.id === target.blockId);

      if (target.field === 'secondaryImageUrl') {
        onUpdateBlock(target.blockId, { secondaryImageUrl: dataUrl });
      } else if (target.field === 'beforeImageUrl') {
        onUpdateBlock(target.blockId, { beforeImageUrl: dataUrl, imageUrl: dataUrl });
      } else if (target.field === 'afterImageUrl') {
        onUpdateBlock(target.blockId, { afterImageUrl: dataUrl, secondaryImageUrl: dataUrl });
      } else if (target.field === 'gridImage' && typeof target.gridIndex === 'number' && targetBlock) {
        const currentGrid: GridImageItem[] = targetBlock.gridImages || [
          { id: 'img-1', url: CURATED_VISUAL_PLATES[1].url, caption: 'Detail A — Raw Stone Texture' },
          { id: 'img-2', url: CURATED_VISUAL_PLATES[2].url, caption: 'Detail B — Anodized Bevel' },
          { id: 'img-3', url: CURATED_VISUAL_PLATES[3].url, caption: 'Detail C — Axonometric Joinery' },
        ];
        const updatedGrid = currentGrid.map((item, idx) =>
          idx === target.gridIndex ? { ...item, url: dataUrl } : item
        );
        onUpdateBlock(target.blockId, { gridImages: updatedGrid });
      } else {
        onUpdateBlock(target.blockId, { imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDropFile = (
    e: React.DragEvent<HTMLDivElement>,
    blockId: string,
    field: 'imageUrl' | 'secondaryImageUrl' | 'beforeImageUrl' | 'afterImageUrl' | 'gridImage' = 'imageUrl',
    gridIndex?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const pageBlocks = page?.blocks || [];
      const targetBlock = pageBlocks.find((b) => b.id === blockId);

      if (field === 'secondaryImageUrl') {
        onUpdateBlock(blockId, { secondaryImageUrl: dataUrl });
      } else if (field === 'beforeImageUrl') {
        onUpdateBlock(blockId, { beforeImageUrl: dataUrl, imageUrl: dataUrl });
      } else if (field === 'afterImageUrl') {
        onUpdateBlock(blockId, { afterImageUrl: dataUrl, secondaryImageUrl: dataUrl });
      } else if (field === 'gridImage' && typeof gridIndex === 'number' && targetBlock) {
        const currentGrid: GridImageItem[] = targetBlock.gridImages || [
          { id: 'img-1', url: CURATED_VISUAL_PLATES[1].url, caption: 'Detail A — Raw Stone Texture' },
          { id: 'img-2', url: CURATED_VISUAL_PLATES[2].url, caption: 'Detail B — Anodized Bevel' },
          { id: 'img-3', url: CURATED_VISUAL_PLATES[3].url, caption: 'Detail C — Axonometric Joinery' },
        ];
        const updatedGrid = currentGrid.map((item, idx) =>
          idx === gridIndex ? { ...item, url: dataUrl } : item
        );
        onUpdateBlock(blockId, { gridImages: updatedGrid });
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

  const buildTextCss = (style?: Partial<TextStyle>, fallbackColor = pageInk): React.CSSProperties => {
    if (!style) {
      return {
        fontFamily: globalSettings.bodyFont || "'Plus Jakarta Sans', sans-serif",
        fontSize: '14px',
        fontWeight: 400,
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'left',
        lineHeight: 1.5,
        letterSpacing: 0,
        textTransform: 'none',
        color: fallbackColor,
      };
    }
    return {
      fontFamily: style.fontFamily || globalSettings.bodyFont || "'Plus Jakarta Sans', sans-serif",
      fontSize: `${style.fontSize || 14}px`,
      fontWeight: style.fontWeight || 400,
      fontStyle: style.fontStyle || 'normal',
      textDecoration: style.textDecoration || 'none',
      textAlign: style.textAlign || 'left',
      lineHeight: style.lineHeight || 1.5,
      letterSpacing: `${style.letterSpacing || 0}em`,
      textTransform: style.textTransform || 'none',
      color: style.color || fallbackColor,
    };
  };

  const renderEditableText = (
    value: string,
    onChange: (val: string) => void,
    style: React.CSSProperties,
    placeholder: string,
    multiline = true,
    onFocus?: () => void
  ) => {
    if (isExportMode) {
      return (
        <div style={style} className="w-full whitespace-pre-wrap break-words">
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
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...style, width: '100%', textAlign: style.textAlign || 'inherit' }}
          className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-0 m-0"
        />
      );
    }

    return (
      <div className="relative w-full">
        {/* Mirror div determines exact natural height so textarea never clips or scrolls */}
        <div
          aria-hidden="true"
          style={{ ...style, width: '100%', textAlign: style.textAlign || 'inherit' }}
          className="whitespace-pre-wrap break-words invisible pointer-events-none min-h-[1.4em] w-full"
        >
          {value ? `${value}\n` : placeholder}
        </div>
        <textarea
          dir="ltr"
          value={value}
          placeholder={placeholder}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...style, width: '100%', textAlign: style.textAlign || 'inherit' }}
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
          onDrop={(e) => handleDropFile(e, block.id, isSecondary ? 'secondaryImageUrl' : 'imageUrl')}
          style={{
            height:
              imgStyle.aspectRatio && imgStyle.aspectRatio !== 'auto'
                ? undefined
                : `${imgStyle.height}px`,
            aspectRatio:
              imgStyle.aspectRatio && imgStyle.aspectRatio !== 'auto'
                ? imgStyle.aspectRatio.replace('/', ' / ')
                : undefined,
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
                objectPosition: imgStyle.focalPoint || 'center',
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
                  triggerImageUpload(block.id, isSecondary ? 'secondaryImageUrl' : 'imageUrl');
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
                textAlign: block.textStyle?.textAlign || 'left',
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
      case 'heading': {
        const isBlockSelected = !isExportMode && selectedBlockId === block.id;

        const blockAlign = block.textStyle?.textAlign || 'left';
        const subtitleAlign = block.secondaryTextStyle?.textAlign || blockAlign;
        const kickerAlign = block.kickerTextStyle?.textAlign || blockAlign;

        const kickerStyle = buildTextCss(
          {
            ...block.kickerTextStyle,
            textAlign: kickerAlign,
          },
          accentCol
        );

        const headlineStyle = buildTextCss(
          {
            ...block.textStyle,
            textAlign: blockAlign,
          },
          pageInk
        );

        const subtitleStyle = buildTextCss(
          {
            ...block.secondaryTextStyle,
            textAlign: subtitleAlign,
          },
          mutedInk
        );

        return (
          <div className="flex flex-col gap-2 w-full">
            {(block.kicker !== undefined || !isExportMode) &&
              (!isExportMode || (block.kicker && block.kicker.trim().length > 0)) && (
                <div
                  onClick={(e) => {
                    if (!isExportMode) {
                      e.stopPropagation();
                      onSelectBlock(block.id);
                      onSelectTextTarget?.('kicker');
                    }
                  }}
                  className={`w-full transition-all rounded-xs ${
                    kickerAlign === 'center'
                      ? 'text-center'
                      : kickerAlign === 'right'
                      ? 'text-right'
                      : 'text-left'
                  } ${
                    isBlockSelected && activeTextTarget === 'kicker'
                      ? 'ring-1 ring-blue-500/70 bg-blue-500/[0.03] p-0.5 -m-0.5'
                      : ''
                  }`}
                >
                  {renderEditableText(
                    block.kicker || '',
                    (val) => onUpdateBlock(block.id, { kicker: val }),
                    kickerStyle,
                    'SECTION KICKER / INDEX...',
                    false,
                    () => {
                      onSelectBlock(block.id);
                      onSelectTextTarget?.('kicker');
                    }
                  )}
                </div>
              )}

            <div
              onClick={(e) => {
                if (!isExportMode) {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('primary');
                }
              }}
              className={`w-full transition-all rounded-xs ${
                blockAlign === 'center'
                  ? 'text-center'
                  : blockAlign === 'right'
                  ? 'text-right'
                  : 'text-left'
              } ${
                isBlockSelected && activeTextTarget === 'primary'
                  ? 'ring-1 ring-blue-500/70 bg-blue-500/[0.03] p-0.5 -m-0.5'
                  : ''
              }`}
            >
              {renderEditableText(
                block.text || '',
                (val) => onUpdateBlock(block.id, { text: val }),
                headlineStyle,
                'Enter Headline Title...',
                true,
                () => {
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('primary');
                }
              )}
            </div>

            {(block.secondaryText !== undefined || !isExportMode) &&
              (!isExportMode || (block.secondaryText && block.secondaryText.trim().length > 0)) && (
                <div
                  onClick={(e) => {
                    if (!isExportMode) {
                      e.stopPropagation();
                      onSelectBlock(block.id);
                      onSelectTextTarget?.('secondary');
                    }
                  }}
                  className={`pt-0.5 w-full transition-all rounded-xs ${
                    subtitleAlign === 'center'
                      ? 'text-center'
                      : subtitleAlign === 'right'
                      ? 'text-right'
                      : 'text-left'
                  } ${
                    isBlockSelected && activeTextTarget === 'secondary'
                      ? 'ring-1 ring-blue-500/70 bg-blue-500/[0.03] p-0.5 -m-0.5'
                      : ''
                  }`}
                >
                  {renderEditableText(
                    block.secondaryText || '',
                    (val) => onUpdateBlock(block.id, { secondaryText: val }),
                    subtitleStyle,
                    'Optional lead subtitle or project location...',
                    true,
                    () => {
                      onSelectBlock(block.id);
                      onSelectTextTarget?.('secondary');
                    }
                  )}
                </div>
              )}
          </div>
        );
      }

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

      case 'two-column-text': {
        const isBlockSelected = !isExportMode && selectedBlockId === block.id;
        const col2Style = buildTextCss(block.secondaryTextStyle || block.textStyle, pageInk);

        return (
          <div className="grid grid-cols-2 gap-8 items-start w-full">
            <div
              onClick={(e) => {
                if (!isExportMode) {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('primary');
                }
              }}
              className={`transition-all rounded-xs ${
                isBlockSelected && activeTextTarget === 'primary'
                  ? 'ring-1 ring-blue-500/70 bg-blue-500/[0.03] p-0.5 -m-0.5'
                  : ''
              }`}
            >
              {renderEditableText(
                block.text || '',
                (val) => onUpdateBlock(block.id, { text: val }),
                buildTextCss(block.textStyle, pageInk),
                'Left column narrative prose...',
                true,
                () => {
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('primary');
                }
              )}
            </div>
            <div
              onClick={(e) => {
                if (!isExportMode) {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('secondary');
                }
              }}
              className={`transition-all rounded-xs ${
                isBlockSelected && activeTextTarget === 'secondary'
                  ? 'ring-1 ring-blue-500/70 bg-blue-500/[0.03] p-0.5 -m-0.5'
                  : ''
              }`}
            >
              {renderEditableText(
                block.secondaryText || '',
                (val) => onUpdateBlock(block.id, { secondaryText: val }),
                col2Style,
                'Right column narrative prose...',
                true,
                () => {
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('secondary');
                }
              )}
            </div>
          </div>
        );
      }

      case 'pull-quote': {
        const isBlockSelected = !isExportMode && selectedBlockId === block.id;
        const kickerStyle = buildTextCss(
          block.kickerTextStyle || {
            fontFamily: globalSettings.monoFont,
            fontSize: 10.5,
            fontWeight: 500,
            fontStyle: 'normal',
            textDecoration: 'none',
            letterSpacing: 0.1,
            textTransform: 'uppercase',
            color: mutedInk,
            lineHeight: 1.4,
            textAlign: block.textStyle?.textAlign || 'left',
          },
          mutedInk
        );

        return (
          <div
            style={{ borderColor: borderCol }}
            className="py-4 border-t border-b flex flex-col gap-2"
          >
            <div
              onClick={(e) => {
                if (!isExportMode) {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('primary');
                }
              }}
              className={`transition-all rounded-xs ${
                isBlockSelected && activeTextTarget === 'primary'
                  ? 'ring-1 ring-blue-500/70 bg-blue-500/[0.03] p-0.5 -m-0.5'
                  : ''
              }`}
            >
              {renderEditableText(
                block.text || '',
                (val) => onUpdateBlock(block.id, { text: val }),
                buildTextCss(block.textStyle, pageInk),
                '“Enter architectural pull quote or thesis statement...”',
                true,
                () => {
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('primary');
                }
              )}
            </div>
            {(block.kicker !== undefined || !isExportMode) && (
              <div
                onClick={(e) => {
                  if (!isExportMode) {
                    e.stopPropagation();
                    onSelectBlock(block.id);
                    onSelectTextTarget?.('kicker');
                  }
                }}
                className={`transition-all rounded-xs ${
                  isBlockSelected && activeTextTarget === 'kicker'
                    ? 'ring-1 ring-blue-500/70 bg-blue-500/[0.03] p-0.5 -m-0.5'
                    : ''
                }`}
              >
                {renderEditableText(
                  block.kicker || '',
                  (val) => onUpdateBlock(block.id, { kicker: val }),
                  kickerStyle,
                  '— ATTRIBUTION / SOURCE',
                  false,
                  () => {
                    onSelectBlock(block.id);
                    onSelectTextTarget?.('kicker');
                  }
                )}
              </div>
            )}
          </div>
        );
      }

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
                      fontFamily: block.textStyle?.fontFamily || globalSettings.bodyFont,
                      fontSize: `${block.textStyle?.fontSize || 12.5}px`,
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

      case 'device-mockup': {
        const deviceType = block.deviceType || 'macbook';
        return (
          <div className="flex flex-col items-center gap-3 w-full">
            {!isExportMode && (
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateBlock(block.id, { deviceType: 'macbook' });
                  }}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium ${
                    deviceType === 'macbook' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>MacBook</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateBlock(block.id, { deviceType: 'iphone' });
                  }}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium ${
                    deviceType === 'iphone' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>iPhone</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateBlock(block.id, { deviceType: 'ipad' });
                  }}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium ${
                    deviceType === 'ipad' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>iPad</span>
                </button>
                <span className="text-stone-300">|</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerImageUpload(block.id);
                  }}
                  className="px-2 py-1 rounded bg-stone-900 text-white flex items-center gap-1 text-[11px]"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Screen</span>
                </button>
              </div>
            )}

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropFile(e, block.id, 'imageUrl')}
              className="w-full flex justify-center cursor-pointer"
            >
              <MockupFrame
                deviceType={deviceType}
                imageUrl={block.imageUrl}
                zoom={block.imageStyle?.zoom}
                filter={block.imageStyle?.filter}
                caption={block.imageCaption}
              />
            </div>

            {(block.imageCaption !== undefined || !isExportMode) && (
              <div className="w-full text-center max-w-lg">
                {renderEditableText(
                  block.imageCaption || '',
                  (val) => onUpdateBlock(block.id, { imageCaption: val }),
                  {
                    fontFamily: globalSettings.monoFont,
                    fontSize: '11px',
                    fontWeight: 400,
                    color: mutedInk,
                    textAlign: 'center',
                  },
                  'Fig. — Live digital interface mockup caption...',
                  false
                )}
              </div>
            )}
          </div>
        );
      }

      case 'color-palette': {
        const swatches: ColorSwatch[] = block.swatches || [
          { id: 'sw-1', hex: '#161514', name: 'Obsidian Ink', code: 'Base Text' },
          { id: 'sw-2', hex: '#FAF8F5', name: 'Cotton Archival', code: 'Canvas Surface' },
          { id: 'sw-3', hex: '#9A3412', name: 'Terracotta Ochre', code: 'Primary Focal' },
          { id: 'sw-4', hex: '#D5CCBC', name: 'Honed Travertine', code: 'Material Tint' },
          { id: 'sw-5', hex: '#2D373C', name: 'Deep Basalt', code: 'Structure' },
        ];

        const updateSwatch = (idx: number, patch: Partial<ColorSwatch>) => {
          const next = swatches.map((s, i) => (i === idx ? { ...s, ...patch } : s));
          onUpdateBlock(block.id, { swatches: next });
        };

        const addSwatch = () => {
          onUpdateBlock(block.id, {
            swatches: [
              ...swatches,
              { id: `sw-${Date.now()}`, hex: '#0F766E', name: 'New Color', code: 'Accent' },
            ],
          });
        };

        const removeSwatch = (idx: number) => {
          onUpdateBlock(block.id, {
            swatches: swatches.filter((_, i) => i !== idx),
          });
        };

        return (
          <div style={{ borderColor: borderCol }} className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span
                style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}
                className="text-[10px] tracking-widest uppercase"
              >
                PROJECT MATERIALITY & COLOR PALETTE
              </span>
              {!isExportMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addSwatch();
                  }}
                  className="text-[11px] font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Swatch</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {swatches.map((swatch, idx) => (
                <div
                  key={swatch.id}
                  className="group/swatch relative flex flex-col gap-1.5 p-2 rounded-lg bg-stone-50/60 border border-stone-200/80"
                >
                  <div
                    style={{ backgroundColor: swatch.hex }}
                    className="relative w-full h-16 rounded-md shadow-inner border border-black/10 flex items-end justify-start p-1.5 overflow-hidden"
                  >
                    {!isExportMode && (
                      <input
                        type="color"
                        value={swatch.hex}
                        onChange={(e) => updateSwatch(idx, { hex: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="Click to change color"
                      />
                    )}
                  </div>

                  <span
                    style={{ fontFamily: globalSettings.monoFont }}
                    className="text-[11px] font-mono font-semibold text-stone-800 uppercase"
                  >
                    {swatch.hex}
                  </span>

                  {renderEditableText(
                    swatch.name,
                    (val) => updateSwatch(idx, { name: val }),
                    {
                      fontFamily: globalSettings.bodyFont,
                      fontSize: '11px',
                      fontWeight: 500,
                      color: pageInk,
                      lineHeight: 1.3,
                    },
                    'Color Name',
                    false
                  )}

                  {renderEditableText(
                    swatch.code || '',
                    (val) => updateSwatch(idx, { code: val }),
                    {
                      fontFamily: globalSettings.monoFont,
                      fontSize: '9.5px',
                      color: mutedInk,
                      lineHeight: 1.3,
                    },
                    'Role / Material',
                    false
                  )}

                  {!isExportMode && swatches.length > 2 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSwatch(idx);
                      }}
                      className="absolute top-1 right-1 opacity-0 group-hover/swatch:opacity-100 p-1 text-stone-400 hover:text-red-600 transition-opacity"
                      title="Remove Swatch"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'before-after': {
        const beforeImg = block.beforeImageUrl || block.imageUrl || CURATED_VISUAL_PLATES[1].url;
        const afterImg =
          block.afterImageUrl || block.secondaryImageUrl || CURATED_VISUAL_PLATES[0].url;

        return (
          <div className="space-y-3 w-full">
            <div className="grid grid-cols-2 gap-5 items-start">
              {/* Left: Before Plate */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    style={{ fontFamily: globalSettings.monoFont, color: accentCol }}
                    className="text-[10px] tracking-widest uppercase font-semibold"
                  >
                    {block.beforeLabel || 'BEFORE RECONSTRUCTION'}
                  </span>
                  {!isExportMode && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerImageUpload(block.id, 'beforeImageUrl');
                        }}
                        className="text-[10px] text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors font-medium"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIdx = CURATED_VISUAL_PLATES.findIndex((p) => p.url === beforeImg);
                          const nextPlate = CURATED_VISUAL_PLATES[(currentIdx + 1) % CURATED_VISUAL_PLATES.length];
                          onUpdateBlock(block.id, { beforeImageUrl: nextPlate.url, imageUrl: nextPlate.url });
                        }}
                        className="text-[10px] text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        title="Swap Curated Plate"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Swap</span>
                      </button>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    height: `${block.imageStyle?.height || 280}px`,
                    borderRadius: `${block.imageStyle?.borderRadius || 0}px`,
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropFile(e, block.id, 'beforeImageUrl')}
                  className="w-full overflow-hidden bg-stone-200/50 relative shadow-inner group/beforeimg rounded-sm"
                >
                  <img
                    src={beforeImg}
                    alt="Before"
                    className="w-full h-full object-cover"
                    style={{ filter: getFilterCss(block.imageStyle?.filter) }}
                  />
                  {!isExportMode && (
                    <div
                      onClick={() => triggerImageUpload(block.id, 'beforeImageUrl')}
                      className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover/beforeimg:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <span className="bg-stone-900/90 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow flex items-center gap-1.5">
                        <Upload className="w-3 h-3" />
                        <span>Change Before Photo</span>
                      </span>
                    </div>
                  )}
                </div>
                {renderEditableText(
                  block.beforeCaption || '',
                  (val) => onUpdateBlock(block.id, { beforeCaption: val }),
                  {
                    fontFamily: globalSettings.monoFont,
                    fontSize: '10.5px',
                    color: mutedInk,
                  },
                  'Add before state notes or date...',
                  false
                )}
              </div>

              {/* Right: After Plate */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    style={{ fontFamily: globalSettings.monoFont, color: accentCol }}
                    className="text-[10px] tracking-widest uppercase font-semibold"
                  >
                    {block.afterLabel || 'FINAL ARCHITECTURAL COMPLETION'}
                  </span>
                  {!isExportMode && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerImageUpload(block.id, 'afterImageUrl');
                        }}
                        className="text-[10px] text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors font-medium"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIdx = CURATED_VISUAL_PLATES.findIndex((p) => p.url === afterImg);
                          const nextPlate = CURATED_VISUAL_PLATES[(currentIdx + 1) % CURATED_VISUAL_PLATES.length];
                          onUpdateBlock(block.id, { afterImageUrl: nextPlate.url, secondaryImageUrl: nextPlate.url });
                        }}
                        className="text-[10px] text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        title="Swap Curated Plate"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Swap</span>
                      </button>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    height: `${block.imageStyle?.height || 280}px`,
                    borderRadius: `${block.imageStyle?.borderRadius || 0}px`,
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropFile(e, block.id, 'afterImageUrl')}
                  className="w-full overflow-hidden bg-stone-200/50 relative shadow-inner group/afterimg rounded-sm"
                >
                  <img
                    src={afterImg}
                    alt="After"
                    className="w-full h-full object-cover"
                    style={{ filter: getFilterCss(block.imageStyle?.filter) }}
                  />
                  {!isExportMode && (
                    <div
                      onClick={() => triggerImageUpload(block.id, 'afterImageUrl')}
                      className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover/afterimg:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <span className="bg-stone-900/90 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow flex items-center gap-1.5">
                        <Upload className="w-3 h-3" />
                        <span>Change After Photo</span>
                      </span>
                    </div>
                  )}
                </div>
                {renderEditableText(
                  block.afterCaption || '',
                  (val) => onUpdateBlock(block.id, { afterCaption: val }),
                  {
                    fontFamily: globalSettings.monoFont,
                    fontSize: '10.5px',
                    color: mutedInk,
                  },
                  'Add completed realization details...',
                  false
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'qr-code': {
        const targetUrl = block.qrUrl || 'https://peymanjalili1997.github.io/foliopress/';

        return (
          <div
            style={{ borderColor: borderCol, backgroundColor: `${pageInk}06` }}
            className="p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex flex-col gap-1.5 text-left max-w-md">
              <span
                style={{ fontFamily: globalSettings.monoFont, color: accentCol }}
                className="text-[10px] font-semibold tracking-widest uppercase"
              >
                INTERACTIVE CLIENT DISCOVERY
              </span>
              <div className="text-base font-semibold text-stone-950">
                {renderEditableText(
                  block.qrTitle || 'Scan to Experience Full Digital Portfolio & Case Studies',
                  (val) => onUpdateBlock(block.id, { qrTitle: val }),
                  {
                    fontFamily: globalSettings.headingFont,
                    fontSize: '18px',
                    fontWeight: 600,
                    color: pageInk,
                    lineHeight: 1.25,
                  },
                  'Enter QR Code Headline...',
                  false
                )}
              </div>
              <div className="text-xs text-stone-600">
                {renderEditableText(
                  block.qrSubtitle ||
                    'Scan with any smartphone camera to view live responsive prototype, video showreels, and verified client testimonials.',
                  (val) => onUpdateBlock(block.id, { qrSubtitle: val }),
                  {
                    fontFamily: globalSettings.bodyFont,
                    fontSize: '12px',
                    color: mutedInk,
                    lineHeight: 1.5,
                  },
                  'Enter description text...',
                  true
                )}
              </div>

              {!isExportMode && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-stone-400">Target URL:</span>
                  <input
                    type="url"
                    dir="ltr"
                    value={targetUrl}
                    onChange={(e) => onUpdateBlock(block.id, { qrUrl: e.target.value })}
                    placeholder="https://..."
                    className="h-7 px-2 text-xs font-mono bg-white border border-stone-200 rounded text-stone-900 focus:outline-none focus:border-stone-900 min-w-[220px]"
                  />
                </div>
              )}
            </div>

            <div className="p-3 bg-white rounded-lg shadow-sm border border-stone-200 flex flex-col items-center gap-1 shrink-0">
              <QrCodeDisplay url={targetUrl} size={114} inkColor={pageInk} />
              <span
                style={{ fontFamily: globalSettings.monoFont }}
                className="text-[9px] uppercase tracking-wider text-stone-500 pt-0.5 font-medium"
              >
                SCAN NOW
              </span>
            </div>
          </div>
        );
      }

      case 'project-meta': {
        const tools = block.toolsList || ['Figma', 'Blender 3D', 'Rhino 8', 'AutoCAD', 'React', 'Lightroom'];
        const updateTool = (idx: number, val: string) => {
          const next = [...tools];
          next[idx] = val;
          onUpdateBlock(block.id, { toolsList: next });
        };
        const addTool = () => {
          onUpdateBlock(block.id, { toolsList: [...tools, 'New Tool'] });
        };
        const removeTool = (idx: number) => {
          onUpdateBlock(block.id, { toolsList: tools.filter((_, i) => i !== idx) });
        };

        return (
          <div style={{ borderColor: borderCol }} className="border-t border-b py-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: globalSettings.monoFont, color: mutedInk }} className="text-[10px] tracking-wider uppercase font-medium">
                  SOFTWARE & EXECUTION STACK:
                </span>
              </div>
              {!isExportMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addTool();
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Tool</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {tools.map((tool, idx) => (
                <span
                  key={idx}
                  style={{
                    borderColor: borderCol,
                    fontFamily: globalSettings.monoFont,
                    color: pageInk,
                  }}
                  className="group/tool inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100/80 border rounded-full text-xs font-medium"
                >
                  {renderEditableText(
                    tool,
                    (val) => updateTool(idx, val),
                    {
                      fontSize: '11px',
                      fontFamily: globalSettings.monoFont,
                      color: pageInk,
                    },
                    'Tool',
                    false
                  )}
                  {!isExportMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTool(idx);
                      }}
                      className="opacity-0 group-hover/tool:opacity-100 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        );
      }

      case 'multi-photo-grid': {
        const gridItems: GridImageItem[] = block.gridImages || [
          { id: 'img-1', url: CURATED_VISUAL_PLATES[1].url, caption: 'Detail A — Raw Stone Texture' },
          { id: 'img-2', url: CURATED_VISUAL_PLATES[2].url, caption: 'Detail B — Anodized Bevel' },
          { id: 'img-3', url: CURATED_VISUAL_PLATES[3].url, caption: 'Detail C — Axonometric Joinery' },
        ];
        const columns = block.gridColumns || 3;
        const colClass = columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3';

        return (
          <div className="space-y-3 w-full">
            {/* Grid Controls (Columns & Add Photo) */}
            {!isExportMode && (
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}
                    className="text-[10px] tracking-wider uppercase font-semibold"
                  >
                    COLUMNS:
                  </span>
                  <div className="inline-flex rounded-md p-0.5 bg-stone-100 border border-stone-200/80">
                    {([2, 3, 4] as const).map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateBlock(block.id, { gridColumns: cols });
                        }}
                        className={`px-2 py-0.5 text-[11px] rounded transition-all ${
                          columns === cols
                            ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        {cols} Col
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextPlates = CURATED_VISUAL_PLATES;
                    const newPlate = nextPlates[(gridItems.length + 1) % nextPlates.length];
                    const newItem: GridImageItem = {
                      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                      url: newPlate.url,
                      caption: `Detail ${String.fromCharCode(65 + (gridItems.length % 26))} — New Detail`,
                    };
                    onUpdateBlock(block.id, { gridImages: [...gridItems, newItem] });
                  }}
                  className="text-[11px] font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo ({gridItems.length})</span>
                </button>
              </div>
            )}

            {/* Grid Photo Items */}
            <div className={`grid ${colClass} gap-4 w-full`}>
              {gridItems.map((item, idx) => (
                <div key={item.id || idx} className="flex flex-col gap-1.5 group/gridimg relative">
                  <div
                    style={{
                      height: `${block.imageStyle?.height || 210}px`,
                      borderRadius: `${block.imageStyle?.borderRadius || 0}px`,
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropFile(e, block.id, 'gridImage', idx)}
                    className="w-full overflow-hidden bg-stone-200/50 shadow-inner relative rounded-sm"
                  >
                    <img
                      src={item.url}
                      alt={item.caption || `Detail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      style={{ filter: getFilterCss(block.imageStyle?.filter) }}
                    />

                    {!isExportMode && (
                      <div className="absolute inset-0 bg-stone-950/45 opacity-0 group-hover/gridimg:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerImageUpload(block.id, 'gridImage', idx);
                          }}
                          className="px-2 py-1 bg-white text-stone-900 text-[10px] font-medium rounded shadow flex items-center gap-1 hover:bg-stone-100 transition-colors"
                          title="Upload Custom Photo from Computer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextPlates = CURATED_VISUAL_PLATES;
                            const nextItem = nextPlates[(idx + 2) % nextPlates.length];
                            const nextGrid = gridItems.map((it, i) =>
                              i === idx ? { ...it, url: nextItem.url } : it
                            );
                            onUpdateBlock(block.id, { gridImages: nextGrid });
                          }}
                          className="px-2 py-1 bg-stone-900 text-white text-[10px] font-medium rounded shadow flex items-center gap-1 hover:bg-stone-800 transition-colors"
                          title="Cycle Curated Architectural Plate"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Swap</span>
                        </button>
                        {gridItems.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextGrid = gridItems.filter((_, i) => i !== idx);
                              onUpdateBlock(block.id, { gridImages: nextGrid });
                            }}
                            className="p-1 bg-red-600 text-white text-[10px] rounded shadow hover:bg-red-700 transition-colors"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {renderEditableText(
                    item.caption || '',
                    (val) => {
                      const nextGrid = gridItems.map((it, i) =>
                        i === idx ? { ...it, caption: val } : it
                      );
                      onUpdateBlock(block.id, { gridImages: nextGrid });
                    },
                    {
                      fontFamily: globalSettings.monoFont,
                      fontSize: '10px',
                      color: mutedInk,
                    },
                    'Detail caption...',
                    false
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'client-testimonial': {
        const rating = block.clientRating || 5;
        const name = block.clientName || 'Dr. Elena Rostova';
        const role = block.clientRole || 'Executive Director & Board Trustee';
        const company = block.clientCompany || 'Vanguard Cultural Trust';
        const quoteText =
          block.text ||
          '"The project exceeded our expectations in acoustic performance and heritage sensitivity. Julian and his team delivered an iconic civic space on schedule."';
        const kicker = block.kicker || '06 · VERIFIED CLIENT TESTIMONIAL';
        const isBlockSelected = !isExportMode && selectedBlockId === block.id;

        return (
          <div
            style={{
              borderColor: borderCol,
              backgroundColor: isExportMode ? 'transparent' : 'rgba(0,0,0,0.015)',
            }}
            className="p-5 border rounded-lg space-y-3 relative group/testimonial"
          >
            {/* Top row: Kicker + Star Rating + Verified Badge */}
            <div className="flex items-center justify-between gap-2 border-b pb-2.5" style={{ borderColor: borderCol }}>
              <div className="flex items-center gap-2">
                <span
                  style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}
                  className="text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5"
                >
                  <Quote className="w-3 h-3 text-amber-600" />
                  {renderEditableText(
                    kicker,
                    (val) => onUpdateBlock(block.id, { kicker: val }),
                    {
                      fontSize: '10px',
                      fontFamily: globalSettings.monoFont,
                      letterSpacing: '0.08em',
                      color: mutedInk,
                      fontWeight: 600,
                    },
                    'TESTIMONIAL LABEL',
                    false
                  )}
                </span>
                {block.testimonialVerified !== false && (
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Verified Client</span>
                  </span>
                )}
                {block.isNdaProtected && (
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <span>NDA Protected</span>
                  </span>
                )}
              </div>

              {/* 5-Star Rating */}
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Quote Body */}
            <div
              onClick={(e) => {
                if (!isExportMode) {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                  onSelectTextTarget?.('primary');
                }
              }}
              className={`transition-all rounded-xs ${
                isBlockSelected && activeTextTarget === 'primary'
                  ? 'ring-1 ring-blue-500/70 bg-blue-500/[0.03] p-0.5 -m-0.5'
                  : ''
              }`}
            >
              {renderEditableText(
                quoteText,
                (val) => onUpdateBlock(block.id, { text: val }),
                buildTextCss(block.textStyle, pageInk),
                'Enter client review or testimonial quote...',
                true
              )}
            </div>

            {/* Client Signature & Company Attribution */}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: borderCol }}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  style={{ borderColor: borderCol, backgroundColor: '#EAE6DF' }}
                  className="w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold text-stone-700 shrink-0"
                >
                  {name.charAt(0) || 'C'}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-stone-900">
                    {renderEditableText(
                      name,
                      (val) => onUpdateBlock(block.id, { clientName: val }),
                      {
                        fontSize: '12px',
                        fontWeight: 600,
                        color: pageInk,
                      },
                      'Client Name',
                      false
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5 flex-wrap">
                    {renderEditableText(
                      role,
                      (val) => onUpdateBlock(block.id, { clientRole: val }),
                      {
                        fontSize: '11px',
                        color: mutedInk,
                      },
                      'Role/Title',
                      false
                    )}
                    <span>·</span>
                    {renderEditableText(
                      company,
                      (val) => onUpdateBlock(block.id, { clientCompany: val }),
                      {
                        fontSize: '11px',
                        fontFamily: globalSettings.monoFont,
                        color: mutedInk,
                      },
                      'Company Name',
                      false
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'process-steps': {
        const steps: ProcessStepItem[] = block.processSteps || [
          { id: 'ps-1', stepNumber: '01', title: 'Spatial Audit & LiDAR', description: 'Executed millimeter-precision 3D scans.' },
          { id: 'ps-2', stepNumber: '02', title: 'Acoustic Simulation', description: 'Engineered algorithmic baffle geometries.' },
          { id: 'ps-3', stepNumber: '03', title: '1:1 Joinery Mockup', description: 'Fabricated full-scale CNC timber ribs.' },
          { id: 'ps-4', stepNumber: '04', title: 'Delivery & Commission', description: 'Coordinated phased installation in 18 weeks.' },
        ];
        const kicker = block.kicker || '04 · STRATEGY, PROCESS & METHODOLOGY';

        const updateStep = (idx: number, patch: Partial<ProcessStepItem>) => {
          const next = steps.map((s, i) => (i === idx ? { ...s, ...patch } : s));
          onUpdateBlock(block.id, { processSteps: next });
        };
        const addStep = () => {
          const num = steps.length + 1 < 10 ? `0${steps.length + 1}` : `${steps.length + 1}`;
          const newId = typeof createUid === 'function' ? createUid('ps') : `ps-${Date.now()}`;
          onUpdateBlock(block.id, {
            processSteps: [
              ...steps,
              {
                id: newId,
                stepNumber: num,
                title: 'New Strategy Step',
                description: 'Describe key methodologies, tools, and execution milestones.',
              },
            ],
          });
        };
        const removeStep = (idx: number) => {
          onUpdateBlock(block.id, { processSteps: steps.filter((_, i) => i !== idx) });
        };

        const processGridColsClass =
          steps.length <= 2
            ? 'grid-cols-2 max-w-xl mx-auto'
            : steps.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : steps.length === 4
            ? 'grid-cols-2 md:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';

        return (
          <div style={{ borderColor: borderCol }} className="py-3 border-t border-b space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span
                style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}
                className="text-[10px] tracking-wider uppercase font-semibold"
              >
                {renderEditableText(
                  kicker,
                  (val) => onUpdateBlock(block.id, { kicker: val }),
                  {
                    fontSize: '10px',
                    fontFamily: globalSettings.monoFont,
                    color: mutedInk,
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  },
                  'PROCESS TITLE',
                  false
                )}
              </span>
              {!isExportMode && steps.length < 8 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addStep();
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Step</span>
                </button>
              )}
            </div>

            <div className={`grid ${processGridColsClass} gap-3`}>
              {steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  style={{ borderColor: borderCol }}
                  className="p-3 bg-stone-100/60 border rounded-lg space-y-1.5 relative group/step"
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{ fontFamily: globalSettings.monoFont, color: globalSettings.accentColor || '#9a3412' }}
                      className="text-xs font-bold font-mono"
                    >
                      {step.stepNumber}
                    </span>
                    {!isExportMode && steps.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStep(idx);
                        }}
                        className="opacity-0 group-hover/step:opacity-100 text-stone-400 hover:text-red-500 transition-opacity"
                        title="Remove Step"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="font-semibold text-xs text-stone-900">
                    {renderEditableText(
                      step.title,
                      (val) => updateStep(idx, { title: val }),
                      {
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: pageInk,
                      },
                      'Step Title',
                      false
                    )}
                  </div>

                  <div className="text-[11px] text-stone-600 leading-snug">
                    {renderEditableText(
                      step.description,
                      (val) => updateStep(idx, { description: val }),
                      {
                        fontSize: '10.5px',
                        color: mutedInk,
                        lineHeight: 1.45,
                      },
                      'Step Description...',
                      true
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'services-grid': {
        const offers: ServiceOfferItem[] = block.serviceOffers || [
          {
            id: 'so-1',
            number: '01',
            title: 'Architectural Design & Planning',
            description: 'Concept design, site masterplanning, heritage conservation, and full technical permit filing across municipal jurisdictions.',
            tags: ['Concept Masterplan', 'BIM LOD 350', 'Council Approval'],
          },
          {
            id: 'so-2',
            number: '02',
            title: 'Interior Architecture & Joinery',
            description: 'Custom millwork detailing, bespoke furniture specification, lighting design, and curated mineral material palettes.',
            tags: ['Custom Joinery', 'Material Schedules', 'FF&E Procurement'],
          },
          {
            id: 'so-3',
            number: '03',
            title: '3D Computational Visualization',
            description: 'Photorealistic architectural visualization, cinematic lighting simulations, VR walkthroughs, and competition renders.',
            tags: ['4K Visual Plates', 'Shadow Studies', 'VR Presentation'],
          },
        ];
        const kicker = block.kicker || 'PART 02 · CORE SERVICES & SCOPE OF ENGAGEMENT';

        const updateOffer = (idx: number, patch: Partial<ServiceOfferItem>) => {
          const next = offers.map((o, i) => (i === idx ? { ...o, ...patch } : o));
          onUpdateBlock(block.id, { serviceOffers: next });
        };
        const addOffer = () => {
          const num = offers.length + 1 < 10 ? `0${offers.length + 1}` : `${offers.length + 1}`;
          const newId = typeof createUid === 'function' ? createUid('so') : `so-${Date.now()}`;
          onUpdateBlock(block.id, {
            serviceOffers: [
              ...offers,
              {
                id: newId,
                number: num,
                title: 'New Service Discipline',
                description: 'Detailed description of services offered, methodologies, and deliverables.',
                tags: ['Consultation', 'Deliverables'],
              },
            ],
          });
        };
        const removeOffer = (idx: number) => {
          onUpdateBlock(block.id, { serviceOffers: offers.filter((_, i) => i !== idx) });
        };

        const servicesGridColsClass =
          offers.length === 1
            ? 'grid-cols-1 max-w-md mx-auto'
            : offers.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : offers.length === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

        return (
          <div style={{ borderColor: borderCol }} className="py-3 border-t border-b space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span
                style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}
                className="text-[10px] tracking-wider uppercase font-semibold"
              >
                {renderEditableText(
                  kicker,
                  (val) => onUpdateBlock(block.id, { kicker: val }),
                  {
                    fontSize: '10px',
                    fontFamily: globalSettings.monoFont,
                    color: mutedInk,
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  },
                  'SERVICES HEADER',
                  false
                )}
              </span>
              {!isExportMode && offers.length < 8 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addOffer();
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Service</span>
                </button>
              )}
            </div>

            <div className={`grid ${servicesGridColsClass} gap-3`}>
              {offers.map((offer, idx) => (
                <div
                  key={offer.id || idx}
                  style={{ borderColor: borderCol }}
                  className="p-3.5 bg-stone-100/50 border rounded-lg space-y-2 relative group/offer flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        style={{ fontFamily: globalSettings.monoFont, color: globalSettings.accentColor || '#9a3412' }}
                        className="text-xs font-bold font-mono"
                      >
                        {offer.number}
                      </span>
                      {!isExportMode && offers.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeOffer(idx);
                          }}
                          className="opacity-0 group-hover/offer:opacity-100 text-stone-400 hover:text-red-500 transition-opacity"
                          title="Remove Service"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="font-semibold text-xs text-stone-900">
                      {renderEditableText(
                        offer.title,
                        (val) => updateOffer(idx, { title: val }),
                        {
                          fontSize: '12px',
                          fontWeight: 600,
                          color: pageInk,
                        },
                        'Service Title',
                        false
                      )}
                    </div>

                    <div className="text-[11px] text-stone-600 leading-snug">
                      {renderEditableText(
                        offer.description,
                        (val) => updateOffer(idx, { description: val }),
                        {
                          fontSize: '11px',
                          color: mutedInk,
                          lineHeight: 1.5,
                        },
                        'Service description...',
                        true
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-1">
                    {(offer.tags || []).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{ fontFamily: globalSettings.monoFont }}
                        className="group/tag inline-flex items-center gap-1 text-[9px] bg-white text-stone-700 px-1.5 py-0.5 rounded border border-stone-200"
                      >
                        {renderEditableText(
                          tag,
                          (newTag) => {
                            const updatedTags = [...(offer.tags || [])];
                            updatedTags[tIdx] = newTag;
                            updateOffer(idx, { tags: updatedTags });
                          },
                          {
                            fontSize: '9px',
                            fontFamily: globalSettings.monoFont,
                            color: '#44403c',
                          },
                          'Tag',
                          false
                        )}
                        {!isExportMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedTags = (offer.tags || []).filter((_, i) => i !== tIdx);
                              updateOffer(idx, { tags: updatedTags });
                            }}
                            className="opacity-0 group-hover/tag:opacity-100 text-stone-400 hover:text-red-500 ml-0.5"
                            title="Delete Tag"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {!isExportMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedTags = [...(offer.tags || []), 'New Discipline'];
                          updateOffer(idx, { tags: updatedTags });
                        }}
                        className="text-[9px] text-stone-400 hover:text-stone-700 border border-dashed border-stone-300 hover:border-stone-400 rounded px-1.5 py-0.5"
                        title="Add Tag"
                      >
                        + Tag
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'arch-scale-compass': {
        const ratio = block.scaleRatio || '1:100';
        const unit = block.scaleUnit || 'metric';
        const lengthM = block.scaleLengthMeters || 10;
        const angle = block.northAngleDeg ?? 0;
        const showNorth = block.showNorthArrow !== false;
        const showScale = block.showScaleBar !== false;
        const compassStyle = block.compassStyle || 'minimal-needle';
        const kicker = block.kicker || 'ARCHITECTURAL DRAWING SPECIFICATIONS';

        return (
          <div
            style={{ borderColor: borderCol }}
            className="py-4 border-t border-b flex flex-wrap items-center justify-between gap-6"
          >
            {/* Left: Graphic Scale Bar */}
            {showScale && (
              <div className="flex flex-col gap-2 min-w-[240px]">
                <div className="flex items-center justify-between text-[10px] tracking-wider uppercase font-semibold">
                  <span style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}>
                    {renderEditableText(
                      kicker,
                      (val) => onUpdateBlock(block.id, { kicker: val }),
                      {
                        fontSize: '10px',
                        fontFamily: globalSettings.monoFont,
                        color: mutedInk,
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                      },
                      'SCALE SPECIFICATIONS',
                      false
                    )}
                  </span>
                  <span
                    style={{ fontFamily: globalSettings.monoFont }}
                    className="font-bold text-stone-900"
                  >
                    SCALE {ratio}
                  </span>
                </div>

                {/* The Graphic Bar with Subdivisions */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-end h-3 w-64 border-t border-b border-stone-900 relative">
                    <div className="w-1/4 h-full bg-stone-900" />
                    <div className="w-1/4 h-full bg-stone-200" />
                    <div className="w-1/4 h-full bg-stone-900" />
                    <div className="w-1/4 h-full bg-stone-200" />
                  </div>
                  {/* Metric ticks numbers */}
                  <div
                    style={{ fontFamily: globalSettings.monoFont }}
                    className="w-64 flex justify-between text-[9px] font-semibold text-stone-700 tabular-nums px-0.5"
                  >
                    <span>0</span>
                    <span>
                      {Math.round(lengthM * 0.25)}
                      {unit === 'metric' ? 'm' : 'ft'}
                    </span>
                    <span>
                      {Math.round(lengthM * 0.5)}
                      {unit === 'metric' ? 'm' : 'ft'}
                    </span>
                    <span>
                      {Math.round(lengthM * 0.75)}
                      {unit === 'metric' ? 'm' : 'ft'}
                    </span>
                    <span>
                      {lengthM}
                      {unit === 'metric' ? 'm' : 'ft'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Right: Architectural North Compass */}
            {showNorth && (
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transition: 'transform 0.2s ease-out',
                    }}
                    className="w-12 h-12 flex items-center justify-center relative"
                  >
                    {compassStyle === 'circle-arrow' ? (
                      <svg viewBox="0 0 48 48" className="w-10 h-10 stroke-stone-900 fill-none">
                        <circle cx="24" cy="24" r="20" strokeWidth="1.5" />
                        <line x1="24" y1="4" x2="24" y2="44" strokeWidth="1.5" />
                        <polygon points="24,4 19,16 29,16" className="fill-stone-900 stroke-none" />
                      </svg>
                    ) : compassStyle === 'architectural-cross' ? (
                      <svg viewBox="0 0 48 48" className="w-10 h-10 stroke-stone-900 fill-none">
                        <line x1="24" y1="2" x2="24" y2="46" strokeWidth="1.5" />
                        <line x1="2" y1="24" x2="46" y2="24" strokeWidth="1.5" strokeDasharray="2 2" />
                        <polygon points="24,2 20,12 28,12" className="fill-stone-900 stroke-none" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 48 48" className="w-10 h-10">
                        <polygon points="24,4 20,24 24,22" className="fill-stone-900" />
                        <polygon points="24,4 28,24 24,22" className="fill-stone-400" />
                        <polygon points="24,44 20,24 24,26" className="fill-stone-400" />
                        <polygon points="24,44 28,24 24,26" className="fill-stone-200" />
                        <circle
                          cx="24"
                          cy="24"
                          r="2.5"
                          className="fill-white stroke-stone-900"
                          strokeWidth="1"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{ fontFamily: globalSettings.monoFont }}
                    className="text-[10px] font-bold text-stone-900 tracking-wider -mt-0.5"
                  >
                    N
                  </span>
                </div>
                {!isExportMode && (
                  <div className="flex flex-col text-[10px] text-stone-500">
                    <span style={{ fontFamily: globalSettings.monoFont }}>{angle}°</span>
                    <span className="text-[9px] text-stone-400">Angle</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      case 'project-factsheet': {
        const kicker = block.kicker || 'PROJECT ARCHIVE & TECHNICAL SPECIFICATION';
        const title = block.factsheetTitle || 'Architectural Monograph Factsheet';
        const layout = block.factsheetLayout || 'grid-3col';
        const items = block.factsheetItems || [
          { id: 'fi-1', label: 'PROJECT NAME', value: 'Pavilion of Light & Stone' },
          { id: 'fi-2', label: 'PROGRAM / TYPOLOGY', value: 'Cultural Gallery & Archive' },
          { id: 'fi-3', label: 'LOCATION', value: 'Engadin Valley, Switzerland' },
          { id: 'fi-4', label: 'YEAR / STATUS', value: '2025 – 2026 (Completed)' },
          { id: 'fi-5', label: 'GROSS BUILT AREA', value: '3,850 m² (41,400 sq ft)' },
          { id: 'fi-6', label: 'CLIENT / PATRON', value: 'Cantonal Cultural Trust' },
          { id: 'fi-7', label: 'LEAD ARCHITECT', value: 'Julian Sterling Studio' },
          { id: 'fi-8', label: 'STRUCTURAL CONSULTANT', value: 'Buro Weber & Partner' },
          { id: 'fi-9', label: 'PHOTOGRAPHY CREDITS', value: 'Hélène Binet Studio' },
        ];

        const gridColsClass =
          layout === 'compact-strip'
            ? 'grid-cols-2 sm:grid-cols-4'
            : layout === 'grid-2col'
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

        return (
          <div style={{ borderColor: borderCol }} className="py-4 border-t border-b space-y-4">
            <div className="space-y-1">
              <span
                style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}
                className="text-[10px] tracking-wider uppercase font-semibold block"
              >
                {renderEditableText(
                  kicker,
                  (val) => onUpdateBlock(block.id, { kicker: val }),
                  {
                    fontSize: '10px',
                    fontFamily: globalSettings.monoFont,
                    color: mutedInk,
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  },
                  'FACTSHEET KICKER',
                  false
                )}
              </span>
              <h3
                style={{
                  fontFamily: block.textStyle?.fontFamily || globalSettings.headingFont,
                  fontSize: `${block.textStyle?.fontSize || 20}px`,
                  color: pageInk,
                }}
                className="font-semibold tracking-tight"
              >
                {renderEditableText(
                  title,
                  (val) => onUpdateBlock(block.id, { factsheetTitle: val }),
                  {
                    fontSize: `${block.textStyle?.fontSize || 20}px`,
                    fontFamily: block.textStyle?.fontFamily || globalSettings.headingFont,
                    color: pageInk,
                    fontWeight: 600,
                  },
                  'Factsheet Title',
                  false
                )}
              </h3>
            </div>

            <div className={`grid ${gridColsClass} gap-3`}>
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{ borderColor: borderCol }}
                  className="p-3 bg-stone-100/60 border rounded-lg space-y-1 relative group/item"
                >
                  <span
                    style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}
                    className="text-[9px] uppercase tracking-wider font-semibold block truncate"
                  >
                    {renderEditableText(
                      item.label,
                      (val) => {
                        const nextItems = [...items];
                        nextItems[idx] = { ...nextItems[idx], label: val };
                        onUpdateBlock(block.id, { factsheetItems: nextItems });
                      },
                      {
                        fontSize: '9px',
                        fontFamily: globalSettings.monoFont,
                        color: mutedInk,
                        letterSpacing: '0.06em',
                        fontWeight: 600,
                      },
                      'LABEL',
                      false
                    )}
                  </span>
                  <div
                    style={{
                      fontFamily: globalSettings.bodyFont,
                      color: pageInk,
                    }}
                    className="text-xs font-medium"
                  >
                    {renderEditableText(
                      item.value,
                      (val) => {
                        const nextItems = [...items];
                        nextItems[idx] = { ...nextItems[idx], value: val };
                        onUpdateBlock(block.id, { factsheetItems: nextItems });
                      },
                      {
                        fontSize: '12px',
                        fontFamily: globalSettings.bodyFont,
                        color: pageInk,
                        fontWeight: 500,
                      },
                      'Value...',
                      true
                    )}
                  </div>
                  {!isExportMode && items.length > 2 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextItems = items.filter((_, i) => i !== idx);
                        onUpdateBlock(block.id, { factsheetItems: nextItems });
                      }}
                      className="absolute top-1.5 right-1.5 opacity-0 group-hover/item:opacity-100 text-stone-400 hover:text-red-500 text-xs p-1"
                      title="Remove Factsheet Item"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!isExportMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextItems = [
                    ...items,
                    {
                      id: createUid('fi'),
                      label: 'NEW SPECIFICATION',
                      value: 'Value or description here',
                    },
                  ];
                  onUpdateBlock(block.id, { factsheetItems: nextItems });
                }}
                className="text-xs text-stone-600 hover:text-stone-950 font-medium flex items-center gap-1.5 pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Factsheet Row</span>
              </button>
            )}
          </div>
        );
      }

      case 'table-of-contents': {
        const kicker = block.kicker || 'PORTFOLIO DIRECTORY';
        const title = block.text || 'Table of Contents';
        const style = block.tocStyle || 'editorial-dots';
        const showBadges = block.tocIncludeSectionBadges !== false;
        const catalogPages = allPages && allPages.length > 0 ? allPages : [page];

        return (
          <div style={{ borderColor: borderCol }} className="py-4 border-t border-b space-y-5">
            <div className="space-y-1">
              <span
                style={{ fontFamily: globalSettings.monoFont, color: mutedInk }}
                className="text-[10px] tracking-wider uppercase font-semibold block"
              >
                {renderEditableText(
                  kicker,
                  (val) => onUpdateBlock(block.id, { kicker: val }),
                  {
                    fontSize: '10px',
                    fontFamily: globalSettings.monoFont,
                    color: mutedInk,
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  },
                  'DIRECTORY KICKER',
                  false
                )}
              </span>
              <h2
                style={{
                  fontFamily: block.textStyle?.fontFamily || globalSettings.headingFont,
                  fontSize: `${block.textStyle?.fontSize || 28}px`,
                  color: pageInk,
                }}
                className="font-semibold tracking-tight"
              >
                {renderEditableText(
                  title,
                  (val) => onUpdateBlock(block.id, { text: val }),
                  {
                    fontSize: `${block.textStyle?.fontSize || 28}px`,
                    fontFamily: block.textStyle?.fontFamily || globalSettings.headingFont,
                    color: pageInk,
                    fontWeight: 600,
                  },
                  'Table of Contents',
                  false
                )}
              </h2>
            </div>

            {/* List of Pages */}
            <div className="space-y-2.5">
              {catalogPages.map((p, idx) => {
                const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (!isExportMode && onNavigatePage) {
                        onNavigatePage(p.id);
                      }
                    }}
                    className={`flex items-baseline justify-between gap-4 py-1 group ${
                      !isExportMode ? 'cursor-pointer hover:text-amber-800' : ''
                    }`}
                  >
                    {/* Index Number & Title */}
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span
                        style={{ fontFamily: globalSettings.monoFont }}
                        className="text-xs font-mono font-bold text-stone-400 group-hover:text-amber-600 shrink-0 tabular-nums"
                      >
                        {numStr}
                      </span>
                      <span
                        style={{ fontFamily: globalSettings.bodyFont }}
                        className="text-sm font-semibold text-stone-900 group-hover:text-stone-950 truncate"
                      >
                        {p.title}
                      </span>
                      {showBadges && p.sectionLabel && (
                        <span
                          style={{ fontFamily: globalSettings.monoFont }}
                          className="text-[9px] uppercase tracking-wider text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 shrink-0 hidden sm:inline"
                        >
                          {p.sectionLabel}
                        </span>
                      )}
                    </div>

                    {/* Dotted Leader Line */}
                    {style === 'editorial-dots' && (
                      <div className="flex-1 border-b border-dotted border-stone-300 min-w-[20px] mb-1" />
                    )}

                    {/* Page Number */}
                    <span
                      style={{ fontFamily: globalSettings.monoFont }}
                      className="text-xs font-mono font-semibold text-stone-500 tabular-nums shrink-0"
                    >
                      p. {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
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
        onDragOver={handleCanvasDragOver}
        onDragLeave={handleCanvasDragLeave}
        onDrop={handleCanvasDrop}
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
        {/* Bleed Margin & Print Registration Trim Marks (3mm = ~11px) */}
        {showBleedGuides && !isExportMode && (
          <div className="absolute inset-0 pointer-events-none z-40 select-none">
            {/* 3mm Dashed Bleed Boundary */}
            <div className="absolute inset-[11px] border border-dashed border-rose-500/60 rounded-xs" />
            <div className="absolute top-1.5 left-4 text-[9px] font-mono font-semibold text-rose-500/90 uppercase tracking-widest bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
              3mm Bleed Safety Line
            </div>
            {/* 4 Corner Crop Registration Marks */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-stone-900" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-stone-900" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-stone-900" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-stone-900" />
          </div>
        )}

        {/* 12-Column Swiss Modular Grid Overlay */}
        {showColumnGrid && !isExportMode && (
          <div className="absolute inset-0 pointer-events-none z-40 select-none grid grid-cols-12 gap-3 px-8 py-8 opacity-15">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-rose-500 rounded-2xs border-x border-rose-600/30"
              />
            ))}
          </div>
        )}

        {/* Drag & Drop Visual Overlay */}
        {isCanvasDragOver && !isExportMode && (
          <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-xs border-4 border-dashed border-stone-800 m-3 rounded-2xl flex flex-col items-center justify-center pointer-events-none transition-all">
            <div className="bg-white/95 text-stone-900 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3.5 border border-stone-200">
              <Upload className="w-6 h-6 text-stone-900 animate-bounce" />
              <div>
                <p className="text-sm font-semibold">Drop image(s) to add to page</p>
                <p className="text-xs text-stone-500">1 image creates full plate · 2+ images create photo grid</p>
              </div>
            </div>
          </div>
        )}
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
            {(page?.blocks || []).length === 0 && !isExportMode && (
              <div className="py-20 px-6 border-2 border-dashed border-stone-200/80 rounded-xl text-center flex flex-col items-center justify-center my-auto">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-stone-800">Blank Page Canvas</h3>
                <p className="text-xs text-stone-500 max-w-sm mt-1.5 leading-relaxed">
                  Use the top formatting toolbar to insert headlines, editorial copy, media plates, mockups, or photo grids.
                </p>
              </div>
            )}
            {(page?.blocks || []).map((block, bIdx) => {
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
                        disabled={bIdx === (page?.blocks || []).length - 1}
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
