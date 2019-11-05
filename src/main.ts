import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { config as loadDotEnv } from 'dotenv';
import { INestApplication } from '@nestjs/common';

declare const module: { hot: { accept: () => void, dispose: (onDispose: () => void) => void } };

export class Main
{
    public static async run(): Promise<void>
    {
        Main.tryLoadDotEnv();

        const app = await Main.createNestApp();

        if (process.env.Environment === 'Local')
        {
            Main.enableWebpackHotReloads(app);
        }
    }

    private static async createNestApp(): Promise<INestApplication>
    {
        const app = await NestFactory.create(AppModule, { bodyParser: false });
        app.setGlobalPrefix('api');
        await app.listenAsync(process.env.PORT || 7000);

        return app;
    }

    private static tryLoadDotEnv(): void
    {
        try
        {
            loadDotEnv({ path: './.env' });
        }
        catch (e) { }
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
