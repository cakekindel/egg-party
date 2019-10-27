import { AxiosRequestConfig, Method } from 'axios';

import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackOpenDirectMessageRequest implements AxiosRequestConfig
{
    public baseURL = SlackApiBaseUrl;
    public url = 'im.open';
    public method: Method = 'POST';
    public params: { };

    constructor(token: string, user: string)
    {
        this.params = { user, token };
    }
}
