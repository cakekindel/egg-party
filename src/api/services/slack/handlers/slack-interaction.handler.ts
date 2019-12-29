import { Injectable } from '@nestjs/common';

import { ChickenRepo, SlackUserRepo } from '../../../../db/repos';

import { SlackApiService } from '../slack-api.service';
import { SlackMessageBuilderService } from '../slack-message-builder.service';

import { SlackInteractionId } from '../../../../shared/enums';
import { GuideBookPageId } from '../../../../shared/models/guide-book';
import { ISlackInteractionPayload } from '../../../../shared/models/slack/interactions/slack-interaction-payload.model';
import { SlackGuideBookService } from '../slack-guide-book.service';
import { LeaderboardService } from '../../messaging';

@Injectable()
export class SlackInteractionHandler {
    constructor(
        private readonly api: SlackApiService,
        private readonly messageBuilder: SlackMessageBuilderService,
        private readonly userRepo: SlackUserRepo,
        private readonly chickenRepo: ChickenRepo,
        private readonly guideBook: SlackGuideBookService,
        private readonly leaderboard: LeaderboardService
    ) {}

    public async handleInteraction(
        interaction: ISlackInteractionPayload
    ): Promise<void> {
        const action = interaction.actions[0];

        const actionId = action.action_id.includes(
            SlackInteractionId.GuideBookJumpToPage
        )
            ? SlackInteractionId.GuideBookJumpToPage
            : action.action_id;

        const userId = interaction.user.id;
        const botUserId = await this.api.getBotUserId();

        if (this.leaderboard.shouldHandleInteraction(action)) {
            return this.leaderboard.handleInteraction(
                interaction.user.id,
                interaction.team.id,
                interaction.response_url,
                action
            );
        }

        switch (actionId) {
            case SlackInteractionId.GuideBookJumpToPage: {
                const pageId = (action.value ||
                    (action.selected_option &&
                        action.selected_option.value)) as GuideBookPageId;
                return this.api.sendHookMessage(
                    interaction.response_url,
                    this.guideBook.build(userId, botUserId, pageId)
                );
            }
            case SlackInteractionId.ManageChickens: {
                const user = await this.userRepo.getBySlackId(
                    userId,
                    interaction.team.id
                );
                if (user && user.chickens) {
                    await this.api.sendDirectMessage(
                        userId,
                        this.messageBuilder.manageChickens(user.chickens)
                    );
                }
                break;
            }
            case SlackInteractionId.RenameChicken: {
                const chickenId = Number(action.value || '0');
                const chicken = await this.chickenRepo.getById(chickenId);

                if (chicken) {
                    chicken.awaitingRename = true;
                    await this.chickenRepo.save(chicken);
                    await this.api.sendDirectMessage(
                        userId,
                        this.messageBuilder.renameChicken(chicken)
                    );
                }
                break;
            }
            default:
                break;
        }
    }
}
