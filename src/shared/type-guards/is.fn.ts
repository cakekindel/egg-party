export function is<T, TArgs extends unknown[]>(
    val: unknown,
    ctor: (...args: TArgs) => T
): val is T {
    return val instanceof ctor;
}
