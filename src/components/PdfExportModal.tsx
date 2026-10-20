import React, { useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { zipSync } from 'fflate';
import { Archive, CheckCircle2, Download, FileText, Loader2, Printer, X } from 'lucide-react';
import { PAGE_SIZE_PRESETS } from '../data/editorialAssets';
import { GlobalDocumentSettings, PortfolioPage } from '../types/portfolio';
import { PageCanvas } from './PageCanvas';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PortfolioPage[];
  globalSettings: GlobalDocumentSettings;
}

type QualityPreset = 'print-300' | 'email-180' | 'web-120';

interface QualitySpec {
  id: QualityPreset;
  name: string;
  dpiLabel: string;
  description: string;
  pixelRatio: number;
  jpegQuality: number;
}

const QUALITY_SPECS: QualitySpec[] = [
  {
    id: 'print-300',
    name: 'Print Master Quality',
    dpiLabel: '300+ DPI · 3x Supersampled',
    description: 'Archival resolution for physical printing, jury submissions, and large displays.',
    pixelRatio: 3,
    jpegQuality: 0.98,
  },
  {
    id: 'email-180',
    name: 'Email & Job Application Ready',
    dpiLabel: '180 DPI · Balanced <10MB',
    description: 'Crisp typography and photography optimized for firm job applications and email attachments.',
    pixelRatio: 1.8,
    jpegQuality: 0.88,
  },
  {
    id: 'web-120',
    name: 'Compact Web Preview',
    dpiLabel: '120 DPI · Lightweight',
    description: 'Fast file size for rapid online sharing, cloud messaging, and portal uploads.',
    pixelRatio: 1.2,
    jpegQuality: 0.78,
  },
];

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  pages,
  globalSettings,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<QualityPreset>('print-300');
  const [filename, setFilename] = useState<string>(
    () =>
      `${globalSettings.portfolioTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'portfolio-monograph'}.pdf`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [currentStepPage, setCurrentStepPage] = useState<number>(0);
  const [exportDone, setExportDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const exportStageRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const sizeSpec =
    PAGE_SIZE_PRESETS.find((s) => s.id === globalSettings.pageSize) || PAGE_SIZE_PRESETS[0];
  const qualitySpec =
    QUALITY_SPECS.find((q) => q.id === selectedQuality) || QUALITY_SPECS[0];

  const handleGeneratePdf = async () => {
    if (!exportStageRef.current || pages.length === 0) return;
    setIsExporting(true);
    setExportDone(false);
    setErrorMessage(null);
    setCurrentStepPage(1);

    try {
      // Ensure web fonts are ready before rasterizing
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const getPageSpec = (page: PortfolioPage) => {
        const targetId = page.pageSizeOverride || globalSettings.pageSize;
        return PAGE_SIZE_PRESETS.find((s) => s.id === targetId) || PAGE_SIZE_PRESETS[0];
      };

      const firstPageSpec = getPageSpec(pages[0]);
      const pdf = new jsPDF({
        orientation: firstPageSpec.orientation,
        unit: 'mm',
        format: [firstPageSpec.widthMm, firstPageSpec.heightMm],
        compress: true,
      });

      const pageElements = exportStageRef.current.querySelectorAll('.export-page-node');

      for (let i = 0; i < pageElements.length; i++) {
        setCurrentStepPage(i + 1);
        const el = pageElements[i] as HTMLElement;
        const pageSpec = getPageSpec(pages[i]);

        // Small pause so React UI updates progress indicator smoothly
        await new Promise((r) => setTimeout(r, 60));

        const dataUrl = await toJpeg(el, {
          quality: qualitySpec.jpegQuality,
          pixelRatio: qualitySpec.pixelRatio,
          backgroundColor: pages[i].backgroundColor || globalSettings.backgroundColor,
          cacheBust: false,
        });

        if (i > 0) {
          pdf.addPage([pageSpec.widthMm, pageSpec.heightMm], pageSpec.orientation);
        }

        pdf.addImage(
          dataUrl,
          'JPEG',
          0,
          0,
          pageSpec.widthMm,
          pageSpec.heightMm,
          undefined,
          'FAST'
        );
      }

      const cleanName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      pdf.save(cleanName);
      setExportDone(true);
    } catch (err) {
      console.error('PDF export error:', err);
      setErrorMessage(
        'Could not rasterize one of the page assets. Try using Vector Print or check custom images.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    if (!exportStageRef.current || pages.length === 0) return;
    setIsExportingZip(true);
    setExportDone(false);
    setErrorMessage(null);
    setCurrentStepPage(1);

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const pageElements = exportStageRef.current.querySelectorAll('.export-page-node');
      const zipEntries: Record<string, Uint8Array> = {};

      for (let i = 0; i < pageElements.length; i++) {
        setCurrentStepPage(i + 1);
        const el = pageElements[i] as HTMLElement;

        await new Promise((r) => setTimeout(r, 60));

        const dataUrl = await toJpeg(el, {
          quality: qualitySpec.jpegQuality,
          pixelRatio: qualitySpec.pixelRatio,
          backgroundColor: pages[i].backgroundColor || globalSettings.backgroundColor,
          cacheBust: false,
        });

        const base64 = dataUrl.split(',')[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let b = 0; b < binary.length; b++) {
          bytes[b] = binary.charCodeAt(b);
        }

        const paddedIndex = String(i + 1).padStart(2, '0');
        const pageTitleClean = (pages[i].title || `page-${paddedIndex}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        zipEntries[`page-${paddedIndex}-${pageTitleClean}.jpg`] = bytes;
      }

      const zipped = zipSync(zipEntries);
      const blob = new Blob([zipped], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename.replace(/\.pdf$/i, '')}-image-pack.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setExportDone(true);
    } catch (err) {
      console.error('ZIP export error:', err);
      setErrorMessage('Could not generate images zip. Please try again.');
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleNativeVectorPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 no-print">
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-stone-900" />
            <h2 className="text-sm font-semibold text-stone-900">
              Export High-Resolution Portfolio PDF
            </h2>
          </div>
          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Document Summary Strip */}
          <div className="flex items-center justify-between text-xs text-stone-600 pb-4 border-b border-stone-100 tabular-nums">
            <span>
              Format: <strong className="text-stone-900">{sizeSpec.label}</strong> (
              {sizeSpec.dimensionsLabel})
            </span>
            <span>·</span>
            <span>
              Total Length: <strong className="text-stone-900">{pages.length} Pages</strong>
            </span>
          </div>

          {/* File Name */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Output PDF Filename
            </label>
            <input
              type="text"
              dir="ltr"
              disabled={isExporting}
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full h-9 px-3 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Resolution Quality Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-stone-700">
              Resolution & Sampling Quality
            </label>
            <div className="space-y-2">
              {QUALITY_SPECS.map((spec) => {
                const active = selectedQuality === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    disabled={isExporting}
                    onClick={() => setSelectedQuality(spec.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all flex items-start justify-between gap-3 ${
                      active
                        ? 'border-stone-900 bg-stone-900/5'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-stone-900">{spec.name}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{spec.description}</div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-600 whitespace-nowrap shrink-0 tabular-nums">
                      {spec.dpiLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Rendering Progress */}
          {isExporting && (
            <div className="p-3.5 rounded-lg bg-stone-100 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-stone-900 tabular-nums">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-900" />
                  <span>
                    Rendering Page {currentStepPage} of {pages.length} at {qualitySpec.pixelRatio}x
                    scale...
                  </span>
                </span>
                <span>{Math.round((currentStepPage / pages.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(currentStepPage / pages.length) * 100}%` }}
                  className="h-full bg-stone-900 transition-all duration-200"
                />
              </div>
            </div>
          )}

          {exportDone && !isExporting && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Your high-resolution PDF ({pages.length} pages) has been generated and downloaded.
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isExporting || isExportingZip}
              onClick={handleNativeVectorPrint}
              className="px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Vector Print</span>
            </button>

            <button
              type="button"
              disabled={isExporting || isExportingZip}
              onClick={handleExportZip}
              className="px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
            >
              {isExportingZip ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
                  <span>Zipping Pages...</span>
                </>
              ) : (
                <>
                  <Archive className="w-3.5 h-3.5 text-stone-600" />
                  <span>Image Pack (ZIP)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isExporting || isExportingZip}
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isExporting || isExportingZip}
              onClick={handleGeneratePdf}
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap shadow-xs"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Building PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Offscreen Unscaled Render Stage for Exact High-DPI Capture */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          pointerEvents: 'none',
          opacity: 1,
        }}
      >
        <div ref={exportStageRef}>
          {pages.map((p, idx) => (
            <div key={p.id} className="export-page-node">
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
    </div>
  );
};
