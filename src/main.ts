import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { INestApplication } from '@nestjs/common';
import { config as loadDotEnv } from 'dotenv';
import { json, urlencoded } from 'express';
import { IRequestWithRawBody } from './shared/models/express/request-with-raw-body.model';

declare const module: { hot: { accept: () => void, dispose: (onDispose: () => void) => void } };

export class Main
{
    public static async run(): Promise<void>
    {
        Main.loadEnvironmentVariables();

        const app = await Main.createNestApp();

        if (process.env.ENVIRONMENT === 'Local')
        {
            Main.enableWebpackHotReloads(app);
        }
    }

    private static async createNestApp(): Promise<INestApplication>
    {
        const app = await NestFactory.create(AppModule, { bodyParser: false });
        Main.useRawBodyMiddleware(app);

        app.setGlobalPrefix('api');
        await app.listenAsync(process.env.PORT || 7000);

        return app;
    }

    private static useRawBodyMiddleware(app: INestApplication): void
    {
        app.use(json({ verify: Main.rawBodyMiddleware }));
        app.use(urlencoded({ verify: Main.rawBodyMiddleware, extended: true }));
    }

    private static rawBodyMiddleware(request: IRequestWithRawBody, _response: never, buffer: Buffer, encoding?: string): void
    {
        if (buffer?.length)
            request.rawBody = buffer.toString(encoding || 'utf8');
    }

    private static loadEnvironmentVariables(): void
    {
        if (!process.env.ENVIRONMENT)
        {
            try
            {
                const result = loadDotEnv({ path: './.env' });

                if (result.error)
                    throw result.error;
            }
            catch (e)
            {
                console.error('Failed to load env file.');
                console.error(e.message);
            }
        }
    }

    private static enableWebpackHotReloads(app: INestApplication): void
    {
        if (module.hot)
        {
            module.hot.accept();
            module.hot.dispose(() => app.close());
        }
    }
}

Main.run();
