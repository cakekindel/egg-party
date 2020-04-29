import { Either, Nothing } from 'purify-ts';
import { leftIf } from '../../purify/either';
import { isNotNullish } from '../type-guards';

/**
 * @description
 * Base function for pattern matching.
 *
 * @example
 * const matchers: (_: unknown) => (string | undefined) = [
 *     val => val instanceof Error    ? 'Uh-Oh!'         : undefined,
 *     val => typeof val === 'string' ? 'You got bytes!' : undefined,
 * ];
 *
 * let output: string;
 *
 * // Logs: 'You got bytes!'
 * console.log(match('test', matchers).extract());
 *
 * // Logs: 'Uh-Oh!'
 * console.log(match(Error('fail!'), matchers).extract());
 *
 * // Logs: Error('No matches & no default case')
 * console.log(match(12, matchers).extract());
 *
 * // Logs: 'default case!'
 * console.log(match(12, matchers, () => 'default case!').extract());
 *
 * @example
 * const matchers: (_: SlackEvent) => (TOut | undefined) = [ ... ];
 *
 * let output: string;
 *
 * // Logs: 'You got bytes!'
 * console.log(match('test', matchers));
 *
 * // Logs: 'Uh-Oh!'
 * console.log(match(Error('fail!'), matchers));
 *
 * // Logs: 'default case!'
 * console.log(match(12, matchers, () => 'default case!'));
 *
 * @param val
 * @param matchHandlers
 * @param defaultHandler
 */
export function match<TIn, TOut>(
    val: TIn,
    matchHandlers: Array<(_: TIn) => TOut | undefined>,
    defaultHandler?: (_: TIn) => TOut
): Either<Error, TOut> {
    const errorIfMultiple = leftIf(
        (matches: TOut[]) => matches.length > 1,
        new Error('Multiple matches')
    );

    const errorIfNoMatchAndNoDefault = leftIf(
        (out: TOut) => !out && !defaultHandler,
        new Error('No matches & no default case')
    );

    return Either.of<Error, typeof Nothing>(Nothing)
        .map(() => matchHandlers.map(handler => handler(val)))
        .map(matches => matches.filter(isNotNullish))
        .chain(errorIfMultiple)
        .map(matches => matches[0])
        .chain(errorIfNoMatchAndNoDefault)
        .map(out => (!out && defaultHandler ? defaultHandler(val) : out));
}
