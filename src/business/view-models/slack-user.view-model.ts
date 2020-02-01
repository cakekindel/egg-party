import { Nullable } from '../../shared/types';
import {
    IChickenStub,
    IEggStub,
    ISlackTeamStub,
    ISlackUserStub,
} from './view-model-stubs';
import { IViewModel } from './view-model.interface';

export class SlackUser implements ISlackUserStub, IViewModel {
    constructor(
        public readonly id: number,
        public readonly createdDate: Date,

        public readonly slackId: string,
        public readonly teamSlackId: string,

        public readonly eggsLastRefreshedDate: Nullable<Date>,

        public readonly team: ISlackTeamStub,
        public readonly chickens: IChickenStub[] = [],
        public readonly eggsGiven: IEggStub[] = [],
        public readonly eggs: IEggStub[] = []
    ) {}
}
