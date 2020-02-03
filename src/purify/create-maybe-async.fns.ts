import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';

export const CreateMaybeAsync = {
    ofNothing<T>(): MaybeAsync<T> {
        return CreateMaybeAsync.fromMaybe<T>(Nothing);
    },
    fromJust<T>(value: T): MaybeAsync<T> {
        return MaybeAsync(({ liftMaybe }) => liftMaybe(Just(value)));
    },
    fromMaybe<T>(maybe: Maybe<T>): MaybeAsync<T> {
        return MaybeAsync(({ liftMaybe }) => liftMaybe(maybe));
    },
    fromPromiseOfMaybe<T>(promise: Promise<Maybe<T>>): MaybeAsync<T> {
        return MaybeAsync(({ fromPromise }) => fromPromise(promise));
    },
    fromPromiseOfNullable<T>(p: Promise<T | null | undefined>): MaybeAsync<T> {
        return CreateMaybeAsync.fromPromiseOfMaybe(p.then(Maybe.fromNullable));
    },
};
