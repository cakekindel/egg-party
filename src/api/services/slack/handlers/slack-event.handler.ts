import { Injectable } from '@nestjs/common';

import { ISlackEvent, SlackEventType } from '../../../../shared/models/slack/events';
import { ISlackEventMessagePosted, ISlackEventWrapper } from '../../../../shared/models/slack/events';
import { SlackMessageHandler } from './slack-message.handler';

@Injectable()
export class SlackEventHandler
{
    constructor(private messageHandler: SlackMessageHandler) { }

    public async handleEvent(event: ISlackEvent): Promise<void>
    {
        if (this.eventIsMessage(event))
        {
            event.event.workspaceId = event.team_id;
            return await this.messageHandler.handleMessage(event.event);
        }
    }

    private eventIsMessage(event: ISlackEvent): event is ISlackEventWrapper<ISlackEventMessagePosted>
    {
        return event.type === SlackEventType.EventWrapper
               && (event as ISlackEventWrapper).event.type === SlackEventType.MessagePosted;
    }
}
