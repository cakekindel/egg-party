import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config as loadDotEnv } from 'dotenv';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { ImpureFunc } from './shared/types/delegates/func';
import { IRequestWithRawBody } from './shared/models/express/request-with-raw-body.model';
import { Nullable } from './shared/types/nullable.type';

type VerifyMiddleware = ImpureFunc<
    IRequestWithRawBody,
    object,
    Buffer,
    Nullable<string>,
    void
>;

export class EggPartyApplication {
    private nestApp?: INestApplication;

    private readonly keepRawBodyMiddleware: VerifyMiddleware = (
        request,
        _,
        buffer,
        encoding
    ) => {
        if (buffer?.length) {
            request.rawBody = buffer.toString(encoding || 'utf8');
        }
    };

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
        const verify = this.keepRawBodyMiddleware;
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
}
