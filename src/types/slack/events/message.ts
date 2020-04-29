import { SlackChannelId, SlackChannelKind } from '../channel';
import {SlackEscapedText, SlackTimestamp} from '../brands';
import { SlackUserUniqueId } from '../user';
import {
    AnyEventKind,
    isEnvelope,
    SlackEvent,
    SlackEventEnvelope,
    SlackInnerEventKind,
} from './common';

export enum SlackMsgEventKind {
    BotMsg = 'bot_message',
    MsgEdited = 'message_changed',
    MsgDeleted = 'message_deleted',
    MsgInThread = 'message_replied',
}

export type SlackMsgEvent = SlackEventEnvelope<SlackInnerEventKind.Msg> & {
    event: SlackEvent<SlackInnerEventKind.Msg> & {
        subtype?: SlackMsgEventKind;

        user: SlackUserUniqueId;
        text: SlackEscapedText;

        channel: SlackChannelId;
        channel_type: SlackChannelKind;

        ts: SlackTimestamp;
    };
};

export function isMessage(
    event: SlackEvent<AnyEventKind>
): event is SlackMsgEvent {
    return isEnvelope(event) && event.event.type === SlackInnerEventKind.Msg;
}
