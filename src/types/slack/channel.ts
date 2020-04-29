import {Brand} from '../brand';

export type SlackChannelId = Brand<string, 'slack_channel_id'>;
export enum SlackChannelKind {
    PublicChannel = 'channel',
    PrivateChannel = 'group',
    DirectMessage = 'im',
    GroupDirectMessage = 'mpim',
}
