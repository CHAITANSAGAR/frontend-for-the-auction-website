export const formatTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.now();
    if (isNaN(total) || total <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true, total: 0 };
    }
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, isEnded: false, total };
};

export const formatRemainingString = (endTime) => {
    const { days, hours, minutes, seconds, isEnded } = formatTimeRemaining(endTime);
    if (isEnded) return 'Ended';
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatDateTime = (isoDate) => {
    if (!isoDate) return 'N/A';
    try {
        const d = new Date(isoDate);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return isoDate;
    }
};
