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
        slackTeamId: string,
        oauthToken: string,
        botUserId: string
    ): Promise<number> {
        const newTeam = {
            botUserId,
            slackTeamId,
            oauthToken,
        } as SlackTeam;

        const newTeamId = await this.saveOne(newTeam);

        return newTeamId;
    }
}
