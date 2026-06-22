function slugify(text) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

if (typeof window !== 'undefined') {
    window.BiuguSlugify = slugify;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = slugify;
}
