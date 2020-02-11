import { IViewModel } from '../view-model.interface';

export interface IChickenStub extends IViewModel {
    name: string;
    awaitingRename: boolean;
}
