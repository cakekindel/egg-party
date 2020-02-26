import {
    ISlackEvent,
    ISlackEventChallenge,
    ISlackEventMessagePosted,
    ISlackEventReactionAdded,
    ISlackEventWrapper,
} from '../';

type WrappedMessageEvent = ISlackEventWrapper<ISlackEventMessagePosted>;
type WrappedReactionEvent = ISlackEventWrapper<ISlackEventReactionAdded>;

/**
 * @description
 * Base interface for pattern matching structures, with default case
 */
export interface Matcher<T, R> {
    /**
     * @description
     * default case
     */
    _: (val: T) => R;
}

/**
 * @description
 * Pattern matching structure for mapping & acting on different
 * types of Slack Events
 */
// prettier-ignore
export interface SlackEventMatcher<R> extends Matcher<ISlackEvent, R> {
    challenge?: (_: ISlackEventChallenge)   => R;
    message?:   (_: WrappedMessageEvent)    => R;
    reaction?:  (_: WrappedReactionEvent)   => R;
    _: (val: ISlackEvent) => R;
}
