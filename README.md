# 🏛️ FolioPress — Architecture & Editorial PDF Portfolio Studio

> A modern, high-precision editorial portfolio builder and publication studio with live Google Fonts streaming, modular page layouts, and vector print-ready PDF export.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://peymanjalili1997.github.io/foliopress/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Preview

You can try the live demo directly in your browser:  
🔗 **[https://peymanjalili1997.github.io/foliopress/](https://peymanjalili1997.github.io/foliopress/)**

---

## ⚡ Key Features

- **Real-Time 1,938 Google Fonts Search**: Instant autocomplete search across all 1,938 Google Fonts with zero-latency streaming and automatic CDN stylesheet injection.
- **Multi-Layer Typography Studio**: Granular independent styling for Kicker / Category, Main Headline, and Subtitle with edge-to-edge full width and true horizontal center alignment.
- **Modular Architectural Layouts**: Horizontal (Landscape) and Vertical (Portrait) page formats (A4 Portrait/Landscape, US Letter, 16:9 Presentation Decks, 4:3 Slides) with orientation-filtered editorial templates.
- **Interactive Visual Plates**: Before/After drag comparison slider, dynamic multi-photo grids, dual plates, and device mockups (MacBook, iPad, Studio Display).
- **Production-Grade Vector PDF Export**: Generates publication-ready, multi-page vector PDFs with archival margins, running headers, and customizable folio numbering.
- **Presentation Deck Mode**: Fullscreen projection view (`F5` / `Alt+P`) with slide fraction navigation.
- **State Persistence & JSON Archive**: LocalStorage auto-save plus one-click project JSON export/import.

---

## 🚀 Getting Started & Local Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/peymanjalili1997/foliopress.git
cd foliopress

# Install dependencies
npm install
```

### 2. Run the Application

```bash
npm run dev
```

The server will start on `http://localhost:3000` with instant Hot Module Replacement (HMR).

### 3. Build for Production

```bash
npm run build
```

Generates an optimized static bundle in the `dist/` directory ready for deployment.

---

## 📁 Project Structure

```
├── index.html                   # Single-Page Application entry point & print stylesheets
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── package.json                 # Project dependencies and build scripts
├── src/
│   ├── App.tsx                  # Core state orchestrator (history, pages, typography)
│   ├── main.tsx                 # React application bootstrapper
│   ├── index.css                # Tailwind CSS v4 directives & print layout rules
│   ├── types/
│   │   └── portfolio.ts         # TypeScript interfaces (PortfolioPage, Block, TextStyle)
│   ├── data/
│   │   ├── allGoogleFonts.ts    # Complete directory of 1,938 Google Fonts
│   │   └── editorialAssets.ts   # Curated templates, themes, font pairings, visual plates
│   ├── utils/
│   │   └── googleFonts.ts       # Dynamic Google Fonts loader, ranker, and search indexer
│   └── components/
│       ├── GoogleFontPicker.tsx # Live search dropdown with keystroke autocomplete
│       ├── PageCanvas.tsx       # Interactive WYSIWYG A4/Letter page canvas
│       ├── TextFormatToolbar.tsx# Top typography ribbon & layer alignment controls
│       ├── InspectorSidebar.tsx # Right inspector: Element, Page Layout & Global settings
│       ├── AddPageModal.tsx     # Add page modal with portrait/landscape template picker
│       ├── PdfExportModal.tsx   # PDF export dialogue with vector print engine
│       └── PresentationView.tsx # Fullscreen deck presentation view (F5 / Alt+P)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + Z` / `Cmd + Z` | **Undo** last change |
| `Ctrl + Y` / `Cmd + Shift + Z` | **Redo** undone change |
| `F5` or `Alt + P` | Open **Fullscreen Presentation Deck** |
| `←` / `→` (in Presentation) | Navigate previous / next page |
| `Enter` (in Font Picker) | Immediately apply the highlighted Google Font |
| `Escape` | Dismiss modal or popover menu |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
