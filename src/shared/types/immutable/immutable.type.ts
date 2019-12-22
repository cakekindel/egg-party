import { ImmutablePrimitive } from './immutable-primitive.type';
import { ImmutableArray } from './immutable-array.type';
import { ImmutableMap } from './immutable-map.type';
import { ImmutableSet } from './immutable-set.type';
import { ImmutableObject } from './immutable-object.type';

// prettier-ignore
export type Immutable<T>
    = T extends ImmutablePrimitive ? T
    : T extends Array<infer U> ? ImmutableArray<U>
    : T extends Map<infer K, infer V> ? ImmutableMap<K, V>
    : T extends Set<infer M> ? ImmutableSet<M>
    : ImmutableObject<T>;
