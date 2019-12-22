import { Immutable } from './immutable.type';

export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
