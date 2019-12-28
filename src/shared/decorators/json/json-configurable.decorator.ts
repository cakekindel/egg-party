import { MetadataKeys } from '../metadata-keys.enum';
import { PureFunc } from '../../types/delegates/func';
import fp = require('lodash/fp');
import { Nullable } from '../../types/nullable.type';
import { Key } from '../key.type';

const removeIgnoredProperties: PureFunc<object, object> = obj => {
    const ignoredKeys =
        (Reflect.getMetadata(
            MetadataKeys.JsonIgnoredProperties,
            obj
        ) as Nullable<Key[]>) ?? [];

    const copyAndRemoveIgnoredKeys = fp.pipe(
        fp.cloneDeep,
        fp.omit(ignoredKeys)
    ) as PureFunc<object, object>;

    return copyAndRemoveIgnoredKeys(obj);
};

export const JsonConfigurable: () => ClassDecorator = () => ctor => {
    const originalToJson =
        ctor.prototype.toJSON ??
        function defaultToJSON(this: object): object {
            return this;
        };

    ctor.prototype.toJSON = function overriddenToJSON(this: object): object {
        const obj = originalToJson.apply(this);

        return fp.pipe(removeIgnoredProperties)(obj);
    };
};
