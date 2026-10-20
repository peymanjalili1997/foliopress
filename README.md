# FolioPress — Architecture & Editorial PDF Portfolio Builder

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://peymanjalili1997.github.io/foliopress/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**A high-precision editorial monograph and portfolio design application for architects, visual designers, and researchers.**

### 🌐 [Live Interactive Preview](https://peymanjalili1997.github.io/foliopress/)
**`https://peymanjalili1997.github.io/foliopress/`**

</div>

---

## ✨ Features

- **Dynamic Google Fonts Integration:**
  - Real-time live search across all **1,938 Google Fonts** with zero-latency keystroke autocomplete.
  - One-click online font streaming and vector PDF embedding.
- **Multi-Layer Independent Typography:**
  - Full granular control over every text element in a block:
    - **Heading Blocks:** Independent styling for **Kicker**, **Main Headline**, and **Subtitle**.
    - **Pull Quotes:** Independent styling for **Quote Statement** and **Attribution / Citation**.
    - **Two-Column Text:** Independent styling for Left and Right columns.
  - Full-width text flow with true horizontal center (`Align Center`), left, right, and justify alignment.
- **Page Management & Architecture Presets:**
  - Horizontal (Landscape) and Vertical (Portrait) page formats (A4 Portrait/Landscape, US Letter, 16:9 Deck, 4:3 Slide).
  - Editorial page templates categorized by orientation.
  - Drag-and-drop page reordering with thumbnail preview.
- **Visual Media Tools:**
  - Interactive Before/After image comparison sliders.
  - Multi-photo masonry & column grids with dynamic photo addition and removal.
  - Architectural dual plates, split media layouts, and device framing mockups.
- **Publication & Export:**
  - High-resolution, multi-page vector PDF export via native browser print engine.
  - Fullscreen presentation deck mode (`F5` / `Alt+P`).
  - Project state persistence via LocalStorage and single-click JSON save/load.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/peymanjalili1997/foliopress.git
   cd foliopress
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` / `Cmd + Z` | Undo last action |
| `Ctrl + Y` / `Cmd + Shift + Z` | Redo action |
| `F5` / `Alt + P` | Open Fullscreen Presentation Mode |
| `Enter` (in Font Picker) | Instantly apply the selected Google Font |
| `Escape` | Close active popovers or modals |

---

## 📄 License
This project is licensed under the Apache 2.0 License.
