import './style.css';
import { t, toggleLanguage, getLanguage } from './i18n.js';
import { renderShelf, onShelfChange } from './shelf.js';
import { initModal, openModal, onBookAdded } from './modal.js';

function updateAllText() {
  // Update Book Details modal title
  const detailsTitle = document.getElementById('details-modal-title');
  if (detailsTitle) detailsTitle.textContent = t('detailsModalTitle');

  // Re-render shelf (updates empty state, stats, etc.)
  renderShelf();
}

function init() {
  // Set initial HTML lang attribute
  document.documentElement.lang = getLanguage() === 'zh' ? 'zh-CN' : 'en';

  // Language toggle
  document.getElementById('lang-toggle').addEventListener('click', () => {
    const newLang = toggleLanguage();
    document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en';
    updateAllText();
  });

  // FAB button
  document.getElementById('add-book-fab').addEventListener('click', openModal);

  // Init modal
  initModal();

  // When a book is added, re-render the shelf
  onBookAdded(() => {
    renderShelf();
  });

  // Initial render
  updateAllText();
}

// Boot
document.addEventListener('DOMContentLoaded', init);
