import { Response } from 'express';

export function respondOk<TBody = { ok: true }>(
    respond: Response,
    body?: TBody
): Response {
    return respond.send(body ?? { ok: true });
}
