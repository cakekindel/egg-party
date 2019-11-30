import { Injectable } from '@nestjs/common';

import { SlackDmCommand } from '../../../../shared/enums';
import { ConversationType } from '../../../../shared/models/slack/conversations';
import { ISlackEventMessagePosted } from '../../../../shared/models/slack/events';
import { MessageSubtype } from '../../../../shared/models/slack/events/message-subtype.enum';
import { ChickenRenamingService } from '../../chicken-renaming.service';
import { EggGivingService } from '../../egg-giving.service';
import { SlackCommandHandler } from './slack-command.handler';

@Injectable()
export class SlackMessageHandler
{
    constructor
    (
        private eggGivingService: EggGivingService,
        private commandHandler: SlackCommandHandler,
        private chickenRenamingService: ChickenRenamingService,
    ) { }

    public async handleMessage(messageEvent: ISlackEventMessagePosted): Promise<void>
    {
        if (!this.isMessageFromAUser(messageEvent))
        {
            return;
        }
        else if (messageEvent.channel_type === ConversationType.DirectMessage)
        {
            await this.handleDirectMessage(messageEvent);
        }
        else if (messageEvent.channel_type === ConversationType.Public)
        {
            await this.handleChannelMessage(messageEvent);
        }
    }

    private async handleDirectMessage(message: ISlackEventMessagePosted): Promise<void>
    {
        const text = message.text as SlackDmCommand;
        const chickenAwaitingRename = await this.chickenRenamingService.getChickenAwaitingRenameForUser(
                                                                           message.user,
                                                                           message.workspaceId
                                                                       );

        if (chickenAwaitingRename !== undefined)
        {
            return await this.chickenRenamingService.renameChicken(chickenAwaitingRename, text);
        }
        else
        {
            return await this.commandHandler.handleCommand(message.user, message.workspaceId, text);
        }
    }

    private async handleChannelMessage(messageEvent: ISlackEventMessagePosted): Promise<void>
    {
        const giverId = messageEvent.user;
        const workspaceId = messageEvent.workspaceId;

        const toUserIds = this.getUserIdsMentionedInMessage(messageEvent.text);
        const eggsEachCount = this.getNumberOfEggsInMessage(messageEvent.text);

        if (toUserIds.length && eggsEachCount > 0)
        {
            this.eggGivingService.giveEggs(workspaceId, giverId, eggsEachCount, toUserIds);
        }
    }

    private getUserIdsMentionedInMessage(messageText: string): string[]
    {
        const mentions = messageText.match(/<@\w+>/g) || [];
        const userIds = mentions.map(m => m.replace(/[<>@]/g, ''));
        const uniqUserIds = new Set(userIds);

        return Array.from(uniqUserIds);
    }

    private getNumberOfEggsInMessage(messageText: string): number
    {
        const eggCount = (messageText.match(/:egg:/g) || []).length;
        return eggCount;
    }

    private isMessageFromAUser(message: ISlackEventMessagePosted): boolean
    {
        return message.subtype === MessageSubtype.Bot;
    }
}
