import { PureFunc } from '../func';
import { Immutable } from '../../immutable';

/**
 * Pure delegate type that tests an object for a condition
 *
 * @example
 * const shouldKeep: Predicate<number> = n => n > 5;
 * const nums = [5, 6, 7];
 * const filteredNums = nums.filter(shouldKeep); // [6, 7]
 */
export type Predicate<T> = PureFunc<T, boolean>;
