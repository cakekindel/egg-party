import { Injectable } from '@nestjs/common';
import moment = require('moment');

import { Egg, SlackUser } from '../../db/entities';
import { EggRepo, SlackUserRepo } from '../../db/repos';
import { SlackApiService, SlackMessageBuilderService } from './slack';

@Injectable()
export class EggGivingService
{
    constructor
    (
        private userRepo: SlackUserRepo,
        private eggRepo: EggRepo,
        private slackApi: SlackApiService,
        private messageBuilder: SlackMessageBuilderService,
    ) { }

    public async giveEggs(workspaceId: string, giverId: string, giveNumberOfEggs: number, toUsers: string[]): Promise<void>
    {
        const giver = await this.userRepo.getOrCreate(giverId, workspaceId);

        if (giver.wasCreated)
        {
            const botId = await this.slackApi.getBotUserId();
            this.slackApi.sendDirectMessage(giverId, this.messageBuilder.guideBook(giverId, botId));
        }

        const giveableEggCount = this.getNumberOfEggsUserCanGive(giver.user);
        const eggsToGiveCount = giveNumberOfEggs * toUsers.length;

        if (giveableEggCount === 0)
        {
            this.slackApi.sendDirectMessage(giverId, this.messageBuilder.outOfEggs());
        }
        else if (eggsToGiveCount > giveableEggCount)
        {
            this.slackApi.sendDirectMessage(giverId, this.messageBuilder.triedToGiveTooManyEggs());
        }
        else
        {
            for (const toUser of toUsers)
                await this.giveEggsToUser(giver.user, giveNumberOfEggs, toUser);
        }
    }

    private async giveEggsToUser(giver: SlackUser, giveNumberOfEggs: number, toUserId: string): Promise<void>
    {
        const receiver = await this.userRepo.getOrCreate(toUserId, giver.slackWorkspaceId);
        if (receiver.wasCreated)
        {
            const botId = await this.slackApi.getBotUserId();
            this.slackApi.sendDirectMessage(toUserId, this.messageBuilder.guideBook(toUserId, botId));
        }

        const eggs: Egg[] = [];
        for (let i = 1; i < giveNumberOfEggs; i++)
        {
            const egg = new Egg();
            egg.givenByUser = giver;
            egg.givenOnDate = new Date();
            egg.ownedByUser = receiver.user;

            eggs.push(egg);
        }

        this.eggRepo.save(eggs);
    }

    private getNumberOfEggsUserCanGive(user: SlackUser): number
    {
        const midnightLastNight = moment().hour(0).minute(0).second(0);

        const eggs = user.eggsGiven || [];
        const eggsGiven = eggs.filter((egg) => egg.givenOnDate !== undefined);
        const eggsGivenToday = eggsGiven.filter((egg) => moment(egg.givenOnDate).isAfter(midnightLastNight));

        const numberOfEggsUserCanGive = 5 - eggsGivenToday.length;
        return numberOfEggsUserCanGive;
    }
}
