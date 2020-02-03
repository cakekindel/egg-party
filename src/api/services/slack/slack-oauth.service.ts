import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import {
    SlackOauthAccessResponse,
    SlackOauthAccessRequest,
} from '../../../shared/models/slack/api/oauth';
import { ISlackResponse } from '../../../shared/models/slack/api';
import { ConfigService } from '../../../shared/utility';
import { SlackTeamProvider } from '../providers';

@Injectable()
export class SlackOauthService {
    constructor(private readonly config: ConfigService) {}

    public async authenticate(
        installationCode: string
    ): Promise<SlackOauthAccessResponse> {
        const slackAppId = this.config.slackClientId();
        const slackAppSecret = this.config.slackClientSecret();

        const request = new SlackOauthAccessRequest(
            installationCode,
            slackAppId,
            slackAppSecret
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
