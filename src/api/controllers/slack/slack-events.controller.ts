import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ISlackEvent, ISlackEventChallenge, SlackEventType } from '../../../shared/models/slack/events';
import { SlackApiService, SlackEventHandler } from '../../services/slack';

@Controller('v1/slack/events')
export class SlackEventsController
{
    constructor(private api: SlackApiService, private eventHandler: SlackEventHandler) { }

    @Post()
    public async receiveEvent(@Req() request: Request, @Res() respond: Response): Promise<Response>
    {
        const event: ISlackEvent = request.body;
        const requestVerified = this.api.verifySlackRequest(request);

        let statusCode: HttpStatus;
        let response: string;

        if (!requestVerified)
        {
            statusCode = HttpStatus.UNAUTHORIZED;
            response = '';
        }
        else if (event.type === SlackEventType.Challenge)
        {
            const challengeEvent = event as ISlackEventChallenge;

            statusCode = HttpStatus.OK;
            response = challengeEvent.challenge;
        }
        else
        {
            await this.eventHandler.handleEvent(request.body);

            statusCode = HttpStatus.OK;
            response = 'OK, Egger.';
        }

        return respond.status(statusCode).send(response);
    }
}
