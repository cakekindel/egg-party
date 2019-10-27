import { Injectable } from '@nestjs/common';

import { Environment } from '../enums/environment.enum';

@Injectable()
export class ConfigService
{
    public get slackApiToken(): string { return this.GetRequiredVariable('SlackApiToken'); }
    public get slackSigningSecret(): string { return this.GetRequiredVariable('SlackSigningSecret'); }
    public get environment(): Environment { return this.GetRequiredVariable('Environment') as Environment; }

    private GetRequiredVariable(variableName: string): string
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
