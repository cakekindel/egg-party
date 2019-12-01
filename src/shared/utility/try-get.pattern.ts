export type TryGetMethod<TValue> = (...args: any[]) => TryGetOutput<TValue>;
export type AsyncTryGetMethod<TValue> = (...args: any[]) => Promise<TryGetOutput<TValue>>;

export type TryGetOutput<TValue> = { success: true, output: TValue } | { success: false };
