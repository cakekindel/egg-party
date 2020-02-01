import { IViewModel } from '../view-model.interface';
import { Nullable } from '../../../shared/types';

export interface ISlackUserStub extends IViewModel {
    slackId: string;
    teamSlackId: string;
    eggsLastRefreshedDate: Nullable<Date>;
}
