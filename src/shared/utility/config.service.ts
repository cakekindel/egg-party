import { Injectable } from '@nestjs/common';

import { Environment } from '../enums/environment.enum';

@Injectable()
export class ConfigService
{
    public get slackApiToken(): string { return this.getRequiredVariable('SLACK_APITOKEN'); }
    public get slackSigningSecret(): string { return this.getRequiredVariable('SLACK_SIGNINGSECRET'); }
    public get environment(): Environment { return this.getRequiredVariable('ENVIRONMENT') as Environment; }

    private getRequiredVariable(variableName: string): string
    {
        const val = this.GetVariable(variableName);

        if (!val)
        {
            throw new Error(`Required Environment Variable not set: ${variableName}`);
        }

        return val;
    }

    private GetVariable(variableName: string): string | undefined
    {
        return process.env[variableName];
    }
}
