import { AxiosRequestConfig, Method } from 'axios';

import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackGetConversationInfoRequest implements AxiosRequestConfig {
    public baseURL = SlackApiBaseUrl;
    public url = 'conversations.info';
    public method: Method = 'GET';
    public params: {};

    constructor(token: string, channelId: string) {
        this.params = {
            token,
            channel: channelId,
        };
    }
}
