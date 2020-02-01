import { Func } from './func.type';
import { Immutable } from '../../immutable';
import { UnusedArg } from './unused-arg.type';

// prettier-ignore
/**
 * Pure counterpart to Func<...>
 *
 * Prevents mutation of parameters, and produces an immutable
 *
 * @example
 * interface Selectable { selected: boolean; }
 * const select: PureFunc<Selectable, Selectable> = s => {
 *     const clone = _.cloneDeep(s);
 *     clone.selected = true;
 *     return clone;
 * }
 */
export type PureFunc<A, B = UnusedArg, C = UnusedArg, D = UnusedArg, E = UnusedArg, F = UnusedArg>
    = [B] extends [UnusedArg] ? Func<Immutable<A>>
    : [C] extends [UnusedArg] ? Func<Immutable<A>, Immutable<B>>
    : [D] extends [UnusedArg] ? Func<Immutable<A>, Immutable<B>, Immutable<C>>
    : [E] extends [UnusedArg] ? Func<Immutable<A>, Immutable<B>, Immutable<C>, Immutable<D>>
    : [F] extends [UnusedArg] ? Func<Immutable<A>, Immutable<B>, Immutable<C>, Immutable<D>, Immutable<E>>
    : Func<Immutable<A>, Immutable<B>, Immutable<C>, Immutable<D>, Immutable<E>, Immutable<F>>;
