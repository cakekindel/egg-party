import { AxiosRequestConfig, Method } from 'axios';

import { EnvironmentVariables } from '../../../../utility';
import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackGetConversationInfoRequest implements AxiosRequestConfig
{
    public baseURL = SlackApiBaseUrl;
    public url = 'conversations.info';
    public method: Method = 'GET';
    public params = {
        token: EnvironmentVariables.SlackApiToken,
        channel: this.channelId
    };

    constructor(public channelId: string) { }
}
