import { ISlackResponse } from '../slack-response.model';

import { ISlackConversation } from '../../conversations';

export interface ISlackGetConversationsListResponse extends ISlackResponse
{
    channels: ISlackConversation[];
}
