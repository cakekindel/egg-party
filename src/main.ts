import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { json, urlencoded } from 'body-parser';
import { IncomingMessage, ServerResponse } from 'http';
import 'reflect-metadata';

async function bootstrap(): Promise<void>
{
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    app.setGlobalPrefix('api');

    app.use(json({ verify: populateRequestRawBody }));
    app.use(urlencoded({ verify: populateRequestRawBody, extended: true }));

    await app.listen(3000);
}

function populateRequestRawBody
(
    request: IncomingMessage & { rawBody: string },
    response: ServerResponse,
    buffer: Buffer,
    encoding?: string
): void
{
    if (buffer && buffer.length)
    {
        request.rawBody = buffer.toString(encoding || 'utf8');
    }
}

bootstrap();
