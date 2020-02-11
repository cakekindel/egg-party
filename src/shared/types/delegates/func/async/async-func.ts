import { UnusedArg } from '../unused-arg.type';
import { Func } from '../func.type';

// prettier-ignore
/**
 * Async counterpart to ImpureFunc<...>
 *
 * @example
 * const getTweets: ImpureFuncAsync<TwitterUser, Tweet> = ...;
 * const tweet: Tweet = await getTweets(user);
 */
export type AsyncFunc<A, B = UnusedArg, C = UnusedArg, D = UnusedArg, E = UnusedArg, F = UnusedArg>
    = [B] extends [UnusedArg] ? Func<Promise<A>>
    : [C] extends [UnusedArg] ? Func<A, Promise<B>>
    : [D] extends [UnusedArg] ? Func<A, B, Promise<C>>
    : [E] extends [UnusedArg] ? Func<A, B, C, Promise<D>>
    : [F] extends [UnusedArg] ? Func<A, B, C, D, Promise<E>>
    : Func<A, B, C, D, E, Promise<F>>;
