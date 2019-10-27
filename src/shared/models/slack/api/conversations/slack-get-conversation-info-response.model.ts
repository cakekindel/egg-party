import { ISlackConversation } from '../../conversations';
import { ISlackResponse } from '../slack-response.model';

export interface ISlackGetConversationInfoResponse extends ISlackResponse
{
    channel: ISlackConversation;
}
