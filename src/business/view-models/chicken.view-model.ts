import { IEggStub, ISlackUserStub } from './view-model-stubs';
import { IViewModel } from './view-model.interface';

export class Chicken implements IViewModel {
    constructor(
        public readonly id: number,
        public readonly createdDate: Date,

        public readonly name: string,
        public readonly awaitingRename: boolean,

        public readonly ownedByUser: ISlackUserStub,

        public readonly laidEggs: IEggStub[]
    ) {}
}
