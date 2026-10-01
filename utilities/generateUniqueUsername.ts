export function generateUniqueUsername(prefix: string = 'user'): string {
    const timestamp = Date.now();
    return `${prefix}${timestamp}`;
}