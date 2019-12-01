import { Injectable } from '@nestjs/common';

import { ISlackEvent, SlackEventType } from '../../../../shared/models/slack/events';
import { ISlackEventMessagePosted, ISlackEventWrapper } from '../../../../shared/models/slack/events';
import { TryGetOutput } from '../../../../shared/utility/try-get.pattern';
import { SlackMessageHandler } from './slack-message.handler';

@Injectable()
export class SlackEventHandler
{
    constructor(private messageHandler: SlackMessageHandler) { }

    public async handleEvent(event: ISlackEvent): Promise<void>
    {
        const tryGetMessage = this.tryGetInnerMessageEvent(event);

        if (tryGetMessage.success)
            return await this.messageHandler.handleMessage(tryGetMessage.output);
    }

    private tryGetInnerMessageEvent(event: ISlackEvent): TryGetOutput<ISlackEventMessagePosted>
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

                return { success: true, output: messageEvent };
            }
        }

        return { success: false };
    }
}
