export type AnyErrSev = ErrSev.Error | ErrSev.Warn | ErrSev.Debug;

export enum ErrSev {
    Error,
    Warn,
    Debug,
}

export type Err<
    Kind extends string = string,
    Severity extends ErrSev = AnyErrSev,
    Context extends object = object
> = { kind: Kind; context?: Context; sev: Severity; message: string };

export function toError(e: Err): Error {
    return {
        name: e.kind,
        message: e.message,
    };
}

export function error<Kind extends string, Context extends object>(
    kind: Kind,
    context?: Context
): Err<Kind, ErrSev.Error, Context> {
    return create(kind, ErrSev.Error, context);
}

export function warn<Kind extends string, Context extends object>(
    kind: Kind,
    context?: Context
): Err<Kind, ErrSev.Warn, Context> {
    return create(kind, ErrSev.Warn, context);
}

export function dbg<Kind extends string, Context extends object>(
    kind: Kind,
    context?: Context
): Err<Kind, ErrSev.Debug, Context> {
    return create(kind, ErrSev.Debug, context);
}

export function create<
    Kind extends string,
    Sev extends ErrSev,
    Context extends object
>(kind: Kind, sev: Sev, context?: Context): Err<Kind, Sev, Context> {
    const contextStr = context
        ? JSON.stringify(context)
        : 'No context provided';

    const message = [
        'ERR!',
        `- Kind: ${kind}`,
        `- Context: ${contextStr}`,
    ].join('\n');

    return {
        kind,
        context,
        sev: sev ?? ErrSev.Error,
        message,
    };
}
