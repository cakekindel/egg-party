import { PureFunc } from '../func';
import { Immutable } from '../../immutable';

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
export type PureAction<T> = PureFunc<Immutable<T>, T>;
