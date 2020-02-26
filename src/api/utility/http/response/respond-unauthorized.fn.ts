import { ExpressResponse } from './express-response.type';
import { HttpStatus } from '@nestjs/common';

export function respondUnauthorized(respond: ExpressResponse): ExpressResponse {
    return respond.sendStatus(HttpStatus.UNAUTHORIZED);
}
