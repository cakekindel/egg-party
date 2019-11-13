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
    @JoinColumn({ name: 'laidByChickenId', referencedColumnName: 'id' })
    public laidByChicken?: Chicken;

    @ManyToOne(() => SlackUser, (user) => user.eggs, { nullable: false })
    @JoinColumn({ name: 'ownedByUserId', referencedColumnName: 'id' })
    public ownedByUser?: SlackUser;

    @ManyToOne(() => SlackUser, (user) => user.eggsGiven, { nullable: true })
    @JoinColumn({ name: 'givenByUserId', referencedColumnName: 'id' })
    public givenByUser?: SlackUser;

    @Column({ nullable: true })
    public givenOnDate?: Date;
}
