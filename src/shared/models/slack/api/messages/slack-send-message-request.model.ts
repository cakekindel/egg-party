import { AxiosRequestConfig, Method } from 'axios';

import { EnvironmentVariables } from '../../../../utility';

import { SlackBlockMessage } from '../../messages';
import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackSendMessageRequest implements AxiosRequestConfig
{
    public baseURL = SlackApiBaseUrl;
    public url = 'chat.postMessage';
    public method: Method = 'POST';
    public data: SlackBlockMessage;

    public headers = {
        Authorization: 'Bearer ' + EnvironmentVariables.SlackApiToken
    };

    constructor
    (
        public message: SlackBlockMessage,
    )
    {
        this.data = message;
    }
}
