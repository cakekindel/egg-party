import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export function sendRedirectResponse(resp: Response, url: string): void {
    resp.status(HttpStatus.MOVED_PERMANENTLY)
        .header('Location', url)
        .send();
}
