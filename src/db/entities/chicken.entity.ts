import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { EntityBase, IEntityBase } from './entity.base';

import { ChickenGrowthState } from '../../shared/enums/chicken-growth-state.enum';
import { Egg, IEggIntrinsic } from './egg.entity';
import { EntityName } from './entity-name.enum';
import { SlackUser, ISlackUserIntrinsic } from './slack-user.entity';

export interface IChickenIntrinsic extends IEntityBase {
    name: string;
    lastFedDate: Date;
    growthState: ChickenGrowthState;
    awaitingRename: boolean;
}

export interface IChickenRelated {
    laidEggs?: Egg[];
    ownedByUser?: SlackUser;
}

@Entity(EntityName.Chicken)
export class Chicken extends EntityBase
    implements IChickenIntrinsic, IChickenRelated {
    @Column()
    public name: string = 'Chicken';

    @Column()
    public lastFedDate: Date = new Date();

    @Column('int')
    public growthState: ChickenGrowthState = ChickenGrowthState.Adult;

    @Column()
    public awaitingRename: boolean = false;

    @OneToMany(
        () => Egg,
        egg => egg.laidByChicken
    )
    public laidEggs?: IEggIntrinsic[];

    @ManyToOne(
        () => SlackUser,
        user => user.chickens,
        { nullable: false }
    )
    @JoinColumn({ name: 'ownedByUserId', referencedColumnName: 'id' })
    public ownedByUser?: ISlackUserIntrinsic;
}
