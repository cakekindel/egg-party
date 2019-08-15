import { SlackEventType } from './slack-event-type.enum';
import { ISlackEvent } from './slack-event.model';

export interface ISlackEventChallenge extends ISlackEvent
{
    type: SlackEventType.Challenge;
    token: string;
    challenge: string;
}
