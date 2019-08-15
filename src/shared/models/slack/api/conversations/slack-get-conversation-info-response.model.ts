import { ISlackResponse } from '../slack-response.model';

import { ISlackConversation } from '../../conversations';

export interface ISlackGetConversationInfoResponse extends ISlackResponse
{
    channel: ISlackConversation;
}
