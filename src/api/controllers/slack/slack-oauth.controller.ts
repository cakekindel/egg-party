import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { sendRedirectResponse } from '../../functions/response';
import { SlackTeamProvider } from '../../../business/providers';
import { SlackOauthService } from '../../services/slack';

@Controller('v1/slack/oauth')
export class SlackOauthController {
    constructor(
        private readonly slackOauth: SlackOauthService,
        private readonly slackTeams: SlackTeamProvider
    ) {}

    @Get('redirect')
    public async redirect(
        @Req() req: Request,
        @Res() resp: Response
    ): Promise<void> {
        const installCode: string = req.query.code;
        const authResponse = await this.slackOauth.authenticate(installCode);

        await this.slackTeams.create(
            authResponse.team.id,
            authResponse.accessToken,
            authResponse.botUserId
        );

        sendRedirectResponse(
            resp,
            `https://slack.com/app_redirect?app=${authResponse.appId}`
        );
    }
}
