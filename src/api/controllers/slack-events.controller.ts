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
        @Res() response: Response,
        @Body() slackEvent: ISlackEvent
    ): Promise<string | void>
    {
        const requestVerified = await this.slackApi.verifySlackRequest(request);
        if (requestVerified)
        {
            return await this.eventHandler.handleEvent(slackEvent);
        }
        else
        {
            response.send(HttpStatus.UNAUTHORIZED);
            return;
        }
    }
}
