import { Injectable } from '@nestjs/common';
import { Nothing } from 'purify-ts';
import { SlackTeamProvider } from '../../business/providers';
import { Chicken, SlackUser } from '../../db/entities';
import { ChickenRepo, SlackUserRepo } from '../../db/repos';
import { ErrorMissingRelatedData } from '../../shared/errors';
import { SlackApiService, SlackMessageBuilderService } from './slack';

@Injectable()
export class ChickenRenamingService {
    constructor(
        private readonly chickenRepo: ChickenRepo,
        private readonly slackUserRepo: SlackUserRepo,
        private readonly messageBuilder: SlackMessageBuilderService,
        private readonly slackApi: SlackApiService,
        private readonly teamProvider: SlackTeamProvider
    ) {}

    public async markChickenForRename(chicken: Chicken): Promise<void> {
        if (chicken.ownedByUser === undefined)
            throw new ErrorMissingRelatedData(Chicken, 'ownedByUser');

        await this.handleChickensAlreadyWaiting(chicken.ownedByUser);

        await this.setAwaitingRenameAndSave(chicken, true);
    }

    public async renameChicken(
        slackUserId: string,
        slackTeamId: string,
        chicken: Chicken,
        name: string
    ): Promise<void> {
        const message = this.messageBuilder.chickenRenamed(chicken.name, name);
        await this.teamProvider
            .getBySlackId(slackTeamId)
            .run()
            .then(e => e.orDefault(Nothing))
            .then(m => m.map(t => t.oauthToken).orDefault(''))
            .then(token =>
                this.slackApi.sendDirectMessage(token, slackUserId, message)
            );

        chicken.name = name;
        await this.setAwaitingRenameAndSave(chicken, false);
    }

    public async getChickenAwaitingRenameForUser(
        slackUserId: string,
        slackWorkspaceId: string
    ): Promise<Chicken | undefined> {
        const user = await this.slackUserRepo.getBySlackId(
            slackUserId,
            slackWorkspaceId
        );
        const chickensWaiting =
            user?.chickens?.filter(c => c.awaitingRename) ?? [];

        if (chickensWaiting.length === 1) return chickensWaiting[0];

        if (chickensWaiting.length > 1)
            await this.setAwaitingRenameAndSave(chickensWaiting, false);

        return undefined;
    }

    private async setAwaitingRenameAndSave(
        chicken: Chicken | Chicken[],
        awaitingRename: boolean
    ): Promise<void> {
        if (chicken instanceof Array) {
            chicken.forEach(c => (c.awaitingRename = awaitingRename));
            await this.chickenRepo.save(chicken);
        } else {
            chicken.awaitingRename = awaitingRename;
            await this.chickenRepo.save(chicken);
        }
    }

    private async handleChickensAlreadyWaiting(user: SlackUser): Promise<void> {
        const waitingChicken = await this.getChickenAwaitingRenameForUser(
            user.slackUserId,
            user.slackWorkspaceId
        );

        if (waitingChicken)
            await this.setAwaitingRenameAndSave(waitingChicken, false);
    }
}
