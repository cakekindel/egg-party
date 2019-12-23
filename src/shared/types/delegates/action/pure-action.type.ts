import { PureFunc } from '../func';

/**
 * Pure counterpart to Action<T>
 *
 * @example
 * // returns a copy of something with a side effect applied
 * const copyAndMutate: PureAction<Something> = thing => ...;
 *
 * const thing: Immutable<Something> = ...;
 * const copiedThing: Immutable<Something> = copyAndMutate(thing);
 *
 * console.log(thing === copiedThing); // false, different references
 */
export type PureAction<T> = PureFunc<T, T>;
