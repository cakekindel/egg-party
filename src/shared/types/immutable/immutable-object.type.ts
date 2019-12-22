import { Immutable } from './immutable.type';

export type ImmutableObject<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};
