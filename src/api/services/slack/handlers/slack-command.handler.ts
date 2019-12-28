import { Injectable } from '@nestjs/common';

import { SlackUser } from '../../../../db/entities';
import { SlackUserRepo } from '../../../../db/repos';
import { SlackDmCommand } from '../../../../shared/enums';
import { GuideBookPageId } from '../../../../shared/models/guide-book';
import { SlackMessageUnknownCommand } from '../../../../shared/models/messages';
import { SlackApiService } from '../slack-api.service';
import { SlackGuideBookService } from '../slack-guide-book.service';
import { SlackMessageBuilderService } from '../slack-message-builder.service';
import { LeaderboardService } from '../../messaging';
import { ImpureFuncAsync } from '../../../../shared/types/delegates/func/async';

@Injectable()
export class SlackCommandHandler {
    private readonly commandDelegateMap: Map<
        SlackDmCommand,
        ImpureFuncAsync<SlackUser, void>
    >;

    constructor(
        private readonly userRepo: SlackUserRepo,
        private readonly slackApi: SlackApiService,
        private readonly guideBook: SlackGuideBookService,
        private readonly messageBuilder: SlackMessageBuilderService,
        private readonly leaderboardService: LeaderboardService
    ) {
        this.commandDelegateMap = new Map([
            [SlackDmCommand.Help, async user => this.handleHelp(user)],
            [
                SlackDmCommand.ManageChickens,
                async user => this.handleChickens(user),
            ],
            [
                SlackDmCommand.Leaderboard,
                async user => this.handleLeaderboard(user),
            ],
        ]);
    }

    public async handleCommand(
        slackUserId: string,
        slackWorkspaceId: string,
        command: SlackDmCommand
    ): Promise<void> {
        const user = await this.userRepo.getOrCreateAndSendGuideBook(
            slackUserId,
            slackWorkspaceId
        );

        const asyncDelegate = this.commandDelegateMap.get(command);

        if (asyncDelegate !== undefined) {
            await asyncDelegate(user);
        } else {
            await this.handleUnknownCommand(user, command);
        }
    }

    private async handleUnknownCommand(
        user: SlackUser,
        command: SlackDmCommand
    ): Promise<void> {
        const unknownCommandMessage = new SlackMessageUnknownCommand();
        await this.slackApi.sendDirectMessage(
            user.slackUserId,
            unknownCommandMessage
        );
        await this.guideBook.send(user, GuideBookPageId.LearnAboutCommands);
    }

    private async handleHelp(user: SlackUser): Promise<void> {
        await this.guideBook.send(user);
    }

    private async handleChickens(user: SlackUser): Promise<void> {
        const userId = user.slackUserId;
        const message = this.messageBuilder.manageChickens(user.chickens ?? []);

        return this.slackApi.sendDirectMessage(userId, message);
    }

    private async handleLeaderboard(user: SlackUser): Promise<void> {
        return this.leaderboardService.send(
            user.slackUserId,
            user.slackWorkspaceId
        );
    }
}
