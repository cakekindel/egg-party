import { HttpRequest } from '@azure/functions';
import { Controller,  HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';

import { SlackApiService, SlackEventHandlerService } from '../services/slack';

@Controller('slack-events')
export class SlackEventsController
{
    constructor(private api: SlackApiService, private eventHandler: SlackEventHandlerService) { }

    @Post()
    public async receiveEvent(@Req() request: HttpRequest, @Res() respond: Response): Promise<void>
    {
        const requestVerified = await this.api.verifySlackRequest(request);
        if (!requestVerified)
        {
            respond.sendStatus(HttpStatus.UNAUTHORIZED);
            return;
        }

        const response = await this.eventHandler.handleEvent(request.body);
        respond.send(response);
    }
}
