import { MaybeAsync, EitherAsync, Maybe } from 'purify-ts';
import { FindConditions } from 'typeorm';
import { CreateMaybeAsync } from '../../purify/create-maybe-async.fns';
import { ISlackTeamIntrinsic, SlackTeam } from '../entities/slack-team.entity';
import { RepoBase } from './repo.base';

export class SlackTeamRepo extends RepoBase<SlackTeam, ISlackTeamIntrinsic> {
    protected readonly entityType = SlackTeam;
    protected readonly defaultRelations: Array<keyof SlackTeam> = ['users'];

    public getBySlackId(
        slackTeamId: string
    ): EitherAsync<unknown, Maybe<SlackTeam>> {
        const conditions = {
            where: { teamId: slackTeamId },
            relations: this.defaultRelations,
        } as FindConditions<SlackTeam>;

        const getTeam = () => this.getRepo().findOne(conditions);

        return EitherAsync(getTeam).map(Maybe.fromNullable);
    }

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
