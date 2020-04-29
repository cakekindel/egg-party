import { Injectable } from '@nestjs/common';
import { IEggIntrinsic, SlackUser } from '../../db/entities';
import { EggRepo, SlackUserRepo } from '../../db/repos';
import {
    SlackMessageYouCantGiveEggsToEggParty,
    SlackMessageYouCantGiveEggsToYourself,
    SlackMessageYouGaveEggs,
} from '../../shared/models/messages';
import { DailyEggsService } from './daily-eggs.service';
import { SlackApiService, SlackMessageBuilderService } from './slack';

@Injectable()
export class EggGivingService {
    constructor(
        private userRepo: SlackUserRepo,
        private eggRepo: EggRepo,
        private dailyEggService: DailyEggsService,
        private slackApi: SlackApiService,
        private messageBuilder: SlackMessageBuilderService
    ) {}

    public async giveEggs(
        workspaceId: string,
        giverId: string,
        giveNumberOfEggs: number,
        toUsers: string[]
    ): Promise<void> {
        const giver = await this.userRepo.getOrCreateAndSendGuideBook(
            giverId,
            workspaceId
        );

        await this.dailyEggService.ensureDailyEggsFresh(giver);

        const eggTotal = giveNumberOfEggs * toUsers.length;
        const canGiveEggs = await this.ensureUserCanGiveEggs(giver, eggTotal);
        const recipientsValid = await this.ensureRecipientsValid(
            giver,
            toUsers
        );

        if (canGiveEggs && recipientsValid) {
            for (const toUser of toUsers) {
                await this.giveEggsToUser(giver, giveNumberOfEggs, toUser);
            }

            const giveableEggsLeft = (await this.getGiveableEggs(giver)).length;
            const message = new SlackMessageYouGaveEggs(
                toUsers,
                giveNumberOfEggs,
                giveableEggsLeft
            );

            await this.slackApi.sendDirectMessage(
                giver.team?.oauthToken ?? '',
                giver.slackUserId,
                message
            );
        }
    }

    private async giveEggsToUser(
        giver: SlackUser,
        numberOfEggs: number,
        toUserId: string
    ): Promise<void> {
        const receiver = await this.userRepo.getOrCreateAndSendGuideBook(
            toUserId,
            giver.slackWorkspaceId
        );

        const giveableEggs = await this.getGiveableEggs(giver);

        for (let i = 0; i < numberOfEggs; i++) {
            const egg = giveableEggs[i];
            await this.eggRepo.giveToUser(egg, receiver);
        }
    }

    private async ensureRecipientsValid(
        user: SlackUser,
        recipientIds: string[]
    ): Promise<boolean> {
        const giverIsARecipient = recipientIds.some(
            id => id === user.slackUserId
        );
        const botIsARecipient = recipientIds.some(
            id => id === user.team?.botUserId ?? ''
        );

        if (giverIsARecipient) {
            await this.slackApi.sendDirectMessage(
                user.team?.oauthToken ?? '',
                user.slackUserId,
                new SlackMessageYouCantGiveEggsToYourself()
            );
        } else if (botIsARecipient) {
            await this.slackApi.sendDirectMessage(
                user.team?.oauthToken ?? '',
                user.slackUserId,
                new SlackMessageYouCantGiveEggsToEggParty()
            );
        }

        return !giverIsARecipient && !botIsARecipient;
    }

    private async ensureUserCanGiveEggs(
        user: SlackUser,
        numberOfEggs: number
    ): Promise<boolean> {
        const giveableEggCount = (await this.getGiveableEggs(user)).length;

        if (giveableEggCount === 0) {
            await this.slackApi.sendDirectMessage(
                user.team?.oauthToken ?? '',
                user.slackUserId,
                this.messageBuilder.outOfEggs()
            );
        } else if (numberOfEggs > giveableEggCount) {
            await this.slackApi.sendDirectMessage(
                user.team?.oauthToken ?? '',
                user.slackUserId,
                this.messageBuilder.triedToGiveTooManyEggs()
            );
        }

        return numberOfEggs <= giveableEggCount;
    }

    private async getGiveableEggs(user: SlackUser): Promise<IEggIntrinsic[]> {
        const newRef = await this.userRepo.getById(user.id);
        const eggIds = newRef?.eggs?.map(e => e.id) ?? [];
        const eggs = await this.eggRepo.getByIds(eggIds);

        return eggs.filter(egg => !egg.givenByUser);
    }
}
