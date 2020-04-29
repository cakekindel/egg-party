import { Brand } from '../brand';

export type SlackUserUniqueId = Brand<string, 'slack_user_uniq_id'>;
export type SlackTeamUniqueId = Brand<string, 'slack_team_uniq_id'>;

export type SlackUserContext = {
    id: SlackUserUniqueId;
    teamId: SlackTeamUniqueId;
};
