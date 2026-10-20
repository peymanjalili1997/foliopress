/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GlobalDocumentSettings, PortfolioPage } from '../types/portfolio';

export function generateStandaloneWebHtml(
  pages: PortfolioPage[],
  globalSettings: GlobalDocumentSettings
): string {
  const safeTitle = (globalSettings.portfolioTitle || 'FolioPress Portfolio').replace(/"/g, '&quot;');
  const safeAuthor = (globalSettings.authorName || '').replace(/"/g, '&quot;');
  const safeData = JSON.stringify({ pages, globalSettings }).replace(/<\/script>/gi, '<\\/script>');

  const fontsToLoad = Array.from(
    new Set([
      globalSettings.headingFont || 'Cormorant Garamond',
      globalSettings.bodyFont || 'Inter',
      globalSettings.monoFont || 'JetBrains Mono',
    ])
  );
  const fontQuery = fontsToLoad
    .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400`)
    .join('&');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}${safeAuthor ? ' — ' + safeAuthor : ''}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?${fontQuery}&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :root {
      --bg-dark: #121211;
      --bg-card: #1c1b1a;
      --border-dark: #2c2b29;
      --text-muted: #8c8984;
      --text-light: #f5f4f0;
      --accent: #d97706;
      --heading-font: '${globalSettings.headingFont}', Georgia, serif;
      --body-font: '${globalSettings.bodyFont}', -apple-system, sans-serif;
      --mono-font: '${globalSettings.monoFont}', monospace;
    }
    body {
      background-color: var(--bg-dark);
      color: var(--text-light);
      font-family: var(--body-font);
      min-height: 100vh;
      display: flex;
      flex-col: column;
      overflow-x: hidden;
      user-select: none;
    }
    header.viewer-nav {
      height: 56px;
      background: rgba(28, 27, 26, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border-dark);
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
      gap: 16px;
    }
    .brand-title {
      font-family: var(--heading-font);
      font-size: 1.15rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .page-counter {
      font-family: var(--mono-font);
      font-size: 0.8rem;
      color: var(--text-muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .page-counter strong {
      color: var(--text-light);
    }
    .btn-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button.nav-btn {
      background: #2a2927;
      color: #eae9e4;
      border: 1px solid #3c3a37;
      padding: 6px 14px;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    button.nav-btn:hover {
      background: #3a3936;
      border-color: #55534f;
    }
    button.nav-btn:active {
      transform: scale(0.97);
    }
    main.viewport {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 20px;
      perspective: 1000px;
    }
    .paper-canvas {
      width: 100%;
      max-width: 900px;
      background: ${globalSettings.backgroundColor || '#FAF8F5'};
      color: ${globalSettings.textColor || '#161514'};
      border-radius: 4px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.45);
      padding: 48px;
      min-height: 600px;
      transition: opacity 0.2s ease, transform 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .paper-header {
      border-bottom: 1px solid rgba(0,0,0,0.1);
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      font-family: var(--mono-font);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.65;
    }
    .paper-footer {
      border-top: 1px solid rgba(0,0,0,0.1);
      padding-top: 12px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      font-family: var(--mono-font);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.65;
    }
    .content-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .block-heading {
      font-family: var(--heading-font);
      font-size: 2rem;
      line-height: 1.15;
      font-weight: 500;
    }
    .block-kicker {
      font-family: var(--mono-font);
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      opacity: 0.65;
      margin-bottom: 4px;
    }
    .block-paragraph {
      font-size: 0.95rem;
      line-height: 1.65;
      opacity: 0.9;
    }
    .block-image img {
      width: 100%;
      height: 380px;
      object-fit: cover;
      display: block;
      border-radius: 2px;
    }
    .block-caption {
      font-size: 0.75rem;
      opacity: 0.65;
      margin-top: 6px;
      font-family: var(--mono-font);
    }
    .filmstrip {
      height: 72px;
      background: var(--bg-card);
      border-top: 1px solid var(--border-dark);
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      overflow-x: auto;
      z-index: 40;
    }
    .filmstrip::-webkit-scrollbar {
      height: 4px;
    }
    .filmstrip::-webkit-scrollbar-thumb {
      background: var(--border-dark);
      border-radius: 4px;
    }
    .thumb-card {
      height: 52px;
      min-width: 72px;
      background: #fff;
      border: 2px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4px 6px;
      color: #111;
      font-size: 8px;
      font-family: var(--mono-font);
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .thumb-card.active {
      border-color: var(--accent);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
    }
    .thumb-title {
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60px;
    }
  </style>
</head>
<body>
  <header class="viewer-nav">
    <div class="brand-title">${safeTitle}</div>
    <div class="page-counter">
      <span>PAGE <strong id="curPageNum">01</strong> OF <strong id="totPageNum">01</strong></span>
    </div>
    <div class="btn-group">
      <button type="button" class="nav-btn" onclick="prevPage()">← Prev</button>
      <button type="button" class="nav-btn" onclick="nextPage()">Next →</button>
      <button type="button" class="nav-btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
    </div>
  </header>

  <main class="viewport">
    <div id="paperCanvas" class="paper-canvas">
      <div id="paperHeader" class="paper-header">
        <span id="headerLeft">FolioPress</span>
        <span id="headerRight">Section</span>
      </div>
      <div id="contentBody" class="content-body"></div>
      <div id="paperFooter" class="paper-footer">
        <span id="footerLeft">Architecture Portfolio</span>
        <span id="footerRight">01</span>
      </div>
    </div>
  </main>

  <div id="filmstrip" class="filmstrip"></div>

  <script>
    const DATA = ${safeData};
    const pages = DATA.pages || [];
    const settings = DATA.globalSettings || {};
    let currentIndex = 0;

    function renderPage(idx) {
      if (idx < 0 || idx >= pages.length) return;
      currentIndex = idx;
      const page = pages[idx];
      const canvas = document.getElementById('paperCanvas');
      canvas.style.opacity = '0';
      canvas.style.transform = 'translateY(6px)';

      setTimeout(() => {
        document.getElementById('curPageNum').textContent = String(idx + 1).padStart(2, '0');
        document.getElementById('totPageNum').textContent = String(pages.length).padStart(2, '0');
        document.getElementById('headerLeft').textContent = settings.headerLeftText || settings.portfolioTitle || 'FolioPress';
        document.getElementById('headerRight').textContent = page.sectionLabel || settings.headerRightText || '';
        document.getElementById('footerLeft').textContent = settings.footerLeftText || settings.portfolioTitle || '';
        document.getElementById('footerRight').textContent = String(idx + 1).padStart(2, '0');

        const body = document.getElementById('contentBody');
        body.innerHTML = '';

        (page.blocks || []).forEach(b => {
          const div = document.createElement('div');
          if (b.type === 'heading') {
            div.innerHTML = \`
              \${b.kicker ? \`<div class="block-kicker">\${b.kicker}</div>\` : ''}
              <h1 class="block-heading" style="font-family: \${b.textStyle?.fontFamily || settings.headingFont || 'serif'}">\${b.text || ''}</h1>
              \${b.secondaryText ? \`<p style="margin-top:6px; opacity:0.75; font-size:1.1rem;">\${b.secondaryText}</p>\` : ''}
            \`;
          } else if (b.type === 'paragraph') {
            div.className = 'block-paragraph';
            div.textContent = b.text || '';
          } else if (b.type === 'image') {
            div.className = 'block-image';
            div.innerHTML = \`
              <img src="\${b.imageUrl || ''}" alt="\${b.imageCaption || ''}">
              \${b.imageCaption ? \`<div class="block-caption">\${b.imageCaption}</div>\` : ''}
            \`;
          } else if (b.type === 'pull-quote') {
            div.innerHTML = \`
              <blockquote style="font-family: \${settings.headingFont}; font-size:1.35rem; font-style:italic; border-left:3px solid var(--accent); padding-left:14px; margin:10px 0;">
                \${b.text || ''}
              </blockquote>
              \${b.kicker ? \`<div class="block-kicker" style="margin-left:17px;">\${b.kicker}</div>\` : ''}
            \`;
          } else if (b.type === 'divider') {
            div.innerHTML = '<hr style="border:none; border-top:1px solid rgba(0,0,0,0.12); margin:12px 0;">';
          } else if (b.type === 'arch-scale-compass') {
            div.innerHTML = \`
              <div style="border-top:1px solid rgba(0,0,0,0.1); border-bottom:1px solid rgba(0,0,0,0.1); padding:12px 0; display:flex; justify-content:space-between; align-items:center; font-family:var(--mono-font); font-size:11px;">
                <div>
                  <div style="font-weight:600; text-transform:uppercase; margin-bottom:4px;">\${b.kicker || 'DRAWING SPECIFICATIONS'}</div>
                  <div style="font-weight:700;">SCALE \${b.scaleRatio || '1:100'}</div>
                </div>
                <div style="text-align:center;">
                  <div style="transform:rotate(\${b.northAngleDeg || 0}deg); font-size:16px;">▲</div>
                  <div style="font-weight:bold; font-size:10px;">N</div>
                </div>
              </div>
            \`;
          } else if (b.type === 'project-factsheet') {
            const items = b.factsheetItems || [];
            div.innerHTML = \`
              <div style="border-top:1px solid rgba(0,0,0,0.1); border-bottom:1px solid rgba(0,0,0,0.1); padding:12px 0;">
                <div class="block-kicker">\${b.kicker || 'PROJECT FACTSHEET'}</div>
                <h3 style="font-family:var(--heading-font); font-size:1.25rem; font-weight:600; margin-bottom:12px;">\${b.factsheetTitle || 'Technical Specifications'}</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px;">
                  \${items.map(it => \`
                    <div style="background:rgba(0,0,0,0.03); padding:8px 10px; border-radius:4px;">
                      <div style="font-family:var(--mono-font); font-size:9px; opacity:0.6; text-transform:uppercase;">\${it.label}</div>
                      <div style="font-size:12px; font-weight:500; margin-top:2px;">\${it.value}</div>
                    </div>
                  \`).join('')}
                </div>
              </div>
            \`;
          } else {
            if (b.text) {
              div.className = 'block-paragraph';
              div.textContent = b.text;
            }
          }
          body.appendChild(div);
        });

        canvas.style.opacity = '1';
        canvas.style.transform = 'translateY(0)';
        updateFilmstrip();
      }, 100);
    }

    function initFilmstrip() {
      const container = document.getElementById('filmstrip');
      container.innerHTML = '';
      pages.forEach((p, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumb-card' + (idx === currentIndex ? ' active' : '');
        thumb.onclick = () => renderPage(idx);
        thumb.innerHTML = \`
          <span style="opacity:0.5;">\${String(idx + 1).padStart(2, '0')}</span>
          <span class="thumb-title">\${p.title || 'Page'}</span>
        \`;
        container.appendChild(thumb);
      });
    }

    function updateFilmstrip() {
      const cards = document.querySelectorAll('.thumb-card');
      cards.forEach((c, idx) => {
        if (idx === currentIndex) {
          c.classList.add('active');
          c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          c.classList.remove('active');
        }
      });
    }

    function prevPage() {
      if (currentIndex > 0) renderPage(currentIndex - 1);
    }

    function nextPage() {
      if (currentIndex < pages.length - 1) renderPage(currentIndex + 1);
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    });

    initFilmstrip();
    renderPage(0);
  </script>
</body>
</html>`;
}
