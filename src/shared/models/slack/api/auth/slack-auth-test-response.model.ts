import { ISlackResponse } from '../slack-response.model';

export interface ISlackAuthTestResponse extends ISlackResponse
{
    user: string;
    user_id: string;

    team_id: string;
    team: string;
    url: string;
}
