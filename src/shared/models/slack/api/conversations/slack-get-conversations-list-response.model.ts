import { ISlackConversation } from '../../conversations';
import { ISlackResponse } from '../slack-response.model';

export interface ISlackGetConversationsListResponse extends ISlackResponse
{
    channels: ISlackConversation[];
}
