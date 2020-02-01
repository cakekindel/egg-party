function closureOf<TArgs extends unknown[], TOut>(
    fn: (...args: TArgs) => TOut
): typeof fn {
    return (...args: TArgs) => fn(...args);
}
