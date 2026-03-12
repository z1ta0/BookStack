import { searchBooks } from './api.js';
import { addBook } from './store.js';
import { t } from './i18n.js';

let debounceTimer = null;
let onBookAddedCallback = null;

export function onBookAdded(cb) {
  onBookAddedCallback = cb;
}

export function openModal() {
  const overlay = document.getElementById('modal-overlay');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  // Update i18n text
  document.getElementById('modal-title').textContent = t('modalTitle');
  input.placeholder = t('searchPlaceholder');

  overlay.style.display = 'flex';
  results.innerHTML = '';
  input.value = '';

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  setTimeout(() => input.focus(), 100);
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 300);
}

export function initModal() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const input = document.getElementById('search-input');

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close button
  closeBtn.addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Search input with debounce
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();

    if (query.length < 2) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }

    document.getElementById('search-spinner').style.display = 'block';

    debounceTimer = setTimeout(async () => {
      try {
        const results = await searchBooks(query);
        renderResults(results);
      } catch (err) {
        console.error('Search error:', err);
        document.getElementById('search-results').innerHTML = `
          <div class="search-error">${t('noResults')}</div>
        `;
      } finally {
        document.getElementById('search-spinner').style.display = 'none';
      }
    }, 500);
  });
}

function renderResults(results) {
  const container = document.getElementById('search-results');

  if (results.length === 0) {
    container.innerHTML = `<div class="search-empty">${t('noResults')}</div>`;
    return;
  }

  container.innerHTML = '';
  results.forEach(book => {
    const card = document.createElement('div');
    card.className = 'search-result-card';

    const coverHtml = book.coverUrl
      ? `<img class="result-cover" src="${book.coverUrl}" alt="${book.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
         <div class="result-cover-placeholder" style="display:none;">📖</div>`
      : `<div class="result-cover-placeholder">📖</div>`;

    const pagesText = book.pageCount
      ? t('pages', { count: book.pageCount })
      : t('pagesUnknown');

    const yearText = book.publishYear
      ? t('published', { year: book.publishYear })
      : '';

    card.innerHTML = `
      <div class="result-cover-wrapper">
        ${coverHtml}
      </div>
      <div class="result-info">
        <div class="result-title">${book.title}</div>
        <div class="result-author">${book.author}</div>
        <div class="result-meta">
          <span class="result-pages">${pagesText}</span>
          ${yearText ? `<span class="result-year">${yearText}</span>` : ''}
        </div>
      </div>
      <button class="result-add-btn">${t('addButton')}</button>
    `;

    card.querySelector('.result-add-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target;
      btn.textContent = '✓';
      btn.classList.add('added');
      btn.disabled = true;
      
      addBook(book);
      if (onBookAddedCallback) onBookAddedCallback();
      
      // Close modal after short delay
      setTimeout(closeModal, 400);
    });

    container.appendChild(card);
  });
}
