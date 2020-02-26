import { ISlackEventReactionAdded } from '../slack-event-reaction-added.model';
import { SlackEventType } from '../slack-event-type.enum';
import { ISlackEvent } from '../slack-event.model';

export function eventIsReaction(
    event: ISlackEvent
): event is ISlackEventReactionAdded {
    return event.type === SlackEventType.ReactionAdded;
}
