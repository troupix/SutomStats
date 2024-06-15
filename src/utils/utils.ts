

export const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = (time - hours * 3600 - minutes * 60).toFixed(0);
    if (hours === 0 && minutes === 0) {
        return `${seconds}s`;
    }
    if (hours === 0) {
        return `${minutes}m${seconds}s`;
    }
    return `${hours}h${minutes}m${seconds}s`;
}