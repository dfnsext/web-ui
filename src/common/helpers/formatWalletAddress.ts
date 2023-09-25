export function formatWalletAddress(address: string, startChars: number, endChars: number): string {
    const length = address.length;
    const truncatedStart = address.substring(0, startChars);
    const truncatedEnd = address.substring(length - endChars, length);
    return `${truncatedStart}...${truncatedEnd}`;
}
