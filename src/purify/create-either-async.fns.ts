import { Either, EitherAsync, Left, Maybe, Right } from 'purify-ts';

/**
 * might not be necessary after all
 */
export const CreateEitherAsync = {
    wrapLeft<L>(value: L): EitherAsync<L, never> {
        return EitherAsync(({ liftEither }) => liftEither(Left(value)));
    },
    wrapRight<R>(value: R): EitherAsync<never, R> {
        return EitherAsync(({ liftEither }) => liftEither(Right(value)));
    },
    wrapEither<L, R>(either: Either<L, R>): EitherAsync<L, R> {
        return EitherAsync(({ liftEither }) => liftEither(either));
    },
    fromPromise<T>(promise: Promise<T>): EitherAsync<Error, T> {
        const eitherPromise = promise.then(v => Either.of<Error, T>(v));
        return EitherAsync(({ fromPromise }) => fromPromise(eitherPromise));
    },
    fromPromiseOfNullable<T>(
        p: Promise<T | null | undefined>
    ): EitherAsync<Error, Maybe<T>> {
        return CreateEitherAsync.fromPromise(p.then(Maybe.fromNullable));
    },
};
