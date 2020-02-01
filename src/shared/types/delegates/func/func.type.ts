import { UnusedArg } from './unused-arg.type';

// prettier-ignore
/**
 * Helper type for functions
 *
 * The first type arguments are the parameter types,
 * and the last type argument is the return type.
 *
 * @example
 * const getSum: Func<number[], number> = ...;
 * const longHandGetSum: (nums: number[]) => number = ...;
 *
 * const numbers = [1, 2, 3];
 * const sum = getSum(numbers); // 6
 */
export type Func<A, B = UnusedArg, C = UnusedArg, D = UnusedArg, E = UnusedArg, F = UnusedArg>
    = [B] extends [UnusedArg] ? () => A
    : [C] extends [UnusedArg] ? (arg: A) => B
    : [D] extends [UnusedArg] ? (arg: A, arg2: B) => C
    : [E] extends [UnusedArg] ? (arg: A, arg2: B, arg3: C) => D
    : [F] extends [UnusedArg] ? (arg: A, arg2: B, arg3: C, arg4: D) => E
    : (arg: A, arg2: B, arg3: C, arg4: D, arg5: E) => F;
