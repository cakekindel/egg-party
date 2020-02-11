import { IViewModel } from '../view-model.interface';

export interface ISlackTeamStub extends IViewModel {
    slackTeamId: string;
    oauthToken: string;
    botUserId: string;
}
