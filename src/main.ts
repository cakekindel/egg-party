import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { INestApplication } from '@nestjs/common';
import { config as loadDotEnv } from 'dotenv';

declare const module: { hot: { accept: () => void, dispose: (onDispose: () => void) => void } };

export class Main
{
    public static async run(): Promise<void>
    {
        if (process.env.ENVIRONMENT === 'Local')
        {
            Main.loadDotEnv();

            const app = await Main.createNestApp();
            Main.enableWebpackHotReloads(app);
        }
        else
        {
            await Main.createNestApp();
        }
    }

    private static async createNestApp(): Promise<INestApplication>
    {
        const app = await NestFactory.create(AppModule, { bodyParser: false });
        app.setGlobalPrefix('api');
        await app.listenAsync(process.env.PORT || 7000);

        return app;
    }

    private static loadDotEnv(): void
    {
        try
        {
            const result = loadDotEnv({ path: './.env' });
            const string = 'testing';

            if (result.error) throw result.error;
        }
        catch (e)
        {
            console.error('Failed to load env file.');
            console.error(e.message);
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
