function formatBytes(bytes) {
    const value = Number(bytes);

    if (!Number.isFinite(value) || value < 0) {
        return '0 B';
    }

    if (value < 1024) {
        return `${Math.round(value)} B`;
    }

    const units = ['KB', 'MB', 'GB'];
    let size = value / 1024;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    const formatted = Number.isInteger(size) ? String(size) : size.toFixed(1).replace(/\.0$/, '');
    return `${formatted} ${units[unitIndex]}`;
}

if (typeof window !== 'undefined') {
    window.BiuguFormatBytes = formatBytes;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = formatBytes;
}
