import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SlackTeamProvider } from '../../services/providers';
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

        const redirectToAppInSlack = `https://slack.com/app_redirect?app=${authResponse.appId}`;

        resp.status(HttpStatus.MOVED_PERMANENTLY)
            .header('Location', redirectToAppInSlack)
            .send();
    }
}
