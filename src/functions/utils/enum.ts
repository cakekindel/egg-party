import { otherwise, strike, when } from '@matchbook/ts';
import { Option, some, none } from 'fp-ts/lib/Option';

interface Enum {
    [key: string]: string | number;
}
type SomeValueInEnum<TEnum> = TEnum[keyof TEnum];

export function parseEnumValue<TEnum extends Enum>(
    enum_: TEnum,
    val: string | number | symbol
): Option<SomeValueInEnum<TEnum>> {
    const isVal = (p: typeof val): p is SomeValueInEnum<TEnum> =>
        isValueInEnum(enum_, p);
    const isNumAndNotVal = (p: typeof val) =>
        !isVal(p) && typeof p === 'number';
    const isKey = (p: typeof val): p is keyof TEnum => isKeyInEnum(enum_, p);

    return strike(
        val,
        when(isVal, v => some(v)),
        when(isNumAndNotVal, none as Option<SomeValueInEnum<TEnum>>),
        when(isKey, k => some(enum_[k])),
        otherwise(none)
    );
}

export function isKeyInEnum<TEnum extends Enum>(
    enum_: TEnum,
    key: string | number | symbol
): key is keyof TEnum {
    return typeof key === 'string' && key in enum_;
}

export function isValueInEnum<TEnum extends Enum>(
    enum_: TEnum,
    val: string | number | symbol
): val is SomeValueInEnum<TEnum> {
    return Object.entries(enum_).some(([_, iterVal]) => iterVal === val);
}
