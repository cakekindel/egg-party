import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Chicken, IChickenIntrinsic } from './chicken.entity';
import { Egg, IEggIntrinsic } from './egg.entity';
import { EntityName } from './entity-name.enum';
import { EntityBase, IEntityBase } from './entity.base';
import { SlackTeam } from './slack-team.entity';

export interface ISlackUserIntrinsic extends IEntityBase {
    slackUserId: string;
    slackWorkspaceId: string;
    dailyEggsLastRefreshedDate?: Date;
}

@Entity(EntityName.SlackUser)
export class SlackUser extends EntityBase implements ISlackUserIntrinsic {
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

    @ManyToOne(
        () => SlackTeam,
        team => team.users,
        { nullable: false }
    )
    @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
    public team?: SlackTeam;
}
