import { PureFunc } from '../func';
import { Order } from '../../../enums';

/**
 * Pure delegate type that returns a sort result by comparing 2 objects.
 *
 * Applicable for delegates used for `Array.prototype.sort`
 *
 * @example
 * const sorter: Compare<Something> = (thing1, thing2) => Order.GreaterThan | Order.LessThan | Order.Equal;
 *
 * const things: Something[] = [...];
 * const thingsSorted: Something[] = things.sort(sorter);
 */
export type Compare<T> = PureFunc<T, T, Order>;
