import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '../../../shared/utility';
import { SlackApiOauthService } from '../../services/slack';
import { SlackOauthScope } from '../../../shared/models/slack/api/oauth';

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
        private readonly slackOauth: SlackApiOauthService,
        private readonly config: ConfigService
    ) {}

    @Get('install')
    public async install(@Res() res: Response): Promise<void> {
        const clientId = this.config.slackClientId();
        const scopesCommaSeparated = EGG_PARTY_OAUTH_SCOPES.join(',');

        res.status(HttpStatus.MOVED_PERMANENTLY)
            .header(
                'Location',
                `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopesCommaSeparated}`
            )
            .send();
    }

    @Get('redirect')
    public async redirect(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<void> {
        const access = await this.slackOauth.access(
            req.query.code,
            this.config.slackClientId(),
            this.config.slackClientSecret()
        );

        res.status(HttpStatus.MOVED_PERMANENTLY)
            .header('Location', 'https://www.slack.com/')
            .send();
    }
}
