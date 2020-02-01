import { SlackTeam } from '../../../business/view-models';
import * as Entity from '../../../db/entities';
import { SlackTeamRepo } from '../../../db/repos';
import { ProviderBase } from './provider.base';
import { SlackTeamMapper } from './resource-mappers';

export class SlackTeamProvider extends ProviderBase<
    SlackTeam,
    Entity.SlackTeam
> {
    constructor(
        protected readonly mapper: SlackTeamMapper,
        protected readonly repo: SlackTeamRepo
    ) {
        super();
    }

    public async create(
        slackId: string,
        oauthToken: string,
        botId: string
    ): Promise<SlackTeam> {
        const entity = await this.repo.create(slackId, oauthToken, botId);

        // note: for now, ISlackTeamIntrinsic and SlackTeam are structurally assignable,
        //   because the users collection is nullable.

        // if we want to include that collection,
        //   or add a non-nullable property to SlackTeam,
        //   then we will need to call repo.getById
        //   to get the rich object with relations.
        return this.mapper.mapToViewModel(entity);
    }
}
