import { ISlackEvent } from './slack-event.model';

import { ConversationType } from '../conversations/conversation-type.enum';
import { SlackEventType } from './slack-event-type.enum';

export interface ISlackEventMessagePosted extends ISlackEvent
{
    type: SlackEventType.MessagePosted;
    subtype?: string;
    text: string;

    user: string;
    channel: string;
    channel_type: ConversationType;
    ts: string;
}
