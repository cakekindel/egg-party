import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { ISlackResponse } from '../../../shared/models/slack/api';
import {
    SlackOauthAccessRequest,
    SlackOauthAccessResponse,
} from '../../../shared/models/slack/api/oauth';

@Injectable()
export class SlackApiOauthService {
    public async access(
        code: string,
        clientId: string,
        clientSecret: string
    ): Promise<SlackOauthAccessResponse> {
        const request = new SlackOauthAccessRequest(
            code,
            clientId,
            clientSecret
        );

        const response = await Axios.request<ISlackResponse>(request);
        this.throwIfNotOk(response.data);

        const responseObj = SlackOauthAccessResponse.fromRaw(response.data);
        return responseObj;
    }

    private throwIfNotOk(response: ISlackResponse): void {
        if (!response.ok) {
            throw new Error(`Slack API Error: ${response.error}`);
        }
    }
}
