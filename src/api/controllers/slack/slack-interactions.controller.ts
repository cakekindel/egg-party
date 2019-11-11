import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as qs from 'qs';

import { ISlackInteractionPayload } from '../../../shared/models/slack/interactions/slack-interaction-payload.model';

import { SlackApiService } from '../../services/slack';
import { SlackInteractionHandler } from '../../services/slack/handlers';

@Controller('v1/slack/interactions')
export class SlackInteractionsController
{
    constructor(private api: SlackApiService, private interactionHandler: SlackInteractionHandler) { }

    @Post()
    public async handleInteraction(@Req() request: Request, @Res() respond: Response): Promise<Response>
    {
        const requestVerified = this.api.verifySlackRequest(request);
        if (!requestVerified)
            return respond.sendStatus(HttpStatus.UNAUTHORIZED);

        const body: { payload: string; } = qs.parse(request.body);
        const payloadJson = body.payload;
        const interaction: ISlackInteractionPayload = JSON.parse(payloadJson);

        await this.interactionHandler.handleInteraction(interaction);

        return respond.sendStatus(HttpStatus.OK);
    }
}
