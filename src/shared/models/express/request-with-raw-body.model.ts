import { Request } from 'express';

export type RequestWithRawBody = Request & { rawBody: string };
