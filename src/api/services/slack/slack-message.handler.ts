import { ConversationType } from '../../../shared/models/slack/conversations';
import { ISlackEventMessagePosted } from '../../../shared/models/slack/events';

import { EggGivingService } from '../egg-giving.service';

export class SlackMessageHandler
{
    constructor(private eggGivingService: EggGivingService) { }

    public async handleMessage(messageEvent: ISlackEventMessagePosted): Promise<void>
    {
         if (messageEvent.channel_type === ConversationType.DirectMessage)
             await this.handleDirectMessage(messageEvent);
         else if (messageEvent.channel_type === ConversationType.Public)
            await this.handleChannelMessage(messageEvent);
    }

    private async handleDirectMessage(messageEvent: ISlackEventMessagePosted): Promise<void>
    {
        throw new Error('Not Implemented');
    }

    private async handleChannelMessage(messageEvent: ISlackEventMessagePosted): Promise<void>
    {
        throw new Error('Not Implemented');
    }
}
