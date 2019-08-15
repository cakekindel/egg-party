import { AxiosRequestConfig, Method } from 'axios';

import { EnvironmentVariables } from '../../../../utility';
import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackAuthTestRequest implements AxiosRequestConfig
{
    public baseURL = SlackApiBaseUrl;
    public url = 'auth.test';
    public method: Method = 'POST';
    public headers = {
        Authorization: 'Bearer ' + EnvironmentVariables.SlackApiToken
    };
}
