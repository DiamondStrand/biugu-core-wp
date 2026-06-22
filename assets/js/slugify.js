/**
 * Convert a text string into a URL-friendly slug.
 *
 * Example: "Mitt Event 2026!" -> "mitt-event-2026"
 *
 * @param {string} value Text to convert.
 * @returns {string} URL-friendly slug.
 */
function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { slugify };
}

if (typeof window !== 'undefined') {
  window.slugify = slugify;
}
