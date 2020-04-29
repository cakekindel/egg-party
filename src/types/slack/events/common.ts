import {SlackTeamUniqueId} from '../user';

export enum SlackEventKind {
    Challenge = 'url_verification',
    Envelope = 'event_callback',
}

export enum SlackInnerEventKind {
    Msg = 'message',
    Reaction = 'reaction_added',
}

export type AnyEventKind = SlackEventKind | SlackInnerEventKind;

export type SlackEvent<TKind extends AnyEventKind> = {
    type: TKind;
};

export type SlackEventEnvelope<
    TInnerKind extends SlackInnerEventKind
> = SlackEvent<SlackEventKind.Envelope> & {
    event: SlackEvent<TInnerKind>;

    team_id: SlackTeamUniqueId;
    event_id: string;
    event_time: number;

    token: string;
    api_app_id: string;
    authed_users: string[];
};

export function isEnvelope(event: SlackEvent<AnyEventKind>): event is SlackEventEnvelope<SlackInnerEventKind> {
    return event.type === SlackEventKind.Envelope;
}
