import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { EntityBase } from './entity.base';

import { ChickenGender } from '../../shared/enums/chicken-gender.enum';
import { ChickenGrowthState } from '../../shared/enums/chicken-growth-state.enum';
import { Egg } from './egg.entity';
import { EntityName } from './entity-name.enum';
import { SlackUser } from './slack-user.entity';

@Entity(EntityName.Chicken)
export class Chicken extends EntityBase
{
    @Column()
    public name: string = '';

    @Column()
    public lastFedDate: Date = new Date();

    @Column('int')
    public growthState: ChickenGrowthState = ChickenGrowthState.Adult;

    @Column('int')
    public gender: ChickenGender;

    @OneToMany(() => Egg, (egg) => egg.laidByChicken)
    public laidEggs?: Egg[];

    @ManyToOne(() => SlackUser, (user) => user.chickens)
    @JoinColumn({ name: 'ownedByUserId', referencedColumnName: 'id' })
    public ownedByUser?: SlackUser;

    constructor(gender: ChickenGender = ChickenGender.Hen)
    {
        super();
        this.gender = gender;
    }
}
