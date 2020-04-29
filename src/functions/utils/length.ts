export const lengthGt = <T extends { length: number }>(len: number) => (long: T) => long.length > len;
