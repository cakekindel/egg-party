import { wrapWithPromise } from './wrap-with-promise.fn';

export function promiseOf<T>(val: T): Promise<T> {
    return wrapWithPromise(val);
}
