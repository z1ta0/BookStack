const SEARCH_URL = 'https://openlibrary.org/search.json';
const COVER_URL = 'https://covers.openlibrary.org/b/olid';

function isISBN(query) {
  const cleaned = query.replace(/[-\s]/g, '');
  return /^\d{10}(\d{3})?$/.test(cleaned);
}

function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null;
  return `${COVER_URL}/${coverId}-${size}.jpg`;
}

function normalizeBook(doc) {
  const coverId = doc.cover_edition_key || (doc.edition_key && doc.edition_key[0]);
  let coverUrl = null;
  if (doc.cover_i) {
    coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  } else if (coverId) {
    coverUrl = getCoverUrl(coverId);
  }

  return {
    id: doc.key || `book-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: doc.title || 'Unknown Title',
    author: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
    coverUrl,
    pageCount: doc.number_of_pages_median || null,
    isbn: doc.isbn ? doc.isbn[0] : null,
    publishYear: doc.first_publish_year || null,
    language: doc.language ? doc.language[0] : null,
  };
}

export async function searchBooks(query, limit = 10) {
  if (!query || query.trim().length === 0) return [];

  const trimmed = query.trim();
  let url;

  if (isISBN(trimmed)) {
    url = `${SEARCH_URL}?isbn=${encodeURIComponent(trimmed)}&limit=${limit}`;
  } else {
    url = `${SEARCH_URL}?q=${encodeURIComponent(trimmed)}&limit=${limit}&fields=key,title,author_name,cover_i,cover_edition_key,edition_key,number_of_pages_median,isbn,first_publish_year,language`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Search failed: ${response.status}`);

  const data = await response.json();
  return (data.docs || []).map(normalizeBook);
}
