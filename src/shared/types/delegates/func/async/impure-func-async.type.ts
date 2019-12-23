import { UnusedArg } from '../unused-arg.type';
import { ImpureFunc } from '../impure-func.type';

// prettier-ignore
/**
 * Async counterpart to ImpureFunc<...>
 *
 * @example
 * const getTweets: ImpureFuncAsync<TwitterUser, Tweet> = ...;
 * const tweet: Tweet = await getTweets(user);
 */
export type ImpureFuncAsync<A, B = UnusedArg, C = UnusedArg, D = UnusedArg, E = UnusedArg, F = UnusedArg>
    = [B] extends [UnusedArg] ? ImpureFunc<Promise<A>>
    : [C] extends [UnusedArg] ? ImpureFunc<A, Promise<B>>
    : [D] extends [UnusedArg] ? ImpureFunc<A, B, Promise<C>>
    : [E] extends [UnusedArg] ? ImpureFunc<A, B, C, Promise<D>>
    : [F] extends [UnusedArg] ? ImpureFunc<A, B, C, D, Promise<E>>
    : ImpureFunc<A, B, C, D, E, Promise<F>>;
