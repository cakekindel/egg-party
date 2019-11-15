import { Injectable } from '@nestjs/common';

import { SlackDmCommand } from '../../../../shared/enums';
import { ConversationType } from '../../../../shared/models/slack/conversations';
import { ISlackEventMessagePosted } from '../../../../shared/models/slack/events';
import { EggGivingService } from '../../egg-giving.service';
import { SlackCommandHandler } from './slack-command.handler';

@Injectable()
export class SlackMessageHandler
{
    constructor(private eggGivingService: EggGivingService, private commandHandler: SlackCommandHandler) { }

    public async handleMessage(messageEvent: ISlackEventMessagePosted): Promise<void>
    {
         if (messageEvent.channel_type === ConversationType.DirectMessage)
         {
             await this.handleDirectMessage(messageEvent);
         }
         else if (messageEvent.channel_type === ConversationType.Public)
         {
             await this.handleChannelMessage(messageEvent);
         }
    }

    private async handleDirectMessage(messageEvent: ISlackEventMessagePosted): Promise<void>
    {
        const command = messageEvent.text as SlackDmCommand;
        return await this.commandHandler.handleCommand(command);
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
}
