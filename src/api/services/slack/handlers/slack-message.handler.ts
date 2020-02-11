import { Injectable } from '@nestjs/common';
import { SlackDmCommand } from '../../../../shared/enums';
import { ConversationType } from '../../../../shared/models/slack/conversations';
import { ISlackEventMessagePosted } from '../../../../shared/models/slack/events';
import { ChickenRenamingService } from '../../chicken-renaming.service';
import { EggGivingService } from '../../egg-giving.service';
import { SlackTeamProvider } from '../../../../business/providers';
import { SlackCommandHandler } from './slack-command.handler';

@Injectable()
export class SlackMessageHandler {
    constructor(
        private eggGivingService: EggGivingService,
        private readonly teams: SlackTeamProvider,
        private commandHandler: SlackCommandHandler,
        private chickenRenamingService: ChickenRenamingService
    ) {}

    public async handleMessage(
        message: ISlackEventMessagePosted
    ): Promise<void> {
        const shouldAct = await this.shouldActOnMessage(message);
        if (!shouldAct) return;

        if (message.channel_type === ConversationType.DirectMessage) {
            await this.handleDirectMessage(message);
        } else if (message.channel_type === ConversationType.Public) {
            await this.handleChannelMessage(message);
        }
    }

    private async handleDirectMessage(
        message: ISlackEventMessagePosted
    ): Promise<void> {
        const text = message.text as SlackDmCommand;
        const chickenAwaitingRename = await this.chickenRenamingService.getChickenAwaitingRenameForUser(
            message.user,
            message.workspaceId
        );

        if (chickenAwaitingRename !== undefined) {
            return this.chickenRenamingService.renameChicken(
                chickenAwaitingRename,
                text
            );
        } else {
            return this.commandHandler.handleCommand(
                message.user,
                message.workspaceId,
                text
            );
        }
    }

    private async handleChannelMessage(
        messageEvent: ISlackEventMessagePosted
    ): Promise<void> {
        const giverId = messageEvent.user;
        const workspaceId = messageEvent.workspaceId;

        const toUserIds = this.getUserIdsMentionedInMessage(messageEvent.text);
        const eggsEachCount = this.getNumberOfEggsInMessage(messageEvent.text);

        if (toUserIds.length && eggsEachCount > 0) {
            this.eggGivingService.giveEggs(
                workspaceId,
                giverId,
                eggsEachCount,
                toUserIds
            );
        }
    }

    private getUserIdsMentionedInMessage(messageText: string): string[] {
        const mentions = messageText.match(/<@\w+>/g) || [];
        const userIds = mentions.map(m => m.replace(/[<>@]/g, ''));
        const uniqUserIds = new Set(userIds);

        return Array.from(uniqUserIds);
    }

    private getNumberOfEggsInMessage(messageText: string): number {
        const eggCount = (messageText.match(/:egg:/g) || []).length;
        return eggCount;
    }

    private async shouldActOnMessage(
        message: ISlackEventMessagePosted
    ): Promise<boolean> {
        const eggPartyBotId = await this.teams
            .getBySlackId(message.workspaceId)
            .map(team => team.map(t => t.botUserId).orDefault(''))
            .run()
            .then(idResult => idResult.orDefault(''));

        return message.subtype === undefined && message.user !== eggPartyBotId;
    }
}
