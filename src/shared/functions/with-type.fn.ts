export function withType<T>(): (x: T) => T {
    return x => x;
}
