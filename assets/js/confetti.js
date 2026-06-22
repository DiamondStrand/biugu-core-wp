function getConfettiRunner() {
    if (typeof window !== 'undefined') {
        return window.confetti || window.canvasConfetti;
    }

    if (typeof require === 'function') {
        try {
            return require('canvas-confetti');
        } catch (error) {
            return null;
        }
    }

    return null;
}

function triggerBiuguConfetti(options = {}) {
    const confetti = getConfettiRunner();

    if (typeof confetti !== 'function') {
        console.warn('canvas-confetti is not available.');
        return false;
    }

    const settings = {
        particleCount: 90,
        spread: 70,
        origin: { y: 0.68 },
        colors: ['#6f42c1', '#f97316', '#22c55e', '#3b82f6', '#facc15'],
        ...options,
    };

    confetti(settings);
    return true;
}

if (typeof window !== 'undefined') {
    window.triggerBiuguConfetti = triggerBiuguConfetti;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = triggerBiuguConfetti;
}
