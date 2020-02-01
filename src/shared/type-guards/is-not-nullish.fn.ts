export function isNotNullish<T>(
    item: T | null | undefined
): item is NonNullable<T> {
    return item !== undefined && item !== null;
}
