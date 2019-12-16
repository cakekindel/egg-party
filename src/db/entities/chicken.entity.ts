import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { EntityBase } from './entity.base';

import { ChickenGrowthState } from '../../shared/enums/chicken-growth-state.enum';
import { Egg } from './egg.entity';
import { EntityName } from './entity-name.enum';
import { SlackUser } from './slack-user.entity';

@Entity(EntityName.Chicken)
export class Chicken extends EntityBase {
    @Column()
    public name: string = '';

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
    public laidEggs?: Egg[];

    @ManyToOne(
        () => SlackUser,
        user => user.chickens,
        { nullable: false }
    )
    @JoinColumn({ name: 'ownedByUserId', referencedColumnName: 'id' })
    public ownedByUser?: SlackUser;
}
