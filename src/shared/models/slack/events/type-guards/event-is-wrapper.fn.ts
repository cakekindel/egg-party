import { ISlackEvent } from '../slack-event.model';
import { ISlackEventWrapper } from '../slack-event-wrapper.model';
import { SlackEventType } from '../slack-event-type.enum';

export function eventIsWrapper(
    event: ISlackEvent
): event is ISlackEventWrapper {
    return event.type === SlackEventType.EventWrapper;
}
