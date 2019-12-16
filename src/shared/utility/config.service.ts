import { Injectable } from '@nestjs/common';

import { Environment } from '../enums/environment.enum';
import { ITypeormConfig } from './typeorm-options.interface';

@Injectable()
export class ConfigService {
    public get slackApiToken(): string {
        return this.getRequiredEnv('SLACK_APITOKEN');
    }
    public get slackSigningSecret(): string {
        return this.getRequiredEnv('SLACK_SIGNINGSECRET');
    }
    public get environment(): Environment {
        return this.getRequiredEnv('ENVIRONMENT') as Environment;
    }
    public get typeOrmConfig(): ITypeormConfig {
        const hostUrl = this.getRequiredEnv('TYPEORM_HOST');
        const adminUsername = this.getRequiredEnv('TYPEORM_USERNAME');
        const adminPassword = this.getRequiredEnv('TYPEORM_PASSWORD');
        const databaseName = this.getRequiredEnv('TYPEORM_DATABASE');
        return { hostUrl, adminUsername, adminPassword, databaseName };
    }

    private getRequiredEnv(variableName: string): string {
        const val =
            this.getEnv(variableName) ??
            this.getEnv('APPSETTING_' + variableName);

        if (!val)
            throw new Error(
                `Required Environment Variable not set: ${variableName}`
            );

        return val;
    }

    private getEnv(variableName: string): string | undefined {
        return process.env[variableName];
    }
}
