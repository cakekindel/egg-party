import { ISlackEventReactionAdded } from '../slack-event-reaction-added.model';
import { ISlackEventWrapper } from '../slack-event-wrapper.model';
import { ISlackEvent } from '../slack-event.model';
import { eventIsReaction } from './event-is-reaction.fn';
import { eventIsWrapper } from './event-is-wrapper.fn';

export function eventIsWrappedReaction(
    event: ISlackEvent
): event is ISlackEventWrapper<ISlackEventReactionAdded> {
    return eventIsWrapper(event) && eventIsReaction(event.event);
}
