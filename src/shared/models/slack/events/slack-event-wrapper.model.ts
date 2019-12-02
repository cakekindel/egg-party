import { ISlackEvent } from './slack-event.model';

import { SlackEventType } from './slack-event-type.enum';

export interface ISlackEventWrapper<TInnerEvent = ISlackEvent> extends ISlackEvent
{
    type: SlackEventType.EventWrapper;
    event: TInnerEvent;

    team_id: string;
    event_id: string;
    event_time: number;

    token: string;
    api_app_id: string;
    authed_users: string[];
}
