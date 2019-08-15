import { Environment } from '../enums/environment.enum';

export class EnvironmentVariables
{
    public static get SlackApiToken(): string { return this.GetVariable('SlackApiToken', true); }
    public static get SlackSigningSecret(): string { return this.GetVariable('SlackSigningSecret', true); }
    public static get Environment(): Environment { return this.GetVariable('Environment', true) as Environment; }

    private static GetVariable(variableName: string, required: boolean): string
    {
        const val = process.env[variableName];

        if (!val && required)
        {
            throw new Error(`Required Environment Variable not set: ${variableName}`);
        }

        return val || '';
    }
}
