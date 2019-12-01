import { Injectable } from '@nestjs/common';

import { SlackUser } from '../../../../db/entities';
import { SlackUserRepo } from '../../../../db/repos';
import { SlackDmCommand } from '../../../../shared/enums';
import { GuideBookPageId } from '../../../../shared/models/guide-book';
import { SlackMessageUnknownCommand } from '../../../../shared/models/messages';
import { SlackApiService } from '../slack-api.service';
import { SlackGuideBookService } from '../slack-guide-book.service';
import { SlackMessageBuilderService } from '../slack-message-builder.service';

type SlackCommandAsyncDelegate = (user: SlackUser) => Promise<void>;

@Injectable()
export class SlackCommandHandler
{
    private readonly commandDelegateMap: Map<SlackDmCommand, SlackCommandAsyncDelegate>;

    constructor(
        private userRepo: SlackUserRepo,
        private slackApi: SlackApiService,
        private guideBook: SlackGuideBookService,
        private messageBuilder: SlackMessageBuilderService,
    )
    {
        this.commandDelegateMap = new Map([
            [
                SlackDmCommand.Help,
                async user => await this.handleHelp(user)
            ],
            [
                SlackDmCommand.ManageChickens,
                async user => await this.handleChickens(user)
            ],
        ]);
    }

    public async handleCommand(slackUserId: string, slackWorkspaceId: string, command: SlackDmCommand): Promise<void>
    {
        const user = await this.userRepo.getOrCreateAndSendGuideBook(slackUserId, slackWorkspaceId);

        const asyncDelegate = this.commandDelegateMap.get(command);
        if (asyncDelegate !== undefined)
            await asyncDelegate(user);
        else
            await this.handleUnknownCommand(user, command);
    }

    private async handleUnknownCommand(user: SlackUser, command: SlackDmCommand): Promise<void>
    {
        const unknownCommandMessage = new SlackMessageUnknownCommand();
        await this.slackApi.sendDirectMessage(user.slackUserId, unknownCommandMessage);
        await this.guideBook.send(user, GuideBookPageId.LearnAboutCommands);
    }

    private async handleHelp(user: SlackUser): Promise<void>
    {
        await this.guideBook.send(user);
    }

    private async handleChickens(user: SlackUser): Promise<void>
    {
        const userId = user.slackUserId;
        const message = this.messageBuilder.manageChickens(user.chickens ?? []);

        return await this.slackApi.sendDirectMessage(userId, message);
    }
}
