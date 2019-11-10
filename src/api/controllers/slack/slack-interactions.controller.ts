import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as qs from 'qs';

import { ISlackInteractionPayload } from '../../../shared/models/slack/interactions/slack-interaction-payload.model';
import { SlackApiService } from '../../services/slack';
import { SlackInteractionHandlerService } from '../../services/slack/slack-interaction-handler.service';

@Controller('v1/slack/interactions')
export class SlackInteractionsController
{
    constructor(private api: SlackApiService, private interactionHandler: SlackInteractionHandlerService) { }

    @Post()
    public async handleInteraction(@Req() request: Request, @Res() respond: Response): Promise<Response>
    {
        const requestVerified = this.api.verifySlackRequest(request);
        if (!requestVerified)
            return respond.sendStatus(HttpStatus.UNAUTHORIZED);

        const payloadWrapper = qs.parse(request.body) as { payload: string; };
        if (!payloadWrapper || !payloadWrapper.payload)
            throw new Error('Invalid interaction body');

        const payloadJson = payloadWrapper.payload;
        const interaction: ISlackInteractionPayload = JSON.parse(payloadJson);

        await this.interactionHandler.handleInteraction(interaction);

        return respond.sendStatus(HttpStatus.OK);
    }
}
