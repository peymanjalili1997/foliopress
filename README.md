<div align="center">

# 🏛️ FolioPress
### Editorial & Architecture PDF Portfolio Studio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-10B981?style=for-the-badge&logo=github&logoColor=white)](https://peymanjalili1997.github.io/foliopress/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Google Fonts](https://img.shields.io/badge/Google%20Fonts-1%2C938%20Fonts-EA4335?style=for-the-badge&logo=google-fonts&logoColor=white)](https://fonts.google.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)

<br />

> **FolioPress** is a browser-native editorial portfolio studio and publication builder tailored for architects, spatial designers, and visual researchers. It combines typographic precision, archival paper themes, modular layout grids, and print-ready high-resolution vector PDF export.

<br />

### 🌐 [Click Here to Open the Live Demo](https://peymanjalili1997.github.io/foliopress/)
**`https://peymanjalili1997.github.io/foliopress/`**

---

</div>

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Real-Time Google Fonts Search & Dynamic Loader](#1-real-time-google-fonts-search--dynamic-loader)
  - [2. Multi-Layer Typography Studio](#2-multi-layer-typography-studio)
  - [3. Modular Page Layouts & Orientation Presets](#3-modular-page-layouts--orientation-presets)
  - [4. Architectural Media Framing & Visual Plates](#4-architectural-media-framing--visual-plates)
  - [5. Print-Ready High-Res Vector PDF Export](#5-print-ready-high-res-vector-pdf-export)
  - [6. Fullscreen Presentation Deck](#6-fullscreen-presentation-deck)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Installation](#local-installation)
  - [Scripts](#available-scripts)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Tech Stack](#-tech-stack)
- [License](#-license)

---

## 🔍 Overview

Traditional portfolio builders often rasterize vector typography or enforce rigid web-first grids that break when exported to physical paper or PDF. **FolioPress** treats the viewport as an actual archival page, maintaining true physical dimensions (A4, US Letter, 16:9 Presentation Decks, 4:3 Slides) with sub-pixel typographic fidelity.

Every page is rendered using SVG/CSS vector printing pipelines, ensuring that titles, captions, and architectural footnotes stay razor-sharp whether viewed on high-DPI screens or printed on a large-format plotters.

---

## ✨ Key Features

### 1. Real-Time Google Fonts Search & Dynamic Loader
- **Complete Directory:** Instant live search across all **1,938 Google Fonts** with zero-latency keystroke autocomplete.
- **Intelligent Scoring:** Prioritizes exact matches, prefix hits, and curated architectural/editorial typefaces (e.g. *Poppins, Montserrat, Playfair Display, Cinzel, Inter, Cormorant Garamond, Space Grotesk, Syne, JetBrains Mono*).
- **On-the-Fly CDN Streaming:** Seamlessly downloads stylesheet links and primes `document.fonts.load()` in real-time without reloading the workspace.
- **Arbitrary Font Loader:** Type any font family name from the Google catalog and press `Enter` to load and apply it immediately.

### 2. Multi-Layer Typography Studio
- **Granular Layer Controls:** Independent typography customization for multi-text blocks:
  - **Heading Blocks:** Independent styling for **Kicker / Category** (eyebrow text), **Main Headline**, and **Subtitle / Description**.
  - **Pull Quotes:** Independent styling for **Quote Statement** and **Attribution / Citation**.
  - **Two-Column Text:** Independent styling for **Column 1** and **Column 2**.
- **Full-Width Horizontal Alignment:** Complete edge-to-edge text flow supporting left, true center (`Align Center`), right, and justified alignment across all layers.
- **Editorial Typography Ribbon:** Quick access to font size, weight (300 to 800), line height, letter spacing (tracking), uppercase (ALL CAPS), and curated archival color palettes.

### 3. Modular Page Layouts & Orientation Presets
- **Orientation Switching:** Dynamic support for both **Horizontal (Landscape)** and **Vertical (Portrait)** pages with orientation-filtered template pickers:
  - `A4 Portrait` (210 × 297 mm)
  - `A4 Landscape` (297 × 210 mm)
  - `US Letter Portrait` (8.5 × 11 in)
  - `US Letter Landscape` (11 × 8.5 in)
  - `16:9 Deck Slide` (297 × 167 mm)
  - `4:3 Slide` (297 × 223 mm)
- **Drag-and-Drop Page Organizer:** Thumbnail-driven sidebar to reorder, duplicate, insert, or delete pages in your portfolio book.
- **Editorial Templates:** Ready-to-use layouts including Cover Monographs, Editorial Splits, Project Case Studies, Dual Plate Spreads, Comparison Showcases, and Technical Monograph Sheets.

### 4. Architectural Media Framing & Visual Plates
- **Interactive Before/After Slider:** Drag-to-compare split images for site transformations, renovations, or render-vs-reality views.
- **Multi-Photo Dynamic Grid:** Add, remove, and caption photos in responsive architectural grids.
- **Device & Framed Mockups:** Clean device framing (MacBook, iPad, Studio Display, Archival Matting) for digital portfolios.
- **Visual Filters & Framing:** Live controls for height, zoom, object-fit (contain/cover), aspect ratios, grayscale/monochrome filters, and border framing.

### 5. Print-Ready High-Res Vector PDF Export
- Generates publication-grade, multi-page vector PDFs using the browser's native `@media print` vector engine.
- Supports running headers, chapter section titles, archival margin calibration, and multiple folio numbering styles (e.g. `01 / 04`, `Page 1`, or minimal leading-zero `01, 02`).

### 6. Fullscreen Presentation Deck
- Press **`F5`** or **`Alt + P`** to launch a full-screen, clean presentation mode with keyboard arrow navigation (`←` / `→`) and slide index fraction indicators.

---

## 🏗️ Project Architecture

```
foliopress/
├── index.html                   # HTML entry point with print styles and viewport meta
├── vite.config.ts               # Vite bundler configuration
├── package.json                 # Project dependencies and npm scripts
├── src/
│   ├── main.tsx                 # React application bootstrapper
│   ├── App.tsx                  # Core state orchestrator (undo/redo, page manager, storage)
│   ├── index.css                # Global Tailwind CSS and archival print styles
│   ├── types/
│   │   └── portfolio.ts         # TypeScript models (PortfolioPage, PortfolioBlock, TextStyle, etc.)
│   ├── data/
│   │   ├── allGoogleFonts.ts    # Comprehensive directory of all 1,938 Google Fonts
│   │   └── editorialAssets.ts   # Curated templates, paper themes, font pairings, visual plates
│   ├── utils/
│   │   └── googleFonts.ts       # Dynamic Google Font loader, ranker, and search indexer
│   └── components/
│       ├── GoogleFontPicker.tsx # Live search dropdown with autocomplete & category tabs
│       ├── PageCanvas.tsx       # Interactive WYSIWYG A4/Letter page canvas
│       ├── TextFormatToolbar.tsx# Quick ribbon for font, size, weight, alignment & AI polish
│       ├── InspectorSidebar.tsx # Right sidebar: Element Inspector, Page Layout, Global Document
│       ├── AddPageModal.tsx     # Add Page modal with horizontal/vertical template filtering
│       ├── PdfExportModal.tsx   # PDF export dialogue with resolution & margin controls
│       └── PresentationView.tsx # Fullscreen deck presentation view (F5 / Alt+P)
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/) (or yarn / pnpm / bun)

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/peymanjalili1997/foliopress.git
   cd foliopress
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to interact with FolioPress.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server with Hot Module Replacement (HMR) at `localhost:3000` |
| `npm run build` | Compiles TypeScript and produces a production-optimized build in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

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

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** [Google Fonts Web API & CDN](https://fonts.google.com/)
- **PDF Engine:** Native CSS Paged Media `@media print` + [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://github.com/parallax/jsPDF)
- **Deployment:** GitHub Pages via GitHub Actions

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Crafted for architects, designers, and monograph authors.  
**[Open Live Studio](https://peymanjalili1997.github.io/foliopress/)**

</div>
