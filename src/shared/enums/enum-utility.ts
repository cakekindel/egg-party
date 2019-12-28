import { Nullable } from '../types/nullable.type';

interface Enum {
    [key: string]: string | number;
}
type EnumValue<TEnum> = TEnum[keyof TEnum];

export const EnumUtility = {
    Parse<TEnum extends Enum>(
        enumInstance: TEnum,
        value: string | number
    ): Nullable<EnumValue<TEnum>> {
        const valueIsKey = value in enumInstance;
        const valueInEnum = Object.entries(enumInstance).some(
            ([_, enumVal]) => enumVal === value
        );

        if (valueIsKey && typeof value !== 'number') {
            return enumInstance[value as keyof TEnum];
        } else if (valueInEnum) {
            return value as EnumValue<TEnum>;
        } else {
            return undefined;
        }
    },
};
