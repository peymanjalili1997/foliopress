import React, { useRef, useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  Download,
  Edit2,
  FilePlus,
  Files,
  FolderPlus,
  Layout,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { GlobalDocumentSettings, PortfolioBlock, PortfolioDocument, PortfolioPage } from '../types/portfolio';
import { PAGE_SIZE_PRESETS } from '../data/editorialAssets';
import { PageCanvas } from './PageCanvas';

interface ProjectsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: PortfolioDocument[];
  activeDocId: string;
  onSelectDocument: (docId: string) => void;
  onCreateDocument: (
    name?: string,
    templatePages?: PortfolioPage[],
    templateSettings?: GlobalDocumentSettings
  ) => void;
  onDuplicateDocument: (docId: string) => void;
  onRenameDocument: (docId: string, newName: string) => void;
  onDeleteDocument: (docId: string) => void;
  onExportDocumentJson: (docId: string) => void;
  onImportDocumentJson: (file: File) => void;
  onOpenStarterKits: () => void;
}

export const ProjectsManagerModal: React.FC<ProjectsManagerModalProps> = ({
  isOpen,
  onClose,
  documents,
  activeDocId,
  onSelectDocument,
  onCreateDocument,
  onDuplicateDocument,
  onRenameDocument,
  onDeleteDocument,
  onExportDocumentJson,
  onImportDocumentJson,
  onOpenStarterKits,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const startRename = (doc: PortfolioDocument) => {
    setEditingDocId(doc.id);
    setEditingName(doc.name);
  };

  const commitRename = (docId: string) => {
    if (editingName.trim()) {
      onRenameDocument(docId, editingName.trim());
    }
    setEditingDocId(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportDocumentJson(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      {/* Hidden File Input for JSON Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="bg-[#FAF8F5] border border-stone-300 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden text-stone-900">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Files className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-950">
                Portfolio Projects & Documents
              </h2>
              <p className="text-xs text-stone-500">
                {documents.length} {documents.length === 1 ? 'project document' : 'project documents'} · Auto-saved locally in browser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Import portfolio from .json file"
            >
              <Upload className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Import JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStarterKits();
              }}
              className="px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Create from pre-designed starter kits"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Starter Kits</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onCreateDocument();
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Create new blank portfolio project"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Portfolio</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Statistics Bar */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4 shrink-0 text-xs text-stone-500">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter portfolios by project title..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
            <span>Showing {filteredDocs.length} of {documents.length}</span>
          </div>
        </div>

        {/* Scrollable Document Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredDocs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Files className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-sm font-medium text-stone-700">No matching portfolio found</p>
              <p className="text-xs text-stone-400">
                Try a different search query or click "New Portfolio" to create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocs.map((doc) => {
                const isActive = doc.id === activeDocId;
                const pageCount = (doc.pages || []).length;
                const firstPage = doc.pages[0];
                const sizePreset = PAGE_SIZE_PRESETS.find(
                  (p) => p.id === (firstPage?.pageSizeOverride || doc.globalSettings.pageSize)
                ) || PAGE_SIZE_PRESETS[1];

                return (
                  <div
                    key={doc.id}
                    className={`bg-white rounded-xl border flex flex-col justify-between overflow-hidden transition-all shadow-xs group ${
                      isActive
                        ? 'border-stone-900 ring-2 ring-stone-900/15'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {/* Top Preview Canvas Surface */}
                    <div
                      onClick={() => {
                        onSelectDocument(doc.id);
                        onClose();
                      }}
                      className="cursor-pointer relative aspect-16/10 bg-[#EFECE6] border-b border-stone-200/80 flex items-center justify-center p-3 overflow-hidden group/canvas"
                    >
                      {/* Active Indicator Badge */}
                      {isActive && (
                        <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>CURRENT</span>
                        </div>
                      )}

                      {/* Format Badge */}
                      <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-stone-900/80 text-white backdrop-blur-xs">
                        {sizePreset.label.split(' ')[0]}
                      </div>

                      {/* Mini Scaled Page Canvas Preview */}
                      {firstPage ? (
                        <div className="pointer-events-none transform scale-[0.24] origin-center shadow-lg transition-transform group-hover/canvas:scale-[0.25]">
                          <PageCanvas
                            page={firstPage}
                            pageIndex={0}
                            totalPages={pageCount}
                            globalSettings={doc.globalSettings}
                            selectedBlockId={null}
                            onSelectBlock={() => {}}
                            onUpdateBlock={() => {}}
                            onMoveBlock={() => {}}
                            onDuplicateBlock={() => {}}
                            onDeleteBlock={() => {}}
                            isExportMode={true}
                            scale={0.9}
                          />
                        </div>
                      ) : (
                        <div className="text-xs text-stone-400">Empty Document</div>
                      )}
                    </div>

                    {/* Card Content & Metadata */}
                    <div className="p-3.5 space-y-3">
                      <div>
                        {editingDocId === doc.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitRename(doc.id);
                                if (e.key === 'Escape') setEditingDocId(null);
                              }}
                              autoFocus
                              className="flex-1 h-7 px-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-900"
                            />
                            <button
                              type="button"
                              onClick={() => commitRename(doc.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group/title">
                            <h3
                              onClick={() => startRename(doc)}
                              className="text-xs font-bold text-stone-900 truncate hover:text-amber-800 cursor-pointer flex-1"
                              title="Click to rename"
                            >
                              {doc.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => startRename(doc)}
                              className="opacity-0 group-hover/title:opacity-100 p-1 text-stone-400 hover:text-stone-700 rounded transition-opacity"
                              title="Rename project"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 font-mono">
                          <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
                          <span>·</span>
                          <span>Edited {formatRelativeTime(doc.updatedAt || doc.createdAt)}</span>
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectDocument(doc.id);
                            onClose();
                          }}
                          className={`flex-1 py-1.5 px-2.5 text-xs font-medium rounded-lg transition-colors text-center ${
                            isActive
                              ? 'bg-stone-100 text-stone-700 hover:bg-stone-200/80'
                              : 'bg-stone-900 hover:bg-stone-800 text-white shadow-2xs'
                          }`}
                        >
                          {isActive ? 'Continue Editing' : 'Open Portfolio'}
                        </button>

                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => onDuplicateDocument(doc.id)}
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Duplicate Portfolio"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onExportDocumentJson(doc.id)}
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Export Document as JSON Backup"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {documents.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${doc.name}"?`)) {
                                  onDeleteDocument(doc.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Portfolio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>All portfolios are stored securely in your browser's offline storage.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
