import { SlackBlockMessage } from '../messages';
import { ISlackInteractionAction } from './slack-interaction-action.model';

export interface ISlackInteractionPayload {
    type: 'block_actions';
    team: { id: string; domain: string };
    user: { id: string; username: string; team_id: string };
    api_app_id: string;
    token: string;
    response_url: string;
    message?: SlackBlockMessage;
    actions: ISlackInteractionAction[];
}
