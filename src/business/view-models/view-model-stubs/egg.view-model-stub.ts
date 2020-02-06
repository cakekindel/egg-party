import { Maybe } from 'purify-ts';
import { IViewModel } from '../view-model.interface';

export interface IEggStub extends IViewModel {
    givenOnDate: Maybe<Date>;
}
