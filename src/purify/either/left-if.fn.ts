import { Right, Left, Either } from 'purify-ts';

export function leftIf<L, R>(
    tester: (_: R) => boolean,
    left: L
): (_: R) => Either<L, R> {
    return (val: R) => (tester(val) ? Left(left) : Right(val));
}
