import { Column, Entity, OneToMany } from 'typeorm';

import { EntityName } from './entity-name.enum';
import { EntityBase } from './entity.base';

import { Chicken } from './chicken.entity';
import { Egg } from './egg.entity';

@Entity(EntityName.SlackUser)
export class SlackUser extends EntityBase
{
    @Column()
    public slackUserId: string = '';

    @Column()
    public slackWorkspaceId: string = '';

    @OneToMany(() => Egg, (egg) => egg.ownedByUser)
    public eggs?: Egg[];

    @OneToMany(() => Egg, (egg) => egg.givenByUser)
    public eggsGiven?: Egg[];

    @OneToMany(() => Chicken, (chicken) => chicken.ownedByUser)
    public chickens?: Chicken[];
}
