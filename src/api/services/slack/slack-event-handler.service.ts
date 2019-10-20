import { Injectable } from '@nestjs/common';

import { SlackApiService } from './slack-api.service';
import { SlackGuideBookService } from './slack-guide-book.service';
import { SlackMessageBuilderService } from './slack-message-builder.service';

import { ChickenRepo, SlackUserRepo } from '../../../db/repos';
import { SlackDmCommand } from '../../../shared/enums';
import { ErrorUserOutOfEggs, ErrorUserTriedToGiveTooManyEggs } from '../../../shared/errors';
import { ConversationType } from '../../../shared/models/slack/conversations';
import { SlackEventType } from '../../../shared/models/slack/events';
import { ISlackEvent, ISlackEventChallenge, ISlackEventMessagePosted, ISlackEventWrapper } from '../../../shared/models/slack/events';

@Injectable()
export class SlackEventHandlerService
{
    constructor
    (
        private api: SlackApiService,
        private userRepo: SlackUserRepo,
        private chickenRepo: ChickenRepo,
        private messageBuilder: SlackMessageBuilderService,
        private guideBook: SlackGuideBookService,
    ) { }

    public async handleEvent(event: ISlackEvent): Promise<void | string>
    {
        switch (event.type)
        {
            case SlackEventType.Challenge:
                return (event as ISlackEventChallenge).challenge;
            case SlackEventType.EventWrapper:
                return await this.handleWrapper(event as ISlackEventWrapper);
        }
    }

    private async handleWrapper(wrapper: ISlackEventWrapper): Promise<void>
    {
        const innerEvent = wrapper.event;

        switch (innerEvent.type)
        {
            case SlackEventType.MessagePosted:
            {
                return await this.handleMessage(innerEvent as ISlackEventMessagePosted, wrapper.team_id);
            }
        }
    }

    private async handleMessage(event: ISlackEventMessagePosted, workspaceId: string): Promise<void>
    {
        // TODO: handle message.edited
        if (event.subtype)
        {
            return;
        }

        switch (event.channel_type)
        {
            case ConversationType.DirectMessage:
                return await this.handleDirectMessage(event, workspaceId);
            case ConversationType.Public:
                return await this.handleChannelMessage(event, workspaceId);
        }
    }

    private async handleChannelMessage(event: ISlackEventMessagePosted, workspaceId: string): Promise<void>
    {
        const botUserId = await this.api.getBotUserId();
        const mentions = event.text.match(/<@\w+>/g) || [];

        if (event.user && mentions.length && event.text.includes(':egg:'))
        {
            const { wasCreated: userGivingEggsIsNew } = await this.userRepo.getOrCreate(event.user, workspaceId);
            if (userGivingEggsIsNew)
            {
                await this.api.sendDirectMessage(event.user, this.guideBook.build(event.user, botUserId));
            }

            const userIds = mentions.map((m) => m.replace(/[<>@]/g, ''));

            const numberOfEggsToGiveEach = (event.text.match(/:egg:/g) || []).length;
            const numberOfEggsTotal = numberOfEggsToGiveEach * userIds.length;

            try
            {
                await this.userRepo.throwIfUserCannotGiveEggs(event.user, workspaceId, numberOfEggsTotal);
            }
            catch (e)
            {
                if (e instanceof ErrorUserOutOfEggs)
                {
                    return; // message giver "you out of eggs fam"
                }
                else if (e instanceof ErrorUserTriedToGiveTooManyEggs)
                {
                    return; // message giver "you dont have that many eggs fam"
                }
            }

            for (const userId of userIds)
            {
                const getOrCreateMeta = await this.userRepo.getOrCreate(userId, workspaceId);
                if (getOrCreateMeta.wasCreated)
                {
                    await this.api.sendDirectMessage(userId, this.guideBook.build(event.user, botUserId));
                }

                // TODO: send DM to user "___ gave you n eggs"
            }
        }
    }

    private async handleDirectMessage(event: ISlackEventMessagePosted, workspaceId: string): Promise<void>
    {
        const slackUser = await this.userRepo.getBySlackId(event.user, workspaceId);

        if (slackUser && slackUser.chickens && slackUser.chickens.length)
        {
            const chickenToRename = slackUser.chickens.find((c) => c.awaitingRename);
            if (chickenToRename)
            {
                const oldName = chickenToRename.name;
                chickenToRename.name = event.text;
                chickenToRename.awaitingRename = false;
                await this.chickenRepo.save(chickenToRename);
                await this.api.sendDirectMessage(event.user, this.messageBuilder.chickenRenamed(oldName, event.text));
            }
            else
            {
                await this.handleDirectMessageCommand(event, workspaceId);
            }
        }
    }

    private async handleDirectMessageCommand(event: ISlackEventMessagePosted, workspaceId: string): Promise<void>
    {
        const user = await this.userRepo.getBySlackId(event.user, workspaceId);
        const chickens = (user && user.chickens) || [];
        const botUserId = await this.api.getBotUserId();

        switch (event.text.toLowerCase().trim() as SlackDmCommand)
        {
            case SlackDmCommand.Help:
                return await this.api.sendDirectMessage(event.user, this.guideBook.build(event.user, botUserId));
            case SlackDmCommand.ManageChickens:
                return await this.api.sendDirectMessage(event.user, this.messageBuilder.manageChickens(chickens));
            case SlackDmCommand.Leaderboard:
            case SlackDmCommand.Profile:
                return await this.api.sendDirectMessage(event.user, { text: 'TODO', blocks: [] });
        }
    }
}
