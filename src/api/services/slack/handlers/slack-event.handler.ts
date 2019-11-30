import { Injectable } from '@nestjs/common';

import { SlackEventType } from '../../../../shared/models/slack/events';
import { ISlackEvent, ISlackEventMessagePosted, ISlackEventWrapper } from '../../../../shared/models/slack/events';
import { SlackMessageHandler } from './slack-message.handler';

@Injectable()
export class SlackEventHandler
{
    constructor(private messageHandler: SlackMessageHandler) { }

    public async handleEvent(event: ISlackEvent): Promise<void>
    {
        const messageEvent = this.getMessageEventIfEventIsMessage(event);

        if (messageEvent)
        {
            return await this.messageHandler.handleMessage(messageEvent);
        }
    }

    private getMessageEventIfEventIsMessage(event: ISlackEvent): ISlackEventMessagePosted | undefined
    {
        const eventIsWrapper = event.type === SlackEventType.EventWrapper;
        if (eventIsWrapper)
        {
            const wrapper = event as ISlackEventWrapper;
            const innerEventIsMessage = wrapper.event.type === SlackEventType.MessagePosted;

            if (innerEventIsMessage)
            {
                const messageEvent = wrapper.event as ISlackEventMessagePosted;
                messageEvent.workspaceId = wrapper.team_id;

                return messageEvent;
            }
        }

        return undefined;
    }
}
