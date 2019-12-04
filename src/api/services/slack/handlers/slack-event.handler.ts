import { Injectable } from '@nestjs/common';

import { ISlackEvent, SlackEventType } from '../../../../shared/models/slack/events';
import { ISlackEventMessagePosted, ISlackEventReactionAdded, ISlackEventWrapper } from '../../../../shared/models/slack/events';
import { SlackMessageHandler } from './slack-message.handler';
import { SlackReactionHandler } from './slack-reaction.handler';

@Injectable()
export class SlackEventHandler
{
    constructor(
        private messageHandler: SlackMessageHandler,
        private reactionHandler: SlackReactionHandler,
    ) { }

    public async handleEvent(event: ISlackEvent): Promise<void>
    {
        if (this.eventIsMessage(event))
        {
            event.event.workspaceId = event.team_id;
            return await this.messageHandler.handleMessage(event.event);
        }
        else if (this.eventIsReaction(event))
        {
            return await this.reactionHandler.handleReaction(event);
        }
    }

    private eventIsMessage(event: ISlackEvent): event is ISlackEventWrapper<ISlackEventMessagePosted>
    {
        return event.type === SlackEventType.EventWrapper
               && (event as ISlackEventWrapper).event.type === SlackEventType.MessagePosted;
    }

    private eventIsReaction(event: ISlackEvent): event is ISlackEventWrapper<ISlackEventReactionAdded>
    {
        return event.type === SlackEventType.EventWrapper
               && (event as ISlackEventWrapper).event.type === SlackEventType.ReactionAdded;
    }
}
