import { Maybe } from 'purify-ts';
import { IViewModel } from '../view-model.interface';

export interface ISlackUserStub extends IViewModel {
    slackId: string;
    teamSlackId: string;
    eggsLastRefreshedDate: Maybe<Date>;
}
