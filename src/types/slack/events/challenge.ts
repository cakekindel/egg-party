import {AnyEventKind, SlackEvent, SlackEventKind} from './common';

export type SlackChallengeEvent = SlackEvent<SlackEventKind.Challenge> & {
    token: string;
    challenge: string;
};

export function isChallenge(event: SlackEvent<AnyEventKind>): event is SlackEvent<SlackEventKind.Challenge> {
    return event.type === SlackEventKind.Challenge;
}
