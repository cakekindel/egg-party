import { Nullable } from '../../types/nullable.type';
import { MetadataKeys } from '../metadata-keys.enum';

type Key = string | symbol;

export const JsonIgnore: () => PropertyDecorator = () => (target, key) => {
    const ignoredProps =
        (Reflect.getMetadata(
            MetadataKeys.JsonIgnoredProperties,
            target
        ) as Nullable<Key[]>) ?? [];
    ignoredProps.push(key);

    Reflect.defineMetadata(
        MetadataKeys.JsonIgnoredProperties,
        ignoredProps,
        target
    );
};
