import { UnusedArg } from '../unused-arg.type';
import { PureFunc } from '../pure-func.type';

// prettier-ignore
/**
 * Async counterpart to PureFunc<...>
 *
 * @example
 * const getTweets: PureFuncAsync<TwitterUser, Tweet> = ...;
 * const tweet: Immutable<Tweet> = await getTweets(user);
 */
export type PureFuncAsync<A, B = UnusedArg, C = UnusedArg, D = UnusedArg, E = UnusedArg, F = UnusedArg>
    = [B] extends [UnusedArg] ? PureFunc<Promise<A>>
    : [C] extends [UnusedArg] ? PureFunc<A, Promise<B>>
    : [D] extends [UnusedArg] ? PureFunc<A, B, Promise<C>>
    : [E] extends [UnusedArg] ? PureFunc<A, B, C, Promise<D>>
    : [F] extends [UnusedArg] ? PureFunc<A, B, C, D, Promise<E>>
    : PureFunc<A, B, C, D, E, Promise<F>>;
