import { RepoBase } from './repo.base';
import { SlackTeam, ISlackTeamIntrinsic } from '../entities/slack-team.entity';

export class SlackTeamRepo extends RepoBase<SlackTeam, ISlackTeamIntrinsic> {
    protected readonly entityType = SlackTeam;
    protected readonly defaultRelations: Array<keyof SlackTeam> = ['users'];

    public async create(
        slackId: string,
        oauthToken: string,
        botId: string
    ): Promise<ISlackTeamIntrinsic> {
        const entity = {
            slackTeamId: slackId,
            oauthToken,
            botUserId: botId,
        } as ISlackTeamIntrinsic;

        const saved = await this.save(entity);
        return saved;
    }
}
