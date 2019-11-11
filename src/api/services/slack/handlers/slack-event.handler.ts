import { Injectable } from '@nestjs/common';

import { SlackApiService } from '../slack-api.service';
import { SlackGuideBookService } from '../slack-guide-book.service';
import { SlackMessageBuilderService } from '../slack-message-builder.service';

import { ChickenRepo, SlackUserRepo } from '../../../../db/repos';
import { SlackDmCommand } from '../../../../shared/enums';
import { ErrorUserOutOfEggs, ErrorUserTriedToGiveTooManyEggs } from '../../../../shared/errors';
import { SlackEventType } from '../../../../shared/models/slack/events';
import { ISlackEvent, ISlackEventMessagePosted, ISlackEventWrapper } from '../../../../shared/models/slack/events';
import { SlackMessageHandler } from './slack-message.handler';

@Injectable()
export class SlackEventHandler
{
    constructor(
        private api: SlackApiService,
        private messageHandler: SlackMessageHandler,
        private userRepo: SlackUserRepo,
        private chickenRepo: ChickenRepo,
        private messageBuilder: SlackMessageBuilderService,
        private guideBook: SlackGuideBookService,
    ) { }

    public async handleEvent(event: ISlackEvent): Promise<void>
    {
        const messageEvent = this.getMessageEvent(event);

        if (messageEvent)
            return await this.messageHandler.handleMessage(messageEvent);
    }

    private getMessageEvent(event: ISlackEvent): ISlackEventMessagePosted | undefined
    {
        const eventIsWrapper = event.type === SlackEventType.EventWrapper;
        if (eventIsWrapper)
        {
            const wrapper = event as ISlackEventWrapper;
            const innerEventIsMessage = wrapper.event.type === SlackEventType.MessagePosted;

            if (innerEventIsMessage)
            {
                const messageEvent = wrapper.event as ISlackEventMessagePosted;
                return messageEvent;
            }
        }

        return undefined;
    }

    private async handleChannelMessage(event: ISlackEventMessagePosted, workspaceId: string): Promise<void>
    {
        const botUserId = await this.api.getBotUserId();
        const mentions = event.text.match(/<@\w+>/g) || [];

        if (event.user && mentions.length && event.text.includes(':egg:'))
        {
            const { wasCreated } = await this.userRepo.getOrCreate(event.user, workspaceId);

            if (wasCreated)
                await this.api.sendDirectMessage(event.user, this.guideBook.build(event.user, botUserId));

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
                    // TODO: message giver "you out of eggs fam"
                    return;
                }
                else if (e instanceof ErrorUserTriedToGiveTooManyEggs)
                {
                    // TODO: message giver "you dont have that many eggs fam"
                    return;
                }
            }

            for (const userId of userIds)
            {
                const getOrCreateMeta = await this.userRepo.getOrCreate(userId, workspaceId);
                if (getOrCreateMeta.wasCreated)
                    await this.api.sendDirectMessage(userId, this.guideBook.build(event.user, botUserId));

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

        switch (event.text.toLowerCase().trim())
        {
            case SlackDmCommand.ManageChickens:
                return await this.api.sendDirectMessage(event.user, this.messageBuilder.manageChickens(chickens));
            case SlackDmCommand.Leaderboard:
            case SlackDmCommand.Profile:
                return await this.api.sendDirectMessage(event.user, { text: 'TODO', blocks: [] });
            case SlackDmCommand.Help:
            default:
                return await this.api.sendDirectMessage(event.user, this.guideBook.build(event.user, botUserId));
        }
    }
}
