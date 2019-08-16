import { ISlackResponse } from '../slack-response.model';

export interface ISlackOpenDirectMessageResponse extends ISlackResponse
{
    channel: { id: string };
}
