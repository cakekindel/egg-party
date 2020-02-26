import { ISlackEvent } from '..';
import { isNotNullish } from '../../../../type-guards';
import {
    eventIsChallenge,
    eventIsWrappedMessage,
    eventIsWrappedReaction,
} from '../type-guards';
import {
    Matcher,
    SlackEventMatcher,
} from './slack-event-match-structure.model';

type ExcludeDefault<M> = Omit<M, '_'>;

type Matchbook<M> = {
    [P in keyof ExcludeDefault<M>]: M extends Matcher<infer T, unknown>
        ? M[P] extends undefined | ((_: infer TSub) => unknown)
            ? TSub extends T
                ? (_: T) => _ is TSub
                : (_: T) => boolean
            : unknown
        : unknown;
};

function strike<T, R>(
    val: T,
    matcher: Matcher<T, R>,
    matchbook: Matchbook<typeof matcher>
): R {
    type MatchbookKey = keyof typeof matchbook & keyof typeof matcher;

    function strikeInternal<TSub extends T>(k: string): R | undefined {
        const key = k as MatchbookKey;
        const doer: (_: TSub) => R = matcher[key];
        const tester: (_: T) => _ is TSub = matchbook[key];

        if (tester(val)) return doer(val);
    }

    const keys = Object.keys(matchbook);

    const matches = keys.map(strikeInternal).filter(isNotNullish);

    if (matches.length === 1) {
        return matches[0];
    } else if (matches.length === 0) {
        return matcher._(val);
    } else {
        throw new Error(`Too many matches: ${matches.length}`);
    }
}

export function matchSlackEvent<TOut>(
    event: ISlackEvent,
    matcher: SlackEventMatcher<TOut>
): TOut {
    const book: Matchbook<typeof matcher> = {
        message: eventIsWrappedMessage,
        challenge: eventIsChallenge,
        reaction: eventIsWrappedReaction,
    };

    return strike(event, matcher, book);
}
