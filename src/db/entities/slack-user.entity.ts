import { Column, Entity, OneToMany } from 'typeorm';
import { Chicken, IChickenIntrinsic } from './chicken.entity';
import { Egg, IEggIntrinsic } from './egg.entity';
import { EntityName } from './entity-name.enum';
import { EntityBase, IEntityBase } from './entity.base';

export interface ISlackUserIntrinsic extends IEntityBase {
    slackUserId: string;
    slackWorkspaceId: string;
    dailyEggsLastRefreshedDate?: Date;
}
export interface ISlackUserRelated extends IEntityBase {
    eggsGiven?: IEggIntrinsic[];
    eggs?: IEggIntrinsic[];
    chickens?: IChickenIntrinsic[];
}

@Entity(EntityName.SlackUser)
export class SlackUser extends EntityBase {
    @Column()
    public slackUserId: string = '';

    @Column()
    public slackWorkspaceId: string = '';

    @Column({ nullable: true })
    public dailyEggsLastRefreshedDate?: Date;

    @OneToMany(
        () => Egg,
        egg => egg.ownedByUser
    )
    public eggs?: IEggIntrinsic[];

    @OneToMany(
        () => Egg,
        egg => egg.givenByUser
    )
    public eggsGiven?: IEggIntrinsic[];

    @OneToMany(
        () => Chicken,
        chicken => chicken.ownedByUser
    )
    public chickens?: IChickenIntrinsic[];
}
