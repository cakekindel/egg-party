import { Maybe } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';

export const CreateMaybeAsync = {
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
