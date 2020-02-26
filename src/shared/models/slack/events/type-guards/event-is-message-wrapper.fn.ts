import { ISlackEventMessagePosted } from '../slack-event-message-posted.model';
import { ISlackEventWrapper } from '../slack-event-wrapper.model';
import { ISlackEvent } from '../slack-event.model';
import { eventIsMessage } from './event-is-message.fn';
import { eventIsWrapper } from './event-is-wrapper.fn';

export function eventIsWrappedMessage(
    event: ISlackEvent
): event is ISlackEventWrapper<ISlackEventMessagePosted> {
    return eventIsWrapper(event) && eventIsMessage(event.event);
}
