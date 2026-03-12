const translations = {
  en: {
    // Stats
    statsBooks: '{count} books read',
    statsBooksOne: '1 book read',
    statsBooksZero: 'No books yet',
    
    // Height comparisons
    heightTiny: 'About the thickness of a smartphone 📱',
    heightCookies: 'A stack of cookies tall 🍪',
    heightMug: 'As tall as a coffee mug ☕',
    heightRuler: 'As tall as a school ruler 📏',
    heightChair: 'As tall as a dining chair seat 🪑',
    heightTable: 'Your books stacked up are as tall as a dining table! 🍽️',
    heightChild: 'As tall as a toddler learning to walk! 👶',
    heightShoulder: "Reaches an adult's shoulder height! 💪",
    heightDoor: 'As tall as a door frame! 🚪',
    heightGiraffe: "Taller than a giraffe's legs! 🦒",
    heightSkyscraper: 'Reaching for the sky! 🏙️',
    
    // Empty state
    emptyTitle: 'Your shelf is waiting',
    emptySubtitle: 'Tap + to search and add your first book',
    
    // Modal
    modalTitle: 'Add a Book',
    detailsModalTitle: 'Book Details',
    searchPlaceholder: 'Search by title or ISBN…',
    searching: 'Searching…',
    noResults: 'No books found. Try a different search.',
    pages: '{count} pages',
    pagesUnknown: 'Pages unknown',
    addButton: 'Add',
    by: 'by',
    published: 'Published {year}',
    
    // Actions
    removeBook: 'Remove',
    confirmRemove: 'Remove this book?',
  },
  zh: {
    // Stats
    statsBooks: '已读 {count} 本书',
    statsBooksOne: '已读 1 本书',
    statsBooksZero: '还没有书呢',
    
    // Height comparisons
    heightTiny: '大约一部手机的厚度 📱',
    heightCookies: '一摞饼干那么高 🍪',
    heightMug: '一杯咖啡那么高 ☕',
    heightRuler: '一把尺子那么高 📏',
    heightChair: '餐椅坐垫那么高 🪑',
    heightTable: '你读的书摞起来有餐桌那么高！🍽️',
    heightChild: '和蹒跚学步的小孩一样高！👶',
    heightShoulder: '到成年人肩膀那么高！💪',
    heightDoor: '和门框差不多高！🚪',
    heightGiraffe: '比长颈鹿的腿还长！🦒',
    heightSkyscraper: '直冲云霄！🏙️',
    
    // Empty state
    emptyTitle: '书架正等着你',
    emptySubtitle: '点击 + 搜索并添加你的第一本书',
    
    // Modal
    modalTitle: '添加书籍',
    detailsModalTitle: '书籍详情',
    searchPlaceholder: '输入书名或ISBN搜索…',
    searching: '搜索中…',
    noResults: '没有找到相关书籍，请尝试其他关键词。',
    pages: '{count} 页',
    pagesUnknown: '页数未知',
    addButton: '添加',
    by: '著',
    published: '{year}年出版',
    
    // Actions
    removeBook: '删除',
    confirmRemove: '确定要删除这本书吗？',
  }
};

let currentLang = localStorage.getItem('bookstack-lang') || 'en';

export function t(key, params = {}) {
  let text = translations[currentLang]?.[key] || translations['en'][key] || key;
  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });
  return text;
}

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('bookstack-lang', lang);
}

export function toggleLanguage() {
  const newLang = currentLang === 'en' ? 'zh' : 'en';
  setLanguage(newLang);
  return newLang;
}
