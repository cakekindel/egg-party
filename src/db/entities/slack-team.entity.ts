import {
    Column,
    Entity,
    OneToMany,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityBase, IEntityBase } from './entity.base';
import { SlackUser, ISlackUserIntrinsic } from './slack-user.entity';

export interface ISlackTeamIntrinsic extends IEntityBase {
    slackTeamId: string;
    oauthToken: string;
    botUserId: string;
}

@Entity()
export class SlackTeam extends EntityBase implements ISlackTeamIntrinsic {
    @Column({ name: 'slack_team_id' })
    public readonly slackTeamId!: string;

    @Column({ name: 'oauth_token' })
    public readonly oauthToken!: string;

    @Column({ name: 'bot_user_id' })
    public readonly botUserId!: string;

    @OneToMany(
        () => SlackUser,
        u => u.team
    )
    public readonly users?: ISlackUserIntrinsic[];
}
