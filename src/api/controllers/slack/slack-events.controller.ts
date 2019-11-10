import { Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { SlackApiService, SlackEventHandlerService } from '../../services/slack';

@Controller('v1/slack/events')
export class SlackEventsController
{
    constructor(private api: SlackApiService, private eventHandler: SlackEventHandlerService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async receiveEvent(@Req() request: Request, @Res() respond: Response): Promise<void>
    {
        const requestVerified = this.api.verifySlackRequest(request);

        if (requestVerified)
        {
            const response = await this.eventHandler.handleEvent(request.body);
            respond.send(response);
        }

        respond.sendStatus(HttpStatus.UNAUTHORIZED);
    }
}
