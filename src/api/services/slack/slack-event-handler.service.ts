import { Injectable } from '@nestjs/common';

import { SlackApiService } from './slack-api.service';
import { SlackGuideBookService } from './slack-guide-book.service';
import { SlackMessageBuilderService } from './slack-message-builder.service';

import { ChickenRepo, SlackUserRepo } from '../../../db/repos';
import { SlackDmCommand } from '../../../shared/enums';
import { ConversationType } from '../../../shared/models/slack/conversations';
import { SlackEventType } from '../../../shared/models/slack/events';
import { ISlackEvent, ISlackEventChallenge, ISlackEventMessagePosted, ISlackEventWrapper } from '../../../shared/models/slack/events';

@Injectable()
export class SlackEventHandlerService
{
    constructor
    (
        private api: SlackApiService,
        private messageBuilder: SlackMessageBuilderService,
        private userRepo: SlackUserRepo,
        private chickenRepo: ChickenRepo,
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
                return await this.handleMessagePosted(innerEvent as ISlackEventMessagePosted, wrapper.team_id);
            }
        }
    }

    private async handleMessagePosted(event: ISlackEventMessagePosted, workspaceId: string): Promise<void>
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
        const botIsInChannel = (await this.api.getChannelInfo(event.channel)).is_member;
        const mentions = event.text.match(/<(@.*?)>/g) || [];

        if (botIsInChannel && event.user && mentions.length && event.text.includes(':egg:'))
        {
            const slackUser = await this.userRepo.getBySlackId(event.user, workspaceId);
            if (!slackUser)
            {
                const newUser = await this.userRepo.create(event.user, workspaceId);
                // await this.api.sendDirectMessage(event.user, this.messageBuilder.newUserWelcomeMessage());
            }

            // await this.api.sendDirectMessage(event.user, this.messageBuilder.newUserWelcomeMessage());

            const usersToGiveEggs = mentions.map((m) => m.replace(/[\<\>]/g, ''));
            const numberOfEggsToGiveEach = (event.text.match(/:egg:/g) || []).length;
            const numberOfEggsTotal = numberOfEggsToGiveEach * usersToGiveEggs.length;

            // if (userCanGiveEggs(event.user))
            // {

            // }

            await this.api.sendMessage(event.channel, this.messageBuilder.testGiveEggsResponse(mentions, numberOfEggsToGiveEach));
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
