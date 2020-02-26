import { ISlackEvent } from '../slack-event.model';
import { ISlackEventMessagePosted } from '../slack-event-message-posted.model';
import { SlackEventType } from '../slack-event-type.enum';

export function eventIsMessage(
    event: ISlackEvent
): event is ISlackEventMessagePosted {
    return event.type === SlackEventType.MessagePosted;
}
