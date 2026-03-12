import { createBook3D } from './book3d.js';
import { getBooks, removeBook } from './store.js';
import { calculateTotalHeight, getHeightComparison } from './height.js';
import { t } from './i18n.js';

let onChangeCallback = null;

export function onShelfChange(cb) {
  onChangeCallback = cb;
}

function triggerChange() {
  if (onChangeCallback) onChangeCallback();
}

export function renderShelf() {
  const books = getBooks();
  const stackEl = document.getElementById('book-stack');
  const emptyEl = document.getElementById('empty-state');
  const shelfSurface = document.getElementById('shelf-surface');

  // Update empty state
  if (books.length === 0) {
    stackEl.innerHTML = '';
    emptyEl.style.display = 'flex';
    shelfSurface.style.display = 'none';
    document.getElementById('empty-title').textContent = t('emptyTitle');
    document.getElementById('empty-subtitle').textContent = t('emptySubtitle');
  } else {
    emptyEl.style.display = 'none';
    shelfSurface.style.display = 'block';

    // Build stack from bottom to top
    stackEl.innerHTML = '';
    books.forEach((book, index) => {
      const bookEl = createBook3D(book, index);

      // Click to open details modal
      bookEl.addEventListener('click', () => {
        showBookDetails(book, bookEl);
      });

      stackEl.appendChild(bookEl);
    });
  }

  updateStats(books);
}

function updateStats(books) {
  const { totalPages, heightCm } = calculateTotalHeight(books);
  const comparison = getHeightComparison(heightCm);

  document.getElementById('stats-message').textContent = comparison;

  let countText;
  if (books.length === 0) countText = t('statsBooksZero');
  else if (books.length === 1) countText = t('statsBooksOne');
  else countText = t('statsBooks', { count: books.length });
  document.getElementById('stats-books-count').textContent = countText;

  const statsPanel = document.getElementById('height-stats');
  if (books.length === 0) {
    statsPanel.classList.add('hidden');
  } else {
    statsPanel.classList.remove('hidden');
  }
}

function showBookDetails(book, bookEl) {
  document.getElementById('details-title').textContent = book.title;
  document.getElementById('details-author').textContent = book.author || '';
  document.getElementById('details-pages').textContent = book.pageCount ? `${book.pageCount} p.` : '';
  
  const coverContainer = document.getElementById('details-cover-container');
  coverContainer.innerHTML = '';
  if (book.coverUrl) {
    const img = document.createElement('img');
    img.src = book.coverUrl;
    img.alt = book.title;
    coverContainer.appendChild(img);
    coverContainer.style.display = 'block';
  } else {
    coverContainer.style.display = 'none';
  }

  const removeBtn = document.getElementById('details-remove-btn');
  removeBtn.textContent = t('removeBook');
  
  // Clean up old listeners by cloning
  const newRemoveBtn = removeBtn.cloneNode(true);
  removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
  
  newRemoveBtn.addEventListener('click', () => {
    closeDetailsModal();
    bookEl.classList.add('removing');
    setTimeout(() => {
      removeBook(book.id);
      renderShelf();
      triggerChange();
    }, 400); // Wait for transition
  });

  const overlay = document.getElementById('details-modal-overlay');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });
}

function closeDetailsModal() {
  const overlay = document.getElementById('details-modal-overlay');
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 300);
}

// Setup Details Modal Close Handlers
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('details-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDetailsModal);
  }
  const overlay = document.getElementById('details-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeDetailsModal();
      }
    });
  }
});
