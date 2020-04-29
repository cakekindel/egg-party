export function nameof<T>(name: keyof T): typeof name {
    return name;
}
