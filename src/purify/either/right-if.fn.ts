import { Either, Right } from 'purify-ts';

export function rightIf<L, R>(
    tester: (_: R) => boolean,
    rightIfTrue: R
): (_: R) => Either<L, R> {
    return (right: R) => (tester(right) ? Right(right) : Right(rightIfTrue));
}
