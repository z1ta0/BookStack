import { t } from './i18n.js';

// Approximate spine thickness per page in cm
const CM_PER_PAGE = 0.006;
const DEFAULT_PAGES = 250;

export function calculateTotalHeight(books) {
  let totalPages = 0;
  books.forEach(book => {
    totalPages += book.pageCount || DEFAULT_PAGES;
  });
  const heightCm = totalPages * CM_PER_PAGE;
  return {
    totalPages,
    heightCm: Math.round(heightCm * 10) / 10,
  };
}

export function getHeightComparison(heightCm) {
  if (heightCm <= 0) return '';
  if (heightCm < 2) return t('heightTiny');
  if (heightCm < 8) return t('heightCookies');
  if (heightCm < 15) return t('heightMug');
  if (heightCm < 40) return t('heightRuler');
  if (heightCm < 60) return t('heightChair');
  if (heightCm < 85) return t('heightTable');
  if (heightCm < 120) return t('heightChild');
  if (heightCm < 170) return t('heightShoulder');
  if (heightCm < 250) return t('heightDoor');
  if (heightCm < 400) return t('heightGiraffe');
  return t('heightSkyscraper');
}

/**
 * Returns visual thickness of a book spine in pixels.
 * Scaled so a 300-page book is ~22px thick.
 */
export function getBookThickness(pageCount) {
  const pages = pageCount || DEFAULT_PAGES;
  return Math.max(14, Math.min(52, Math.round(pages * 0.07)));
}

/**
 * Returns per-book visual dimensions for the 3D spine display.
 * Each book gets slightly different proportions for organic feel.
 *
 * @returns {{ spineWidth: number, thickness: number, depth: number, pageEdgeWidth: number }}
 */
export function getBookDimensions(book) {
  const pages = book.pageCount || DEFAULT_PAGES;
  const title = book.title || '';

  // Hash for per-book variation
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Spine width (the long dimension when lying flat): 170-260px
  // Longer titles or more pages → wider spine
  const baseWidth = 180;
  const titleBonus = Math.min(50, title.length * 1.2);
  const pageBonus = Math.min(30, pages * 0.03);
  const variation = ((Math.abs(hash) % 30) - 15); // ±15px
  const spineWidth = Math.round(Math.max(170, Math.min(280, baseWidth + titleBonus + pageBonus + variation)));

  // Thickness (height of spine face): 14-52px
  const thickness = getBookThickness(pages);

  // Depth (top face height, simulating cover depth): 28-55px
  const depthBase = 32;
  const depthVariation = (Math.abs(hash >> 8) % 20);
  const depth = depthBase + depthVariation;

  // Page edge width: 12-22px
  const pageEdgeBase = 14;
  const pageEdgeVariation = (Math.abs(hash >> 12) % 8);
  const pageEdgeWidth = pageEdgeBase + pageEdgeVariation;

  return { spineWidth, thickness, depth, pageEdgeWidth };
}
