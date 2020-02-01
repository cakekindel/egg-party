import { IViewModel } from './view-model.interface';
import { ISlackUserStub, ISlackTeamStub } from './view-model-stubs';

export class SlackTeam implements ISlackTeamStub, IViewModel {
    constructor(
        public readonly id: number,
        public readonly createdDate: Date,
        public readonly slackTeamId: string,
        public readonly oauthToken: string,
        public readonly botUserId: string,
        public readonly users: ISlackUserStub[] = []
    ) {}
}
