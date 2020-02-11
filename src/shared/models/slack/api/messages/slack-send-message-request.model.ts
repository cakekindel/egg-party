import { AxiosRequestConfig, Method } from 'axios';

import { SlackBlockMessage } from '../../messages';
import { SlackApiBaseUrl } from '../slack-api-base-url.const';
import { isNotNullish } from '../../../../type-guards';

export class SlackSendMessageRequest implements AxiosRequestConfig {
    public baseURL = SlackApiBaseUrl;
    public url = 'chat.postMessage';
    public method: Method = 'POST';
    public data: SlackBlockMessage;
    public headers: {};

    constructor(token: string, message: SlackBlockMessage, hookUrl?: string) {
        this.data = message;
        this.headers = { Authorization: 'Bearer ' + token };

        if (isNotNullish(hookUrl)) {
            this.baseURL = '';
            this.url = hookUrl;
        }
    }
}
