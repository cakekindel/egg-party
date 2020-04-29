export function matchAll(regex: RegExp): (haystack: string) => RegExpMatchArray {
    return (haystack: string) => require('string.prototype.matchall')(haystack, regex);
}
