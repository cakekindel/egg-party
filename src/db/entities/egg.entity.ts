import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { EntityName } from './entity-name.enum';
import { EntityBase } from './entity.base';

import { Chicken } from './chicken.entity';
import { SlackUser } from './slack-user.entity';

@Entity(EntityName.Egg)
export class Egg extends EntityBase
{
    @Column()
    public didHatch: boolean = false;

    @ManyToOne(() => Chicken, (chicken) => chicken.laidEggs, { nullable: false })
    @JoinColumn({ name: 'LaidByChickenId', referencedColumnName: 'id' })
    public laidByChicken?: Chicken;

    @ManyToOne(() => SlackUser, (user) => user.eggs, { nullable: false })
    @JoinColumn({ name: 'OwnedByUserId', referencedColumnName: 'id' })
    public ownedByUser?: SlackUser;

    @ManyToOne(() => SlackUser, (user) => user.eggsGiven)
    @JoinColumn({ name: 'GivenByUserId', referencedColumnName: 'id' })
    public givenByUser?: SlackUser;
}
