/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Command,
  Copy,
  Download,
  Eye,
  FilePlus,
  FolderOpen,
  GripVertical,
  Layers,
  LayoutGrid,
  Maximize2,
  Minus,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Type,
  Undo2,
} from 'lucide-react';
import { AddPageModal } from './components/AddPageModal';
import { CommandItem, CommandPalette } from './components/CommandPalette';
import { InspectorSidebar, InspectorTab } from './components/InspectorSidebar';
import { PageCanvas } from './components/PageCanvas';
import { PdfExportModal } from './components/PdfExportModal';
import { PresentationView } from './components/PresentationView';
import { StarterKitsModal } from './components/StarterKitsModal';
import { StockLibraryModal } from './components/StockLibraryModal';
import { TextFormatToolbar } from './components/TextFormatToolbar';
import {
  createBlocksForTemplate,
  createUid,
  CURATED_VISUAL_PLATES,
  FONT_PAIRINGS,
  GLOBAL_THEMES,
  INITIAL_GLOBAL_SETTINGS,
  INITIAL_PAGES,
  PAGE_SIZE_PRESETS,
  PAGE_TEMPLATES,
} from './data/editorialAssets';
import { STARTER_KITS, StarterKit } from './data/starterKits';
import { StockVisualPlate } from './data/stockLibrary';
import {
  BlockType,
  GlobalDocumentSettings,
  ImageStyle,
  PageSizeId,
  PageTemplateId,
  PortfolioBlock,
  PortfolioPage,
  TextStyle,
  TextTargetField,
} from './types/portfolio';
import { loadGoogleFont } from './utils/googleFonts';

const STORAGE_KEY = 'foliopress_portfolio_state_v1';

