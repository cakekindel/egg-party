import { Injectable } from '@nestjs/common';
import { EitherAsync, Maybe, Nothing } from 'purify-ts';
import { assoc } from 'ramda';
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

    public async teamInstalled(
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

        const updateIfReinstalled = (
            maybe: Maybe<SlackTeam>
        ): Maybe<SlackTeam> =>
            maybe
                // update botUserId
                .map(assoc('botUserId', botUserId))
                // update oauthToken
                .map(assoc('oauthToken', oauthToken));

        return this.getBySlackId(slackTeamId)
            .run()
            .then(teamOrErr => teamOrErr.orDefault(Nothing))
            .then(updateIfReinstalled)
            .then(existing => existing.orDefault(newTeam))
            .then(team => this.saveOne(team));
    }
}
