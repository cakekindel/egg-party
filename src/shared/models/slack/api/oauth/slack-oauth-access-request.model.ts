import { AxiosRequestConfig, AxiosBasicCredentials } from 'axios';
import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackOauthAccessRequest implements AxiosRequestConfig {
    public readonly responseType = 'text';
    public readonly baseURL = SlackApiBaseUrl;
    public readonly url = 'oauth.v2.access';
    public readonly method = 'POST';
    public readonly params: object;
    public readonly auth: AxiosBasicCredentials;

    constructor(code: string, clientId: string, clientSecret: string) {
        this.params = { code };
        this.auth = {
            username: clientId,
            password: clientSecret,
        };
    }
}
