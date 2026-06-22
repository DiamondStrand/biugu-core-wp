async function copyToClipboard(text) {
    if (
        typeof navigator === 'undefined' ||
        !navigator.clipboard ||
        typeof navigator.clipboard.writeText !== 'function'
    ) {
        console.warn('Clipboard API is not available.');
        return false;
    }

    try {
        await navigator.clipboard.writeText(String(text));
        return true;
    } catch (error) {
        console.warn('Could not copy text to clipboard.', error);
        return false;
    }
}

if (typeof window !== 'undefined') {
    window.BiuguCopyToClipboard = copyToClipboard;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = copyToClipboard;
}
