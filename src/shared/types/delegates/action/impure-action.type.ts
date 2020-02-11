import { Func } from '../func';

/**
 * Impure delegate type that performs some action.
 *
 * If you won't be performing any side effects, consider using `ImmutableType<T>`
 *
 * @example
 * // returns something with a side effect applied
 * const mutate: ImpureAction<Something> = thing => ...;
 *
 * const thing: Something = ...;
 * const thingSnapshot: Something = deepCopy(thing);
 *
 * mutate(thing);
 *
 * console.log(deepCompare(thing, thingSnapshot)); // false, object was mutated
 */
export type ImpureAction<T> = Func<T, void>;
