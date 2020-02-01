import { IViewModel } from '../view-model.interface';
import { Nullable } from '../../../shared/types';

export interface IEggStub extends IViewModel {
    givenOnDate: Nullable<Date>;
}
