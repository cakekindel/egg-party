import { ISlackEvent } from '../slack-event.model';
import { ISlackEventChallenge } from '../slack-event-challenge.model';
import { SlackEventType } from '../slack-event-type.enum';

export function eventIsChallenge(
    event: ISlackEvent
): event is ISlackEventChallenge {
    return event.type === SlackEventType.Challenge;
}
