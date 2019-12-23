import { ImpureFunc } from './impure-func.type';
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
    = [B] extends [UnusedArg] ? ImpureFunc<A>
    : [C] extends [UnusedArg] ? ImpureFunc<Immutable<A>, Immutable<B>>
    : [D] extends [UnusedArg] ? ImpureFunc<Immutable<A>, Immutable<B>, Immutable<C>>
    : [E] extends [UnusedArg] ? ImpureFunc<Immutable<A>, Immutable<B>, Immutable<C>, Immutable<D>>
    : [F] extends [UnusedArg] ? ImpureFunc<Immutable<A>, Immutable<B>, Immutable<C>, Immutable<D>, Immutable<E>>
    : ImpureFunc<Immutable<A>, Immutable<B>, Immutable<C>, Immutable<D>, Immutable<E>, Immutable<F>>;
