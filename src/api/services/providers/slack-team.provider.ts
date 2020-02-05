import { Injectable } from '@nestjs/common';
import { MaybeAsync } from 'purify-ts';
import { SlackTeam } from '../../../business/view-models';
import * as Entity from '../../../db/entities';
import { SlackTeamRepo } from '../../../db/repos';
import { ProviderBase } from './provider.base';
import { SlackTeamMapper } from './resource-mappers';

@Injectable()
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

    public getBySlackId(teamSlackId: string): MaybeAsync<SlackTeam> {
        return this.repo
            .getBySlackId(teamSlackId)
            .map(e => this.mapper.mapToViewModel(e));
    }

    public async create(
        slackTeamId: string,
        oauthToken: string,
        botUserId: string
    ): Promise<number> {
        const newTeam: SlackTeam = {
            id: 0,
            botUserId,
            slackTeamId,
            oauthToken,
            users: [],
            createdDate: new Date(),
        };

        const newTeamId = await this.saveOne(newTeam);

        return newTeamId;
    }
}
