const STORAGE_KEY = 'bookstack-books';

function loadBooks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function getBooks() {
  return loadBooks();
}

export function addBook(book) {
  const books = loadBooks();
  const newBook = {
    ...book,
    id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    addedAt: new Date().toISOString(),
  };
  books.push(newBook);
  saveBooks(books);
  return newBook;
}

export function removeBook(id) {
  const books = loadBooks();
  const filtered = books.filter(b => b.id !== id);
  saveBooks(filtered);
  return filtered;
}

export function clearBooks() {
  saveBooks([]);
}
