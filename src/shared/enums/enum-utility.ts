import { Nullable } from '../types/nullable.type';

type EnumValue<TEnum> = TEnum[keyof TEnum];

export const EnumUtility = {
    Parse<TEnum extends object>(
        enumInstance: TEnum,
        value: string | number
    ): Nullable<EnumValue<TEnum>> {
        const entries = Object.entries(enumInstance);
        const key = entries.find(
            ([_key, enumValue]) => value === enumValue
        )?.[0];

        return key ? enumInstance[key as keyof TEnum] : undefined;
    },
};
