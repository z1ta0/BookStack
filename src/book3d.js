import { getBookDimensions } from './height.js';

/* ──────────────────────────────────────────────
   Spine-First 3D Book Component
   
   Creates a horizontally-lying book element showing:
   - Spine face (main visible rectangle with title + author)
   - Top face (cover image, skewed for isometric depth)
   - Right edge (page edges with paper texture)
   ────────────────────────────────────────────── */

/**
 * Generate rich spine colors from the title string.
 * Produces warm, saturated book-spine hues.
 */
function generateSpineColors(title) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Rich, warm-leaning hue distribution
  const hueBase = Math.abs(hash) % 360;
  const sat = 38 + (Math.abs(hash >> 6) % 28);   // 38-66%
  const lit = 28 + (Math.abs(hash >> 12) % 18);   // 28-46%

  const bg = `hsl(${hueBase}, ${sat}%, ${lit}%)`;
  const topBg = `hsl(${hueBase}, ${sat - 5}%, ${lit + 12}%)`;

  // Stripe accent — slightly different hue for decoration
  const stripeHue = (hueBase + 30) % 360;
  const stripe = `hsla(${stripeHue}, ${sat + 15}%, ${lit + 20}%, 0.35)`;

  // Text color — light for dark spines, dark for light spines
  const textColor = lit < 40
    ? 'rgba(255,255,255,0.92)'
    : 'rgba(30,25,20,0.88)';

  return { bg, topBg, stripe, textColor };
}

/**
 * Creates a spine-first 3D book element for horizontal stacking.
 */
export function createBook3D(book, index = 0) {
  const dims = getBookDimensions(book);
  const colors = generateSpineColors(book.title);

  // Skew angles for consistent isometric look
  const skewAngle = -45;
  const pagesSkewAngle = -45;
  const topScale = 0.5;

  // Font size scales with spine thickness
  const fontSize = dims.thickness >= 28
    ? '0.78rem'
    : dims.thickness >= 20
      ? '0.68rem'
      : '0.58rem';

  // Container
  const wrap = document.createElement('div');
  wrap.className = 'book-3d-wrap';
  wrap.dataset.bookId = book.id;
  wrap.style.setProperty('--spine-w', `${dims.spineWidth}px`);
  wrap.style.setProperty('--spine-h', `${dims.thickness}px`);
  wrap.style.setProperty('--top-h', `${dims.depth}px`);
  wrap.style.setProperty('--page-w', `${dims.pageEdgeWidth}px`);
  wrap.style.setProperty('--book-bg', colors.bg);
  wrap.style.setProperty('--book-top-bg', colors.topBg);
  wrap.style.setProperty('--book-stripe', colors.stripe);
  // Default text color, overriden if cover exists
  wrap.style.setProperty('--book-text', colors.textColor);
  wrap.style.setProperty('--spine-font', fontSize);
  wrap.style.setProperty('--skew', `${skewAngle}deg`);
  wrap.style.setProperty('--top-scale', `${topScale}`);
  wrap.style.setProperty('--pages-skew', `${pagesSkewAngle}deg`);
  wrap.style.setProperty('--stagger', `${index * 0.06}s`);

  // Slight random rotation for natural pile feel (±1.5deg)
  const titleHash = hashCode(book.title);
  const rotation = ((titleHash % 30) - 15) / 10; // ±1.5
  wrap.style.transform = `rotate(${rotation}deg)`;

  // === Spine face (main visible element) ===
  const spine = document.createElement('div');
  spine.className = 'book-spine';

  // Title text
  const titleEl = document.createElement('span');
  titleEl.className = 'spine-title';
  titleEl.textContent = book.title;
  spine.appendChild(titleEl);

  // Show author on wider/thicker spines
  if (book.author && dims.thickness >= 18 && dims.spineWidth >= 190) {
    const dot = document.createElement('span');
    dot.className = 'spine-dot';
    spine.appendChild(dot);

    const authorEl = document.createElement('span');
    authorEl.className = 'spine-author';
    authorEl.textContent = book.author;
    spine.appendChild(authorEl);
  }

  // === Top face (cover) ===
  const topFace = document.createElement('div');
  topFace.className = 'book-top';

  if (book.coverUrl) {
    // 1. Image on the top face
    const img = document.createElement('img');
    img.src = book.coverUrl;
    img.alt = book.title;
    img.loading = 'lazy';
    img.onerror = () => {
      img.remove();
      topFace.classList.add('no-cover');
      // If image fails, revert text color to generated
      wrap.style.setProperty('--book-text', colors.textColor);
      spine.style.backgroundImage = 'none';
    };
    topFace.appendChild(img);
    
    // 2. Realistic Spine: Apply cover as spine background with dark overlay
    spine.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url("${book.coverUrl}")`;
    spine.style.backgroundSize = '100% auto';
    spine.style.backgroundPosition = 'center center';
    spine.style.backgroundColor = colors.bg; // Fallback
    
    // Force text to be white against the dark overlay
    wrap.style.setProperty('--book-text', 'rgba(255,255,255,0.95)');
    wrap.style.setProperty('--book-stripe', 'rgba(255,255,255,0.2)');
  } else {
    topFace.classList.add('no-cover');
  }
  spine.appendChild(topFace);

  // === Right edge (pages) ===
  const pages = document.createElement('div');
  pages.className = 'book-pages';
  spine.appendChild(pages);

  wrap.appendChild(spine);

  return wrap;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
