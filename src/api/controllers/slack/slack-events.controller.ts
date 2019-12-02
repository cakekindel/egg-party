import { Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ISlackEvent, ISlackEventChallenge, SlackEventType } from '../../../shared/models/slack/events';
import { SlackApiService } from '../../services/slack';
import { SlackEventHandler } from '../../services/slack/handlers';

@Controller('v1/slack/events')
export class SlackEventsController
{
    constructor(private api: SlackApiService, private eventHandler: SlackEventHandler) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async receiveEvent(@Req() request: Request, @Res() respond: Response): Promise<Response>
    {
        const requestAuthentic = this.api.verifySlackRequest(request);

        if (!requestAuthentic)
            return respond.sendStatus(HttpStatus.UNAUTHORIZED);

        const event: ISlackEvent = request.body;

        if (event.type === SlackEventType.Challenge)
        {
            const challenge = event as ISlackEventChallenge;
            return respond.send(challenge.challenge);
        }
        else
        {
            await this.eventHandler.handleEvent(event);
            return respond.send('Ok, egger.');
        }
    }
}
