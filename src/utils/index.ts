export function shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function logger(type: 'info' | 'error' | 'success', message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    
    switch (type) {
        case 'error':
            console.error(logMessage, data || '');
            break;
        case 'success':
            console.log('✅', logMessage, data || '');
            break;
        default:
            console.log(logMessage, data || '');
    }
}