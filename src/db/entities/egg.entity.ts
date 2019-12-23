import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { EntityName } from './entity-name.enum';
import { EntityBase, IEntityBase } from './entity.base';

import { Chicken, IChickenIntrinsic } from './chicken.entity';
import { SlackUser, ISlackUserIntrinsic } from './slack-user.entity';

export interface IEggIntrinsic extends IEntityBase {
    didHatch: boolean;
    givenOnDate?: Date;
}

export interface IEggRelated {
    laidByChicken?: Chicken;
    ownedByUser?: SlackUser;
    givenByUser?: SlackUser;
}

@Entity(EntityName.Egg)
export class Egg extends EntityBase implements IEggIntrinsic, IEggRelated {
    @Column()
    public didHatch: boolean = false;

    @Column({ nullable: true })
    public givenOnDate?: Date;

    @ManyToOne(
        () => Chicken,
        chicken => chicken.laidEggs,
        { nullable: false }
    )
    @JoinColumn({ name: 'laidByChickenId', referencedColumnName: 'id' })
    public laidByChicken?: IChickenIntrinsic;

    @ManyToOne(
        () => SlackUser,
        user => user.eggs,
        { nullable: false }
    )
    @JoinColumn({ name: 'ownedByUserId', referencedColumnName: 'id' })
    public ownedByUser?: ISlackUserIntrinsic;

    @ManyToOne(
        () => SlackUser,
        user => user.eggsGiven,
        { nullable: true }
    )
    @JoinColumn({ name: 'givenByUserId', referencedColumnName: 'id' })
    public givenByUser?: ISlackUserIntrinsic;
}
