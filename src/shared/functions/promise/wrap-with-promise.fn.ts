export function wrapWithPromise<T>(val: T): Promise<T> {
    return Promise.resolve(val);
}
