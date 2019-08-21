import { HttpRequest } from '@azure/functions';
import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import * as qs from 'qs';

import { ISlackInteractionPayload } from '../../shared/models/slack/interactions/slack-interaction-payload.model';
import { SlackApiService } from '../services/slack';
import { SlackInteractionHandlerService } from '../services/slack/slack-interaction-handler.service';

@Controller('slack-interactions')
export class SlackInteractionsController
{
    constructor(private api: SlackApiService, private interactionHandler: SlackInteractionHandlerService) { }

    @Post()
    public async handleInteraction
    (
        @Req() request: HttpRequest,
        @Res() respond: Response,
    ): Promise<void>
    {
        const requestVerified = await this.api.verifySlackRequest(request);
        if (!requestVerified)
        {
            respond.sendStatus(HttpStatus.UNAUTHORIZED);
            return;
        }

        respond.sendStatus(HttpStatus.OK);

        const payloadJson = (qs.parse(request.body) as { payload: string }).payload;
        const interaction: ISlackInteractionPayload = JSON.parse(payloadJson);

        await this.interactionHandler.handleInteraction(interaction);
    }
}
