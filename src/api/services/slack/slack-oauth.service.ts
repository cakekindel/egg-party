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
    constructor(
        private readonly config: ConfigService,
        private readonly slackTeams: SlackTeamProvider
    ) {}

    public async handleInstallation(oauthCode: string): Promise<void> {
        const oauthAccess = await this.getOauthAccess(
            oauthCode,
            this.config.slackClientId(),
            this.config.slackClientSecret()
        );

        await this.slackTeams.create(
            oauthAccess.team.id,
            oauthAccess.accessToken,
            oauthAccess.botUserId
        );
    }

    public async getOauthAccess(
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
