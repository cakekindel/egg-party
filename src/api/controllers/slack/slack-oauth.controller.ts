import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '../../../shared/utility';
import { SlackOauthService } from '../../services/slack';
import { SlackOauthScope } from '../../../shared/models/slack/api/oauth';
import { SlackTeamRepo } from '../../../db/repos/slack-team.repo';

const EGG_PARTY_OAUTH_SCOPES = [
    SlackOauthScope.ReadChannelMessages,
    SlackOauthScope.ReadDmMessages,
    SlackOauthScope.ReadReactions,
    SlackOauthScope.SendMessages,
    SlackOauthScope.StartDirectMessages,
];

@Controller('v1/slack/oauth')
export class SlackOauthController {
    constructor(
        private readonly slackOauth: SlackOauthService,
        private readonly config: ConfigService
    ) {}

    @Get('install')
    public async install(@Res() resp: Response): Promise<void> {
        const clientId = this.config.slackClientId();
        const scopesCommaSeparated = EGG_PARTY_OAUTH_SCOPES.join(',');
        const installUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopesCommaSeparated}`;

        resp.status(HttpStatus.MOVED_PERMANENTLY)
            .header('Location', installUrl)
            .send();
    }

    @Get('redirect')
    public async redirect(
        @Req() req: Request,
        @Res() resp: Response
    ): Promise<void> {
        await this.slackOauth.handleInstallation(req.query.code);

        resp.status(HttpStatus.MOVED_PERMANENTLY)
            .header('Location', 'https://www.slack.com/')
            .send();
    }
}
