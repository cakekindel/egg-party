import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { RepoBase } from './repo.base';

import {
    SlackApiService,
    SlackMessageBuilderService,
} from '../../api/services/slack';
import { SlackUser } from '../entities';
import { ChickenRepo } from './chicken.repo';

@Injectable()
export class SlackUserRepo extends RepoBase<SlackUser> {
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

        const chickens = await this.chickenRepo.createNewUserChickens(
            savedUser
        );

        return (await this.getBySlackId(
            slackUserId,
            slackWorkspaceId
        )) as SlackUser;
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
        slackWorkspaceId: string
    ): Promise<SlackUser> {
        const userMeta = await this.getOrCreate(slackUserId, slackWorkspaceId);
        if (userMeta.wasCreated) {
            const botId = await this.slackApi.getBotUserId();
            this.slackApi.sendDirectMessage(
                slackUserId,
                this.messageBuilder.guideBook(slackUserId, botId)
            );
        }

        return userMeta.user;
    }
}
