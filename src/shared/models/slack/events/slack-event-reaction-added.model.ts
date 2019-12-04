import { SlackEmoji } from '../slack-emoji.enum';
import { SlackEventType } from './slack-event-type.enum';
import { ISlackEvent } from './slack-event.model';

export interface ISlackEventReactionAdded extends ISlackEvent
{
    type: SlackEventType.ReactionAdded;

    user: string;
    reaction: SlackEmoji;
    item_user: string;
    item: IMessageNode | IFileNode | IFileCommentNode;
    event_ts: string;
}

interface IMessageNode
{
    type: 'message';
    channel: string;
    ts: string;
}

interface IFileNode
{
    type: 'file';
    /** ID of File object */
    file: string;
}

interface IFileCommentNode
{
    type: 'file_comment';
    file_comment: string;
    /** ID of File object */
    file: string;
}
