import { SlackEventType } from './slack-event-type.enum';

export interface ISlackEvent
{
    type: SlackEventType;
}
