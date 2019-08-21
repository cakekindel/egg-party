import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

export default function(context: Context, req: HttpRequest): void
{
    AzureHttpAdapter.handle(createApp, context, req);
}

async function createApp(): Promise<INestApplication>
{
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    app.setGlobalPrefix('api');
    await app.init();
    return app;
}
