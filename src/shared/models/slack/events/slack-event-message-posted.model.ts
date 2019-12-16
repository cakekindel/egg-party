import { ISlackEvent } from './slack-event.model';

import { ConversationType } from '../conversations/conversation-type.enum';
import { MessageSubtype } from './message-subtype.enum';
import { SlackEventType } from './slack-event-type.enum';

export interface ISlackEventMessagePosted extends ISlackEvent {
    type: SlackEventType.MessagePosted;
    subtype?: MessageSubtype;
    text: string;

    user: string;
    channel: string;
    channel_type: ConversationType;
    ts: string;

    workspaceId: string;
}
