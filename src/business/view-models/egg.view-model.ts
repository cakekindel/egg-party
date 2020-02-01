import { Nullable } from '../../shared/types';
import { IChickenStub, ISlackUserStub, IEggStub } from './view-model-stubs';
import { IViewModel } from './view-model.interface';

export class Egg implements IEggStub, IViewModel {
    constructor(
        public readonly id: number,
        public readonly createdDate: Date,

        public readonly laidByChicken: IChickenStub,
        public readonly didHatch: boolean,

        public readonly ownedByUser: ISlackUserStub,

        public readonly givenByUser: ISlackUserStub,
        public readonly givenOnDate: Nullable<Date>
    ) {}
}
