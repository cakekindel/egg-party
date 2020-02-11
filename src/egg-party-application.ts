import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config as loadDotEnv } from 'dotenv';
import { json, Response, urlencoded } from 'express';
import { AppModule } from './app.module';
import { IRequestWithRawBody } from './shared/models/express/request-with-raw-body.model';

export class EggPartyApplication {
    private nestApp?: INestApplication;

    public async run(): Promise<void> {
        this.loadEnvironmentVariables();

        const app = await this.createNestApp();
        this.nestApp = app;

        this.configure();

        await this.nestApp?.listenAsync(process.env.PORT || 7000);
    }

    private configure(): void {
        this.nestApp?.setGlobalPrefix('api');
        this.keepRawBodyOfRequests();
    }

    private keepRawBodyOfRequests(): void {
        const verify = this.populateRawBody;
        this.nestApp?.use(json({ verify }));
        this.nestApp?.use(urlencoded({ verify, extended: true }));
    }

    private loadEnvironmentVariables(): void {
        if (!process.env.ENVIRONMENT) {
            try {
                const result = loadDotEnv({ path: './.env' });

                if (result.error) throw result.error;
            } catch (e) {
                console.error('Failed to load env file.');
                console.error(e.message);
            }
        }
    }

    private async createNestApp(): Promise<INestApplication> {
        const app = await NestFactory.create(AppModule, { bodyParser: false });

        return app;
    }

    private populateRawBody(
        req: IRequestWithRawBody,
        _: Response,
        buf: Buffer,
        encoding?: string
    ): void {
        if (buf?.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    }
}
