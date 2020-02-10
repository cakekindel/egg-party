import { Injectable } from '@nestjs/common';
import { EitherAsync, Maybe } from 'purify-ts';
import * as Entity from '../../db/entities';
import { SlackTeamRepo } from '../../db/repos';
import { SlackTeam } from '../view-models';
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

    public getBySlackId(
        teamSlackId: string
    ): EitherAsync<unknown, Maybe<SlackTeam>> {
        return this.repo
            .getBySlackId(teamSlackId)
            .map(e => this.mapper.mapMaybeToViewModel(e));
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
