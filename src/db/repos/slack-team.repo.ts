import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { pipe } from 'rxjs';
import { FindConditions, FindOneOptions } from 'typeorm';
import { CreateMaybeAsync } from '../../purify/create-maybe-async.fns';
import { ISlackTeamIntrinsic, SlackTeam } from '../entities/slack-team.entity';
import { RepoBase } from './repo.base';
import { Just } from 'purify-ts/Maybe';

export class SlackTeamRepo extends RepoBase<SlackTeam, ISlackTeamIntrinsic> {
    protected readonly entityType = SlackTeam;
    protected readonly defaultRelations: Array<keyof SlackTeam> = ['users'];

    public getBySlackId(slackTeamId: string): MaybeAsync<SlackTeam> {
        const conditions = {
            where: { teamId: slackTeamId },
            relations: this.defaultRelations,
        } as FindConditions<SlackTeam>;

        const findTeam$ = this.getRepo().findOne(conditions);

        return CreateMaybeAsync.fromPromiseOfNullable(findTeam$);
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
