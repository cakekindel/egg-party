import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { RepoBase } from './repo.base';

import {
    SlackApiService,
    SlackMessageBuilderService,
} from '../../api/services/slack';
import { SlackUser, ISlackUserIntrinsic } from '../entities';
import { ChickenRepo } from './chicken.repo';
import { Immutable } from '../../shared/types/immutable';

@Injectable()
export class SlackUserRepo extends RepoBase<SlackUser, ISlackUserIntrinsic> {
    protected entityType = SlackUser;
    protected defaultRelations: Array<keyof SlackUser> = [
        'chickens',
        'eggs',
        'eggsGiven',
    ];

    constructor(
        protected db: Connection,
        private chickenRepo: ChickenRepo,
        // TODO: remove when there's a provider layer SlackUser service
        private slackApi: SlackApiService,
        private messageBuilder: SlackMessageBuilderService
    ) {
        super(db);
    }

    public async getAllInWorkspace(
        slackWorkspaceId: string
    ): Promise<Immutable<SlackUser[]>> {
        const repo = this.getRepo();
        return repo.find({
            where: { slackWorkspaceId },
            relations: this.defaultRelations,
        });
    }

    public async getBySlackId(
        slackId: string,
        workspaceId: string
    ): Promise<SlackUser | undefined> {
        const repo = this.getRepo();
        return repo.findOne({
            where: { slackUserId: slackId, slackWorkspaceId: workspaceId },
            relations: this.defaultRelations,
        });
    }

    public async create(
        slackUserId: string,
        slackWorkspaceId: string
    ): Promise<SlackUser> {
        const user = new SlackUser();
        user.slackUserId = slackUserId;
        user.slackWorkspaceId = slackWorkspaceId;

        const savedUser = await this.save(user);

        await this.chickenRepo.createNewUserChickens(savedUser);

        const slackUser = await this.getById(savedUser.id);

        return slackUser as SlackUser;
    }

    // TODO: move to a provider layer SlackUser service
    public async getOrCreate(
        slackUserId: string,
        slackWorkspaceId: string
    ): Promise<{ wasCreated: boolean; user: SlackUser }> {
        let wasCreated = false;
        let user = await this.getBySlackId(slackUserId, slackWorkspaceId);

        if (user === undefined) {
            wasCreated = true;
            user = await this.create(slackUserId, slackWorkspaceId);
        }

        return { wasCreated, user };
    }

    // TODO: move to a provider layer SlackUser service
    public async getOrCreateAndSendGuideBook(
        slackUserId: string,
        slackTeamId: string
    ): Promise<SlackUser> {
        const userMeta = await this.getOrCreate(slackUserId, slackTeamId);

        if (userMeta.wasCreated) {
            this.slackApi.sendDirectMessage(
                userMeta.user.team?.oauthToken ?? '',
                slackUserId,
                this.messageBuilder.guideBook(
                    slackUserId,
                    userMeta.user.team?.oauthToken ?? ''
                )
            );
        }

        return userMeta.user;
    }
}
