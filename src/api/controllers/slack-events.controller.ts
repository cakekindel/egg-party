import { Body, Controller,  HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { SlackApiService, SlackEventHandlerService } from '../services/slack';

import { ISlackEvent } from '../../shared/models/slack/events';

@Controller('slack-events')
export class SlackEventsController
{
    constructor(private eventHandler: SlackEventHandlerService, private slackApi: SlackApiService) { }

    @Post()
    public async receiveEvent
    (
        @Req() request: Request,
        @Res() respond: Response,
        @Body() slackEvent: ISlackEvent
    ): Promise<void>
    {
        const requestVerified = await this.slackApi.verifySlackRequest(request);
        if (requestVerified)
        {
            const response = await this.eventHandler.handleEvent(slackEvent);
            respond.send(response);
        }
        else
        {
            respond.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    }
}
