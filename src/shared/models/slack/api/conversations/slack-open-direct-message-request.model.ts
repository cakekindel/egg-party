import { AxiosRequestConfig, Method } from 'axios';
import { EnvironmentVariables } from '../../../../utility';
import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackOpenDirectMessageRequest implements AxiosRequestConfig
{
    public baseURL = SlackApiBaseUrl;
    public url = 'im.open';
    public method: Method = 'POST';
    public params = {
        token: EnvironmentVariables.SlackApiToken,
        user: ''
    };

    constructor(user: string)
    {
        this.params.user = user;
    }
}