export default function App() {
  const [pages, setPages] = useState<PortfolioPage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          return parsed.pages;
        }
      }
    } catch {
      // Ignore storage error
    }
    return INITIAL_PAGES;
  });

  const [globalSettings, setGlobalSettings] = useState<GlobalDocumentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.globalSettings) {
          return { ...INITIAL_GLOBAL_SETTINGS, ...parsed.globalSettings };
        }
      }
    } catch {
      // Ignore storage error
    }
    return INITIAL_GLOBAL_SETTINGS;
  });

  const [activePageId, setActivePageId] = useState<string>(() => pages[0]?.id || 'page-1');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    () => pages[0]?.blocks[0]?.id || null
  );
  const [activeTextTarget, setActiveTextTarget] = useState<TextTargetField>('primary');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('element');
  const [workspaceMode, setWorkspaceMode] = useState<'single' | 'spread' | 'preview'>('single');
  const [canvasZoom, setCanvasZoom] = useState<number>(0.78);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState<boolean>(false);
  const [isStarterKitsModalOpen, setIsStarterKitsModalOpen] = useState<boolean>(false);
  const [isStockLibraryOpen, setIsStockLibraryOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [draggedPageIdx, setDraggedPageIdx] = useState<number | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<PortfolioPage[][]>(() => [pages]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = (newPages: PortfolioPage[]) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newPages]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIdx = historyIndex - 1;
      const prevPages = history[targetIdx];
      setHistoryIndex(targetIdx);
      setPages(prevPages);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIdx = historyIndex + 1;
      const nextPages = history[targetIdx];
      setHistoryIndex(targetIdx);
      setPages(nextPages);
    }
  };

  // Keyboard shortcut listener for Undo/Redo & Presentation F5 & Command Palette Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z')) ||
        ((e.metaKey || e.ctrlKey) && (e.key === 'y' || e.key === 'Y'))
      ) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'F5' || (e.altKey && (e.key === 'p' || e.key === 'P'))) {
        e.preventDefault();
        setIsPresentationOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Auto-persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ pages, globalSettings }));
    } catch {
      // Ignore quota errors if large custom images are uploaded
    }
  }, [pages, globalSettings]);

  // Dynamic Google Fonts Auto-Loader for loaded portfolio and active pages
  useEffect(() => {
    if (globalSettings.headingFont) loadGoogleFont(globalSettings.headingFont);
    if (globalSettings.bodyFont) loadGoogleFont(globalSettings.bodyFont);
    if (globalSettings.monoFont) loadGoogleFont(globalSettings.monoFont);

    pages.forEach((page) => {
      page.blocks.forEach((block) => {
        if (block.textStyle?.fontFamily) loadGoogleFont(block.textStyle.fontFamily);
        if (block.secondaryTextStyle?.fontFamily) loadGoogleFont(block.secondaryTextStyle.fontFamily);
        if (block.kickerTextStyle?.fontFamily) loadGoogleFont(block.kickerTextStyle.fontFamily);
      });
    });
  }, [pages, globalSettings.headingFont, globalSettings.bodyFont, globalSettings.monoFont]);

  const activePageIndex = Math.max(
    0,
    pages.findIndex((p) => p.id === activePageId)
  );
  const currentPage = pages[activePageIndex] || pages[0];

  const selectedBlock =
    currentPage?.blocks.find((b) => b.id === selectedBlockId) || null;

  // Active orientation & format determination
  const activeSizeId = currentPage?.pageSizeOverride || globalSettings.pageSize;
  const currentSizeSpec =
    PAGE_SIZE_PRESETS.find((s) => s.id === activeSizeId) || PAGE_SIZE_PRESETS[0];
  const isLandscape = currentSizeSpec.orientation === 'landscape';

  const handleToggleOrientation = (target: 'portrait' | 'landscape') => {
    // If the current page had a specific override, clear it so global toggle applies cleanly
    if (currentPage?.pageSizeOverride) {
      handleUpdatePage({ pageSizeOverride: undefined });
    }

    if (target === 'landscape') {
      let nextId: PageSizeId = 'a4-landscape';
      if (globalSettings.pageSize === 'letter-portrait') nextId = 'letter-landscape';
      else if (globalSettings.pageSize === 'a4-portrait') nextId = 'a4-landscape';
      setGlobalSettings((prev) => ({ ...prev, pageSize: nextId }));
      setCanvasZoom((z) => Math.min(z, 0.72));
    } else {
      let nextId: PageSizeId = 'a4-portrait';
      if (globalSettings.pageSize === 'letter-landscape') nextId = 'letter-portrait';
      else if (
        globalSettings.pageSize === 'a4-landscape' ||
        globalSettings.pageSize === 'deck-16-9' ||
        globalSettings.pageSize === 'deck-4-3'
      )
        nextId = 'a4-portrait';
      setGlobalSettings((prev) => ({ ...prev, pageSize: nextId }));
    }
  };

  // Select block and switch inspector to Element tab
  const handleSelectBlock = (blockId: string | null) => {
    setSelectedBlockId(blockId);
    if (blockId) {
      setInspectorTab('element');
      if (blockId !== selectedBlockId) {
        setActiveTextTarget('primary');
      }
    }
  };

  // Update current page metadata
  const handleUpdatePage = (patch: Partial<PortfolioPage>) => {
    setPages((prev) =>
      prev.map((p) => (p.id === currentPage.id ? { ...p, ...patch } : p))
    );
  };

  // Update specific block on current page
  const handleUpdateBlock = (blockId: string, patch: Partial<PortfolioBlock>) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== currentPage.id) return p;
        return {
          ...p,
          blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
        };
      })
    );
  };

  // Update text style of currently selected block for specific target layer
  const handleUpdateTextStyle = (
    patch: Partial<TextStyle>,
    target: TextTargetField = activeTextTarget
  ) => {
    if (!selectedBlock) return;
    if (patch.fontFamily) {
      loadGoogleFont(patch.fontFamily);
    }

    if (target === 'kicker') {
      const currentKicker = selectedBlock.kickerTextStyle || {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 500,
        color: '#78716c',
        letterSpacing: 2,
        textTransform: 'uppercase',
      };
      handleUpdateBlock(selectedBlock.id, {
        kickerTextStyle: { ...currentKicker, ...patch },
      });
    } else if (target === 'secondary') {
      const currentSec = selectedBlock.secondaryTextStyle || {
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#57534e',
        letterSpacing: 0,
        textTransform: 'none',
      };
      handleUpdateBlock(selectedBlock.id, {
        secondaryTextStyle: { ...currentSec, ...patch },
      });
    } else {
      // Primary headline layer or whole block
      // If patch contains textAlign on a heading, unify all text layers (headline, subtitle, kicker)
      if (patch.textAlign && selectedBlock.type === 'heading') {
        handleUpdateBlock(selectedBlock.id, {
          textStyle: { ...selectedBlock.textStyle, ...patch },
          secondaryTextStyle: {
            ...(selectedBlock.secondaryTextStyle || {}),
            textAlign: patch.textAlign,
          },
          kickerTextStyle: {
            ...(selectedBlock.kickerTextStyle || {}),
            textAlign: patch.textAlign,
          },
        });
      } else {
        handleUpdateBlock(selectedBlock.id, {
          textStyle: { ...selectedBlock.textStyle, ...patch },
        });
      }
    }
  };

  // AI Polish Text Function
  const handleAiPolishText = (style: 'editorial' | 'concise' | 'technical' | 'grammar') => {
    if (!selectedBlock) return;
    const current = selectedBlock.text || '';
    if (!current.trim()) return;

    let polished = current;
    if (style === 'editorial') {
      polished = `Conceived with rigorous architectural proportion and material quietude, this project reconciles tactile permanence with natural light. ${current.replace(
        /^([a-z])/,
        (m) => m.toUpperCase()
      )}`;
    } else if (style === 'concise') {
      const sentences = current.split(/[.!?]+/).filter(Boolean);
      polished = sentences.slice(0, 2).join('. ') + (sentences.length > 0 ? '.' : '');
    } else if (style === 'technical') {
      polished = `${current.trim()} Engineered with precision-grade structural timber cassettes, 4.2% daylight factor calibration, and custom anodized aluminum hardware.`;
    } else if (style === 'grammar') {
      polished = current.trim().replace(/\s+/g, ' ');
    }

    handleUpdateBlock(selectedBlock.id, { text: polished });
  };

  // Update image style of currently selected block
  const handleUpdateImageStyle = (patch: Partial<ImageStyle>) => {
    if (!selectedBlock) return;
    const baseImageStyle: ImageStyle = selectedBlock.imageStyle || {
      height: 360,
      objectFit: 'cover',
      zoom: 1,
      filter: 'none',
      borderRadius: 0,
      showBorder: false,
    };
    handleUpdateBlock(selectedBlock.id, {
      imageStyle: { ...baseImageStyle, ...patch },
    });
  };

  // Add a new block to the current page
  const handleAddBlock = (type: BlockType) => {
    const newId = createUid('blk');
    const defaultTextStyle: TextStyle = {
      fontFamily:
        type === 'heading' || type === 'pull-quote'
          ? globalSettings.headingFont
          : globalSettings.bodyFont,
      fontSize: type === 'heading' ? 32 : type === 'pull-quote' ? 22 : 14,
      fontWeight: type === 'heading' ? 500 : 400,
      fontStyle: type === 'pull-quote' ? 'italic' : 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      lineHeight: type === 'heading' ? 1.15 : 1.65,
      letterSpacing: type === 'heading' ? -0.01 : 0,
      textTransform: 'none',
    };

    let newBlock: PortfolioBlock = {
      id: newId,
      type,
      textStyle: defaultTextStyle,
    };

    if (type === 'heading') {
      newBlock = {
        ...newBlock,
        kicker: `SECTION 0${activePageIndex + 1} · ARCHITECTURAL STUDY`,
        text: 'New Section Headline',
        secondaryText: 'Lead subtitle or project context note.',
      };
    } else if (type === 'paragraph') {
      newBlock = {
        ...newBlock,
        text: 'Enter your left-aligned English project narrative here. Click to customize font family, size, line spacing, and alignment.',
      };
    } else if (type === 'image') {
      newBlock = {
        ...newBlock,
        imageUrl: CURATED_VISUAL_PLATES[activePageIndex % CURATED_VISUAL_PLATES.length].url,
        imageCaption: 'Fig. — Architectural plate documentation.',
        imageStyle: {
          height: 360,
          objectFit: 'cover',
          zoom: 1,
          filter: 'none',
          borderRadius: 0,
          showBorder: false,
        },
      };
    } else if (type === 'split-media-text') {
      newBlock = {
        ...newBlock,
        splitDirection: 'image-right',
        splitRatio: '50-50',
        imageUrl: CURATED_VISUAL_PLATES[(activePageIndex + 1) % CURATED_VISUAL_PLATES.length].url,
        imageCaption: 'Plate — Spatial light study.',
        imageStyle: {
          height: 320,
          objectFit: 'cover',
          zoom: 1,
          filter: 'none',
          borderRadius: 0,
          showBorder: false,
        },
        text: 'Side-by-side editorial commentary paired with visual documentation. Use the Flip button below to swap left and right columns.',
      };
    } else if (type === 'dual-image') {
      newBlock = {
        ...newBlock,
        imageUrl: CURATED_VISUAL_PLATES[1].url,
        imageCaption: 'Plate A — Exterior elevation.',
        secondaryImageUrl: CURATED_VISUAL_PLATES[2].url,
        secondaryImageCaption: 'Plate B — Interior material detail.',
        imageStyle: {
          height: 280,
          objectFit: 'cover',
          zoom: 1,
          filter: 'none',
          borderRadius: 0,
          showBorder: false,
        },
      };
    } else if (type === 'two-column-text') {
      newBlock = {
        ...newBlock,
        text: 'First column of editorial text. Ideal for architectural essays, design methodology, and project background.',
        secondaryText:
          'Second column of editorial text. Maintains balanced measure and clean left-aligned typographic rhythm across the spread.',
      };
    } else if (type === 'pull-quote') {
      newBlock = {
        ...newBlock,
        text: '“Design is the quiet calibration of proportion, material permanence, and natural light.”',
        kicker: '— STUDIO MONOGRAPH NOTE',
      };
    } else if (type === 'spec-grid') {
      newBlock = {
        ...newBlock,
        specs: [
          { id: createUid('sp'), label: 'LOCATION', value: 'Zurich, Switzerland' },
          { id: createUid('sp'), label: 'YEAR', value: '2026' },
          { id: createUid('sp'), label: 'AREA', value: '2,400 m²' },
          { id: createUid('sp'), label: 'STATUS', value: 'Completed' },
        ],
      };
    } else if (type === 'divider') {
      newBlock = {
        ...newBlock,
        spacingHeight: 28,
        showLine: true,
      };
    } else if (type === 'device-mockup') {
      newBlock = {
        ...newBlock,
        deviceType: 'macbook',
        imageUrl: CURATED_VISUAL_PLATES[0].url,
        imageCaption: 'Fig. — Live responsive digital platform interface.',
      };
    } else if (type === 'color-palette') {
      newBlock = {
        ...newBlock,
        swatches: [
          { id: createUid('sw'), hex: '#161514', name: 'Obsidian Black', code: 'Base Ink' },
          { id: createUid('sw'), hex: '#FAF8F5', name: 'Cotton Archival', code: 'Canvas Surface' },
          { id: createUid('sw'), hex: '#9A3412', name: 'Terracotta Ochre', code: 'Primary Accent' },
          { id: createUid('sw'), hex: '#D5CCBC', name: 'Honed Travertine', code: 'Secondary Tint' },
          { id: createUid('sw'), hex: '#2D373C', name: 'Deep Basalt', code: 'Structural Frame' },
        ],
      };
    } else if (type === 'before-after') {
      newBlock = {
        ...newBlock,
        beforeImageUrl: CURATED_VISUAL_PLATES[1].url,
        beforeLabel: 'BEFORE RECONSTRUCTION',
        beforeCaption: 'Original gallery hall condition.',
        afterImageUrl: CURATED_VISUAL_PLATES[0].url,
        afterLabel: 'COMPLETED PAVILION',
        afterCaption: 'Finished cantilevered stone structure.',
      };
    } else if (type === 'qr-code') {
      newBlock = {
        ...newBlock,
        qrUrl: 'https://peymanjalili1997.github.io/foliopress/',
        qrTitle: 'Scan to View Full Interactive Portfolio & Case Studies',
        qrSubtitle:
          'Use any smartphone camera to view responsive live websites, video showreels, and verified client testimonials.',
      };
    } else if (type === 'project-meta') {
      newBlock = {
        ...newBlock,
        toolsList: ['Figma Pro', 'Blender 3D', 'Rhino 8', 'React 19', 'Tailwind CSS'],
      };
    } else if (type === 'multi-photo-grid') {
      newBlock = {
        ...newBlock,
        gridImages: [
          { id: createUid('img'), url: CURATED_VISUAL_PLATES[1].url, caption: 'Detail A — Raw Stone Texture' },
          { id: createUid('img'), url: CURATED_VISUAL_PLATES[2].url, caption: 'Detail B — Anodized Bevel' },
          { id: createUid('img'), url: CURATED_VISUAL_PLATES[3].url, caption: 'Detail C — Axonometric Joinery' },
        ],
      };
    }

    setPages((prev) => {
      const updated = prev.map((p) =>
        p.id === currentPage.id ? { ...p, blocks: [...p.blocks, newBlock] } : p
      );
      pushHistory(updated);
      return updated;
    });
    setSelectedBlockId(newId);
    setInspectorTab('element');
  };

  // Reorder blocks within current page
  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== currentPage.id) return p;
        const idx = p.blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return p;
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= p.blocks.length) return p;
        const nextBlocks = [...p.blocks];
        const [moved] = nextBlocks.splice(idx, 1);
        nextBlocks.splice(targetIdx, 0, moved);
        return { ...p, blocks: nextBlocks };
      })
    );
  };

  // Duplicate block within current page
  const handleDuplicateBlock = (blockId: string) => {
    const newId = createUid('blk');
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== currentPage.id) return p;
        const idx = p.blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return p;
        const orig = p.blocks[idx];
        const copy: PortfolioBlock = {
          ...JSON.parse(JSON.stringify(orig)),
          id: newId,
        };
        const nextBlocks = [...p.blocks];
        nextBlocks.splice(idx + 1, 0, copy);
        return { ...p, blocks: nextBlocks };
      })
    );
    setSelectedBlockId(newId);
  };

  // Delete block from current page
  const handleDeleteBlock = (blockId: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== currentPage.id) return p;
        return {
          ...p,
          blocks: p.blocks.filter((b) => b.id !== blockId),
        };
      })
    );
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  // Add a new page from the AddPageModal (Orientation + Blank/Template)
  const handleAddPageFromModal = (config: {
    orientation: 'portrait' | 'landscape';
    templateId: PageTemplateId | 'blank';
    title: string;
  }) => {
    const nextNum = pages.length + 1;
    const padded = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const pageSizeOverride: PageSizeId =
      config.orientation === 'landscape' ? 'a4-landscape' : 'a4-portrait';

    let newBlocks: PortfolioBlock[] = [];
    if (config.templateId !== 'blank') {
      newBlocks = createBlocksForTemplate(
        config.templateId,
        globalSettings.headingFont,
        globalSettings.bodyFont,
        globalSettings.monoFont
      );
    }

    const tplMeta =
      config.templateId !== 'blank'
        ? PAGE_TEMPLATES.find((t) => t.id === config.templateId)
        : null;

    const newPage: PortfolioPage = {
      id: createUid('page'),
      title: config.title || (tplMeta ? tplMeta.name : `Page ${padded}`),
      sectionLabel: `${padded} · ${tplMeta ? tplMeta.badge : 'EDITORIAL'}`,
      templateId: config.templateId !== 'blank' ? config.templateId : undefined,
      pageSizeOverride,
      hideHeader: config.templateId === 'cover-monograph',
      hideFooter: false,
      blocks: newBlocks,
    };

    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
    setSelectedBlockId(newBlocks[0]?.id || null);
  };

  // Add a new page with a chosen template
  const handleAddPageWithTemplate = (templateId: PageTemplateId = 'editorial-split') => {
    const tplMeta = PAGE_TEMPLATES.find((t) => t.id === templateId) || PAGE_TEMPLATES[1];
    const nextNum = pages.length + 1;
    const padded = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const newPage: PortfolioPage = {
      id: createUid('page'),
      title: tplMeta.name,
      sectionLabel: `${padded} · ${tplMeta.badge}`,
      templateId,
      hideHeader: templateId === 'cover-monograph',
      hideFooter: false,
      blocks: createBlocksForTemplate(
        templateId,
        globalSettings.headingFont,
        globalSettings.bodyFont,
        globalSettings.monoFont
      ),
    };

    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
    setSelectedBlockId(newPage.blocks[0]?.id || null);
  };

  // Apply template to current page
  const handleApplyTemplateToPage = (templateId: PageTemplateId) => {
    const tplMeta = PAGE_TEMPLATES.find((t) => t.id === templateId) || PAGE_TEMPLATES[0];
    const newBlocks = createBlocksForTemplate(
      templateId,
      globalSettings.headingFont,
      globalSettings.bodyFont,
      globalSettings.monoFont
    );
    handleUpdatePage({
      templateId,
      title: tplMeta.name,
      hideHeader: templateId === 'cover-monograph',
      blocks: newBlocks,
    });
    setSelectedBlockId(newBlocks[0]?.id || null);
  };

  // Move Page Up/Down in Sequence
  const handleMovePage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pages.length) return;
    setPages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIdx, 0, moved);
      return copy;
    });
  };

  // Drag and drop page reordering
  const handlePageDrop = (targetIndex: number) => {
    if (draggedPageIdx === null || draggedPageIdx === targetIndex) {
      setDraggedPageIdx(null);
      return;
    }
    setPages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(draggedPageIdx, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
    setDraggedPageIdx(null);
  };

  // Duplicate entire page
  const handleDuplicatePage = (index: number) => {
    const source = pages[index];
    if (!source) return;
    const clonedBlocks: PortfolioBlock[] = JSON.parse(JSON.stringify(source.blocks)).map(
      (b: PortfolioBlock) => ({
        ...b,
        id: createUid('blk'),
      })
    );
    const duplicatedPage: PortfolioPage = {
      ...JSON.parse(JSON.stringify(source)),
      id: createUid('page'),
      title: `${source.title} (Copy)`,
      blocks: clonedBlocks,
    };
    setPages((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, duplicatedPage);
      return next;
    });
    setActivePageId(duplicatedPage.id);
    setSelectedBlockId(duplicatedPage.blocks[0]?.id || null);
  };

  // Delete page (prevent deleting the last remaining page)
  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) return;
    const targetId = pages[index].id;
    const nextPages = pages.filter((_, i) => i !== index);
    setPages(nextPages);
    if (activePageId === targetId) {
      const fallbackPage = nextPages[Math.max(0, index - 1)] || nextPages[0];
      setActivePageId(fallbackPage.id);
      setSelectedBlockId(fallbackPage.blocks[0]?.id || null);
    }
  };

  // Update Global Document Settings
  const handleUpdateGlobalSettings = (patch: Partial<GlobalDocumentSettings>) => {
    setGlobalSettings((prev) => ({ ...prev, ...patch }));
  };

  // Apply Global Font Pairing across all blocks on all pages
  const handleApplyGlobalFontsToAllPages = (
    headingFont: string,
    bodyFont: string,
    monoFont: string
  ) => {
    loadGoogleFont(headingFont);
    loadGoogleFont(bodyFont);
    loadGoogleFont(monoFont);

    setGlobalSettings((prev) => ({
      ...prev,
      headingFont,
      bodyFont,
      monoFont,
    }));

    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        blocks: page.blocks.map((block) => ({
          ...block,
          textStyle: {
            ...block.textStyle,
            fontFamily:
              block.type === 'heading' || block.type === 'pull-quote'
                ? headingFont
                : block.type === 'image' || block.type === 'dual-image'
                ? monoFont
                : bodyFont,
          },
          ...(block.secondaryTextStyle
            ? {
                secondaryTextStyle: {
                  ...block.secondaryTextStyle,
                  fontFamily: bodyFont,
                },
              }
            : {}),
          ...(block.kickerTextStyle
            ? {
                kickerTextStyle: {
                  ...block.kickerTextStyle,
                  fontFamily: monoFont,
                },
              }
            : {}),
        })),
      }))
    );
  };

  // Export/Save Portfolio Project as JSON
  const handleExportProjectJson = () => {
    const blob = new Blob([JSON.stringify({ pages, globalSettings }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'foliopress-project.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Portfolio Project JSON
  const handleImportProjectJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed.pages) && parsed.pages.length > 0 && parsed.globalSettings) {
          setPages(parsed.pages);
          setGlobalSettings(parsed.globalSettings);
          setActivePageId(parsed.pages[0].id);
          setSelectedBlockId(parsed.pages[0].blocks[0]?.id || null);
        }
      } catch {
        // Ignore invalid JSON
      }
    };
    reader.readAsText(file);
  };

  // Reset to initial curated 4-page monograph
  const handleResetDemo = () => {
    setPages(INITIAL_PAGES);
    setGlobalSettings(INITIAL_GLOBAL_SETTINGS);
    setActivePageId(INITIAL_PAGES[0].id);
    setSelectedBlockId(INITIAL_PAGES[0].blocks[0]?.id || null);
  };

  const handleApplyGlobalTheme = (themeId: string) => {
    const theme = GLOBAL_THEMES.find((t) => t.id === themeId);
    if (!theme) return;
    setGlobalSettings((prev) => ({
      ...prev,
      themeId: theme.id,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      mutedTextColor: theme.mutedTextColor,
      accentColor: theme.accentColor,
      borderColor: theme.borderColor,
    }));
  };

  const handleApplyStarterKit = (kit: StarterKit) => {
    const clonedPages: PortfolioPage[] = JSON.parse(JSON.stringify(kit.pages));
    const nextSettings: GlobalDocumentSettings = {
      ...globalSettings,
      pageSize: kit.pageSize,
      portfolioTitle: kit.name,
      headerLeftText: kit.name,
      footerLeftText: kit.author,
    };
    setPages(clonedPages);
    setGlobalSettings(nextSettings);
    pushHistory(clonedPages);
    setActivePageId(clonedPages[0]?.id || 'page-1');
    setSelectedBlockId(clonedPages[0]?.blocks[0]?.id || null);
    setIsStarterKitsModalOpen(false);
  };

  const handleSelectStockPlate = (plate: StockVisualPlate) => {
    if (
      selectedBlock &&
      (selectedBlock.type === 'image-full' ||
        selectedBlock.type === 'split-showcase' ||
        selectedBlock.type === 'device-mockup' ||
        selectedBlock.type === 'before-after')
    ) {
      handleUpdateBlock(selectedBlock.id, { imageUrl: plate.url });
    } else if (selectedBlock && selectedBlock.type === 'multi-photo-grid') {
      const grid = selectedBlock.gridImages || [];
      handleUpdateBlock(selectedBlock.id, {
        gridImages: [
          ...grid,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            url: plate.url,
            caption: `${plate.title} · ${plate.caption}`,
          },
        ],
      });
    } else {
      const newBlock: PortfolioBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: 'image-full',
        imageUrl: plate.url,
        caption: `${plate.title} — ${plate.caption}`,
        imageHeightPx: 460,
        imageObjectFit: 'cover',
      };
      handleUpdatePage({
        blocks: [...currentPage.blocks, newBlock],
      });
      setSelectedBlockId(newBlock.id);
    }
    setIsStockLibraryOpen(false);
  };

  const handleInsertDroppedImages = (imageUrls: string[]) => {
    if (!imageUrls || imageUrls.length === 0) return;

    if (imageUrls.length === 1) {
      const newBlock: PortfolioBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: 'image-full',
        imageUrl: imageUrls[0],
        caption: 'Imported Plate — Visual Study',
        imageHeightPx: 440,
        imageObjectFit: 'cover',
      };
      handleUpdatePage({
        blocks: [...currentPage.blocks, newBlock],
      });
      setSelectedBlockId(newBlock.id);
    } else {
      const cols = imageUrls.length === 2 ? 2 : imageUrls.length <= 4 ? 2 : 3;
      const newBlock: PortfolioBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: 'multi-photo-grid',
        gridColumns: cols,
        gridGapPx: 16,
        gridAspectRatio: '4/3',
        gridImages: imageUrls.map((url, i) => ({
          id: `img-${Date.now()}-${i}`,
          url,
          caption: `Plate ${i + 1} — Visual Detail`,
        })),
      };
      handleUpdatePage({
        blocks: [...currentPage.blocks, newBlock],
      });
      setSelectedBlockId(newBlock.id);
    }
  };

  const commandItems: CommandItem[] = [
    {
      id: 'cmd-export-pdf',
      category: 'Export & Present',
      title: 'Export High-Resolution PDF',
      subtitle: '300 DPI Print, Email-ready or Multi-Page ZIP Image Pack',
      shortcut: '⌘E',
      icon: Download,
      action: () => setIsExportModalOpen(true),
    },
    {
      id: 'cmd-present',
      category: 'Export & Present',
      title: 'Fullscreen Client Slide Deck',
      subtitle: 'Open presentation mode with keyboard arrow navigation',
      shortcut: 'F5',
      icon: Play,
      action: () => setIsPresentationOpen(true),
    },
    {
      id: 'cmd-starter-kits',
      category: 'Starter Kits',
      title: '1-Click Multi-Page Starter Kits',
      subtitle: 'Browse Monograph, Showcase, Pitch & Competition Decks',
      icon: Sparkles,
      action: () => setIsStarterKitsModalOpen(true),
    },
    {
      id: 'cmd-stock-library',
      category: 'Pages & Templates',
      title: 'Architectural Stock Visuals & Materials Library',
      subtitle: 'Travertine, Concrete, Timber joinery, and Light studies',
      icon: Layers,
      action: () => setIsStockLibraryOpen(true),
    },
    {
      id: 'cmd-add-page',
      category: 'Pages & Templates',
      title: 'Add New Page',
      subtitle: 'Choose Orientation (Vertical/Horizontal) and Template',
      shortcut: '⌘N',
      icon: FilePlus,
      action: () => setIsAddPageModalOpen(true),
    },
    {
      id: 'cmd-view-templates',
      category: 'Pages & Templates',
      title: 'Browse Page Templates',
      subtitle: 'Vertical and Horizontal editorial page layouts',
      icon: LayoutGrid,
      action: () => {
        setWorkspaceMode('single');
        setInspectorTab('page');
      },
    },
    {
      id: 'cmd-orient-portrait',
      category: 'Canvas & View',
      title: 'Set Document Orientation: Vertical (Portrait A4)',
      subtitle: 'Standard architectural monograph format (210 × 297 mm)',
      icon: ArrowUp,
      action: () => handleToggleOrientation('portrait'),
    },
    {
      id: 'cmd-orient-landscape',
      category: 'Canvas & View',
      title: 'Set Document Orientation: Horizontal (Landscape A4)',
      subtitle: 'Editorial project showcase and exhibition format (297 × 210 mm)',
      icon: ArrowDown,
      action: () => handleToggleOrientation('landscape'),
    },
    {
      id: 'cmd-view-canvas',
      category: 'Canvas & View',
      title: 'Switch to Single Page Canvas',
      subtitle: 'Focused interactive page editing',
      icon: Maximize2,
      action: () => setWorkspaceMode('single'),
    },
    {
      id: 'cmd-view-spread',
      category: 'Canvas & View',
      title: 'Switch to Spread Reorder View',
      subtitle: 'Multi-page overview and drag-and-drop sequence management',
      icon: LayoutGrid,
      action: () => setWorkspaceMode('spread'),
    },
    {
      id: 'cmd-view-clean',
      category: 'Canvas & View',
      title: 'Toggle Clean Preview',
      subtitle: 'Hide all UI toolbars and inspect full layout cleanly',
      icon: Eye,
      action: () => setWorkspaceMode(workspaceMode === 'preview' ? 'single' : 'preview'),
    },
    {
      id: 'cmd-zoom-reset',
      category: 'Canvas & View',
      title: 'Reset Canvas Zoom to 100%',
      subtitle: 'View page at native 1:1 scale',
      icon: Maximize2,
      action: () => setCanvasZoom(1),
    },
    {
      id: 'cmd-zoom-in',
      category: 'Canvas & View',
      title: 'Zoom In Canvas (+10%)',
      icon: Plus,
      action: () => setCanvasZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(2))),
    },
    {
      id: 'cmd-zoom-out',
      category: 'Canvas & View',
      title: 'Zoom Out Canvas (-10%)',
      icon: Minus,
      action: () => setCanvasZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2))),
    },
    ...GLOBAL_THEMES.map((theme) => ({
      id: `cmd-theme-${theme.id}`,
      category: 'Archival Themes' as const,
      title: `Apply Theme: ${theme.name}`,
      subtitle: `${theme.primaryInk} on ${theme.paperBackground} (${theme.headingFont})`,
      icon: FolderOpen,
      action: () => handleApplyGlobalTheme(theme.id),
    })),
    ...FONT_PAIRINGS.map((pairing) => ({
      id: `cmd-font-pairing-${pairing.id}`,
      category: 'Typography' as const,
      title: `Font Pairing: ${pairing.name}`,
      subtitle: `${pairing.headingFont} + ${pairing.bodyFont} (${pairing.style})`,
      icon: Type,
      action: () => {
        handleApplyGlobalFontsToAllPages(pairing.headingFont, pairing.bodyFont, pairing.monoFont);
      },
    })),
  ];

  return (
    <div dir="ltr" className="h-screen w-screen overflow-hidden flex flex-col bg-[#F1F0EC] text-stone-900">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="h-14 bg-white border-b border-stone-200/90 px-6 flex items-center justify-between gap-8 shrink-0 no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            setWorkspaceMode('single');
          }}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          className="text-2xl font-semibold tracking-tight text-stone-950 whitespace-nowrap shrink-0"
        >
          FolioPress
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-stone-600">
          <button
            type="button"
            onClick={() => setWorkspaceMode('single')}
            className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
              workspaceMode === 'single'
                ? 'text-stone-950 underline underline-offset-4 decoration-stone-900 decoration-1'
                : ''
            }`}
          >
            Page Canvas
          </button>
          <button
            type="button"
            onClick={() => setWorkspaceMode('spread')}
            className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
              workspaceMode === 'spread'
                ? 'text-stone-950 underline underline-offset-4 decoration-stone-900 decoration-1'
                : ''
            }`}
          >
            Spread Reorder ({pages.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setWorkspaceMode('single');
              setInspectorTab('page');
            }}
            className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
              inspectorTab === 'page' && workspaceMode === 'single'
                ? 'text-stone-950 underline underline-offset-4 decoration-stone-900 decoration-1'
                : ''
            }`}
          >
            Page Templates
          </button>
          <button
            type="button"
            onClick={() => {
              setWorkspaceMode('single');
              setInspectorTab('global');
            }}
            className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
              inspectorTab === 'global' && workspaceMode === 'single'
                ? 'text-stone-950 underline underline-offset-4 decoration-stone-900 decoration-1'
                : ''
            }`}
          >
            Global Styling
          </button>
          <button
            type="button"
            onClick={() =>
              setWorkspaceMode(workspaceMode === 'preview' ? 'single' : 'preview')
            }
            className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
              workspaceMode === 'preview'
                ? 'text-stone-950 underline underline-offset-4 decoration-stone-900 decoration-1'
                : ''
            }`}
          >
            Clean Preview
          </button>
        </nav>

        {/* Zone 3: Actions (Command Palette, Starter Kits, Stock Library, Undo, Redo, Present, Export PDF) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick-Access Command Palette */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Open Command Palette (⌘K / Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-medium">Actions</span>
            <kbd className="text-[10px] font-mono bg-white px-1 py-0.2 rounded border border-stone-200 text-stone-500">
              ⌘K
            </kbd>
          </button>

          {/* Quick-Access Starter Kits */}
          <button
            type="button"
            onClick={() => setIsStarterKitsModalOpen(true)}
            className="px-2.5 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
            title="Browse 1-Click Multi-Page Starter Kits"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span className="hidden sm:inline">Starter Kits</span>
          </button>

          {/* Quick-Access Stock Visuals */}
          <button
            type="button"
            onClick={() => setIsStockLibraryOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
            title="Architectural Materials & Visuals Stock Library"
          >
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            <span>Stock Library</span>
          </button>

          <div className="flex items-center gap-0.5 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              type="button"
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              className="p-1.5 rounded hover:bg-white text-stone-700 hover:text-stone-900 transition-colors disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z / Cmd+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              className="p-1.5 rounded hover:bg-white text-stone-700 hover:text-stone-900 transition-colors disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y / Cmd+Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPresentationOpen(true)}
            className="px-3 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs"
            title="Open Fullscreen Presentation Deck (F5 / Alt+P)"
          >
            <Play className="w-3 h-3 text-indigo-600 fill-indigo-600" />
            <span className="hidden sm:inline">Present</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export High-Res PDF</span>
          </button>
        </div>
      </header>

      {/* Typography & Block Insertion Ribbon (Hidden in Full Clean Preview) */}
      {workspaceMode !== 'preview' && (
        <div className="no-print shrink-0">
          <TextFormatToolbar
            selectedBlock={selectedBlock}
            activeTextTarget={activeTextTarget}
            onSelectTextTarget={setActiveTextTarget}
            onUpdateTextStyle={handleUpdateTextStyle}
            onAddBlock={handleAddBlock}
            onAiPolishText={handleAiPolishText}
            defaultHeadingFont={globalSettings.headingFont}
          />
        </div>
      )}

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden no-print">
        {/* LEFT SIDEBAR: Page-by-Page Manager & Reordering */}
        {workspaceMode !== 'preview' && (
          <aside className="w-64 bg-white border-r border-stone-200/90 flex flex-col h-full shrink-0 select-none">
            <div className="p-3.5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-stone-900">Portfolio Pages</h2>
                <p className="text-[11px] text-stone-500 tabular-nums">
                  {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} · Drag to reorder
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPageModalOpen(true)}
                className="px-2.5 py-1.5 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>+ Page</span>
              </button>
            </div>

            {/* Page List with Drag-and-Drop & Up/Down Reordering */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {pages.map((p, idx) => {
                const isActive = p.id === currentPage.id;
                const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
                return (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => setDraggedPageIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handlePageDrop(idx)}
                    onClick={() => {
                      setActivePageId(p.id);
                      setSelectedBlockId(p.blocks[0]?.id || null);
                      if (workspaceMode === 'spread') {
                        setWorkspaceMode('single');
                      }
                    }}
                    className={`group relative p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'border-stone-900 bg-stone-900/[0.04] shadow-2xs'
                        : 'border-stone-200/90 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <GripVertical className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0 cursor-grab" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-mono font-semibold text-stone-400 tabular-nums">
                              {numStr}
                            </span>
                            <span className="text-xs font-semibold text-stone-900 truncate">
                              {p.title}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5 truncate">
                            {p.blocks.length} blocks · {p.sectionLabel}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Reorder / Duplicate / Delete Controls */}
                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-stone-500">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMovePage(idx, 'up');
                          }}
                          title="Move Page Up"
                          className="p-1 hover:text-stone-900 hover:bg-stone-100 rounded disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === pages.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMovePage(idx, 'down');
                          }}
                          title="Move Page Down"
                          className="p-1 hover:text-stone-900 hover:bg-stone-100 rounded disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicatePage(idx);
                          }}
                          title="Duplicate Page"
                          className="p-1 hover:text-stone-900 hover:bg-stone-100 rounded"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={pages.length <= 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(idx);
                          }}
                          title="Delete Page"
                          className="p-1 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Project Save/Load & Spread Mode Actions */}
            <div className="p-3 border-t border-stone-200 bg-stone-50/70 space-y-2">
              <button
                type="button"
                onClick={() =>
                  setWorkspaceMode(workspaceMode === 'spread' ? 'single' : 'spread')
                }
                className="w-full py-1.5 px-3 text-xs font-medium text-stone-800 bg-white border border-stone-200 rounded-md hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>
                  {workspaceMode === 'spread'
                    ? 'Return to Single Page'
                    : 'Spread Overview & Reorder'}
                </span>
              </button>

              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={handleExportProjectJson}
                  title="Save Project JSON File"
                  className="py-1.5 px-2 text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded flex items-center justify-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
                <label
                  title="Load Project JSON File"
                  className="py-1.5 px-2 text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FolderOpen className="w-3 h-3" />
                  <span>Load</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportProjectJson}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  title="Reset to Sample Monograph"
                  className="py-1.5 px-2 text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* CENTER WORKSPACE VIEWPORT */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#E9E7E2]">
          {/* Sub-Toolbar for Zoom, Page Stepper & Mode Switch */}
          <div className="h-10 px-5 border-b border-stone-300/80 bg-[#F3F2EE] flex items-center justify-between text-xs text-stone-600 shrink-0 select-none">
            <div className="flex items-center gap-3 tabular-nums">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={activePageIndex === 0}
                  onClick={() => setActivePageId(pages[activePageIndex - 1].id)}
                  className="p-1 rounded hover:bg-stone-200/80 disabled:opacity-30"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-stone-900 px-1">
                  Page {activePageIndex + 1} of {pages.length}
                </span>
                <button
                  type="button"
                  disabled={activePageIndex === pages.length - 1}
                  onClick={() => setActivePageId(pages[activePageIndex + 1].id)}
                  className="p-1 rounded hover:bg-stone-200/80 disabled:opacity-30"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 truncate max-w-xs">{currentPage.title}</span>
            </div>

            {/* Center: Quick Orientation Switcher (Portrait ↔ Landscape) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white border border-stone-200/90 rounded-md p-0.5">
                <button
                  type="button"
                  title="Switch to Portrait"
                  onClick={() => handleToggleOrientation('portrait')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded flex items-center gap-1.5 transition-all ${
                    !isLandscape
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                  </svg>
                  <span className="hidden sm:inline">Portrait</span>
                </button>
                <button
                  type="button"
                  title="Switch to Landscape"
                  onClick={() => handleToggleOrientation('landscape')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded flex items-center gap-1.5 transition-all ${
                    isLandscape
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                  </svg>
                  <span className="hidden sm:inline">Landscape</span>
                </button>
              </div>

              {/* Format Badge that opens Global Tab */}
              <button
                type="button"
                onClick={() => setInspectorTab('global')}
                className="hidden xl:flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 bg-white/70 border border-stone-200/70 hover:bg-white px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
                title="Click to choose from all page size presets in Global Styling"
              >
                <span>{currentSizeSpec.label}</span>
                <span className="text-stone-400">({currentSizeSpec.dimensionsLabel})</span>
              </button>
            </div>

            {/* Right: Zoom Controls & Preview Mode Toggle */}
            <div className="flex items-center gap-2 tabular-nums">
              {workspaceMode !== 'spread' && (
                <div className="flex items-center gap-1 bg-white border border-stone-200/90 rounded-md px-1.5 py-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      setCanvasZoom((z) => Math.max(0.45, Number((z - 0.08).toFixed(2))))
                    }
                    className="p-1 hover:text-stone-900"
                    title="Zoom Out"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] font-medium text-stone-800 min-w-[42px] text-center">
                    {Math.round(canvasZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCanvasZoom((z) => Math.min(1.15, Number((z + 0.08).toFixed(2))))
                    }
                    className="p-1 hover:text-stone-900"
                    title="Zoom In"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasZoom(0.78)}
                    className="p-1 text-stone-400 hover:text-stone-900 border-l border-stone-200 pl-1.5"
                    title="Reset Fit Zoom"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setWorkspaceMode(workspaceMode === 'preview' ? 'single' : 'preview')
                }
                className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  workspaceMode === 'preview'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{workspaceMode === 'preview' ? 'Exit Preview' : 'Clean Preview'}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Canvas Stage */}
          <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
            {workspaceMode === 'spread' ? (
              /* SPREAD OVERVIEW & VISUAL REORDERING GRID */
              <div className="max-w-6xl w-full space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-stone-900">
                      Portfolio Spread Overview & Page Sequence
                    </h2>
                    <p className="text-xs text-stone-500">
                      Drag any page card or use the arrow buttons to change page order, duplicate, or
                      insert new pages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddPageModalOpen(true)}
                    className="px-3.5 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 flex items-center gap-1.5"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>Add New Page</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
                  {pages.map((p, idx) => {
                    const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
                    return (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={() => setDraggedPageIdx(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handlePageDrop(idx)}
                        className="bg-white/80 border border-stone-200/90 rounded-xl p-4 flex flex-col items-center gap-3 shadow-xs hover:border-stone-400 transition-all"
                      >
                        <div className="w-full flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-stone-400 tabular-nums">
                              PAGE {numStr}
                            </span>
                            <span className="font-semibold text-stone-900">{p.title}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMovePage(idx, 'up')}
                              className="p-1 hover:bg-stone-200 rounded disabled:opacity-30"
                              title="Move Earlier"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === pages.length - 1}
                              onClick={() => handleMovePage(idx, 'down')}
                              className="p-1 hover:bg-stone-200 rounded disabled:opacity-30"
                              title="Move Later"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicatePage(idx)}
                              className="p-1 hover:bg-stone-200 rounded"
                              title="Duplicate Page"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={pages.length <= 1}
                              onClick={() => handleDeletePage(idx)}
                              className="p-1 hover:bg-red-50 hover:text-red-600 rounded disabled:opacity-30"
                              title="Delete Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Scaled Live Page Thumbnail */}
                        <div
                          onClick={() => {
                            setActivePageId(p.id);
                            setWorkspaceMode('single');
                          }}
                          className="cursor-pointer ring-1 ring-stone-200 hover:ring-stone-900 transition-all overflow-hidden"
                        >
                          <PageCanvas
                            page={p}
                            pageIndex={idx}
                            totalPages={pages.length}
                            globalSettings={globalSettings}
                            selectedBlockId={null}
                            onSelectBlock={() => {}}
                            onUpdateBlock={() => {}}
                            onMoveBlock={() => {}}
                            onDuplicateBlock={() => {}}
                            onDeleteBlock={() => {}}
                            isExportMode={true}
                            scale={0.34}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActivePageId(p.id);
                            setWorkspaceMode('single');
                          }}
                          className="w-full py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
                        >
                          Edit Page {numStr} in Canvas
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* SINGLE PAGE INTERACTIVE OR CLEAN PREVIEW CANVAS */
              <div className="pb-16 flex flex-col items-center">
                <PageCanvas
                  page={currentPage}
                  pageIndex={activePageIndex}
                  totalPages={pages.length}
                  globalSettings={globalSettings}
                  selectedBlockId={selectedBlockId}
                  activeTextTarget={activeTextTarget}
                  onSelectTextTarget={setActiveTextTarget}
                  onSelectBlock={handleSelectBlock}
                  onUpdateBlock={handleUpdateBlock}
                  onMoveBlock={handleMoveBlock}
                  onDuplicateBlock={handleDuplicateBlock}
                  onDeleteBlock={handleDeleteBlock}
                  onInsertDroppedImages={handleInsertDroppedImages}
                  isExportMode={workspaceMode === 'preview'}
                  scale={canvasZoom}
                />
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: Element, Page Template & Global Formatting Inspector */}
        {workspaceMode !== 'preview' && (
          <InspectorSidebar
            activeTab={inspectorTab}
            onTabChange={setInspectorTab}
            currentPage={currentPage}
            selectedBlock={selectedBlock}
            activeTextTarget={activeTextTarget}
            onSelectTextTarget={setActiveTextTarget}
            globalSettings={globalSettings}
            onUpdateBlock={handleUpdateBlock}
            onUpdateTextStyle={handleUpdateTextStyle}
            onUpdateImageStyle={handleUpdateImageStyle}
            onUpdatePage={handleUpdatePage}
            onApplyTemplateToPage={handleApplyTemplateToPage}
            onAddPageWithTemplate={handleAddPageWithTemplate}
            onUpdateGlobalSettings={handleUpdateGlobalSettings}
            onApplyGlobalFontsToAllPages={handleApplyGlobalFontsToAllPages}
            onOpenStockLibrary={() => setIsStockLibraryOpen(true)}
          />
        )}
      </div>

      {/* 1-Click Multi-Page Starter Kits Modal */}
      <StarterKitsModal
        isOpen={isStarterKitsModalOpen}
        onClose={() => setIsStarterKitsModalOpen(false)}
        onApplyKit={handleApplyStarterKit}
      />

      {/* Curated Architectural Visuals & Materials Library */}
      <StockLibraryModal
        isOpen={isStockLibraryOpen}
        onClose={() => setIsStockLibraryOpen(false)}
        onSelectPlate={handleSelectStockPlate}
      />

      {/* Spotlight Command Palette (Cmd + K / Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commandItems}
      />

      {/* High-Resolution PDF Export Modal */}
      <PdfExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        pages={pages}
        globalSettings={globalSettings}
      />

      {/* Add Page Modal (Orientation + Template Picker) */}
      <AddPageModal
        isOpen={isAddPageModalOpen}
        onClose={() => setIsAddPageModalOpen(false)}
        onAddPage={handleAddPageFromModal}
        suggestedPageNumber={pages.length + 1}
      />

      {/* Fullscreen Client Presentation & Slide Deck View */}
      <PresentationView
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        pages={pages}
        initialPageIndex={activePageIndex}
        globalSettings={globalSettings}
      />

      {/* Print-Only Container for Native Browser Vector Print-to-PDF */}
      <div className="hidden print-only-container">
        {pages.map((p, idx) => (
          <div key={p.id} className="portfolio-print-page">
            <PageCanvas
              page={p}
              pageIndex={idx}
              totalPages={pages.length}
              globalSettings={globalSettings}
              selectedBlockId={null}
              onSelectBlock={() => {}}
              onUpdateBlock={() => {}}
              onMoveBlock={() => {}}
              onDuplicateBlock={() => {}}
              onDeleteBlock={() => {}}
              isExportMode={true}
              scale={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
