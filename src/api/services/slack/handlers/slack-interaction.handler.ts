import { Injectable } from '@nestjs/common';
import { Nothing } from 'purify-ts';
import { SlackTeamProvider } from '../../../../business/providers';
import { ChickenRepo, SlackUserRepo } from '../../../../db/repos';
import { SlackInteractionId } from '../../../../shared/enums';
import { GuideBookPageId } from '../../../../shared/models/guide-book';
import { ISlackInteractionPayload } from '../../../../shared/models/slack/interactions/slack-interaction-payload.model';
import { LeaderboardService } from '../../messaging';
import { SlackApiService } from '../slack-api.service';
import { SlackGuideBookService } from '../slack-guide-book.service';
import { SlackMessageBuilderService } from '../slack-message-builder.service';

// TODO: Refactor to behave more like a fan-out delegate map-based service like SlackEventHandler.
@Injectable()
export class SlackInteractionHandler {
    constructor(
        // TODO: Remove some of these
        private readonly api: SlackApiService,
        private readonly messageBuilder: SlackMessageBuilderService,
        private readonly userRepo: SlackUserRepo,
        private readonly chickenRepo: ChickenRepo,
        private readonly guideBook: SlackGuideBookService,
        private readonly leaderboard: LeaderboardService,
        private readonly slackTeams: SlackTeamProvider
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
        const slackTeam = (
            await this.slackTeams.getBySlackId(interaction.team.id).run()
        ).orDefault(Nothing);

        const apiToken = slackTeam.mapOrDefault(t => t.oauthToken, '');
        const botUserId = slackTeam.mapOrDefault(t => t.botUserId, '');

        if (this.leaderboard.shouldHandleInteraction(action)) {
            return this.leaderboard.handleInteraction(
                interaction.user.id,
                interaction.team.id,
                interaction.response_url,
                action
            );
        }

        // TODO: replace with delegate map
        switch (actionId) {
            case SlackInteractionId.GuideBookJumpToPage: {
                // TODO: Move to SlackGuideBookService
                const pageId = (action.value ||
                    (action.selected_option &&
                        action.selected_option.value)) as GuideBookPageId;
                return this.api.sendHookMessage(
                    apiToken,
                    interaction.response_url,
                    this.guideBook.build(userId, botUserId, pageId)
                );
            }
            case SlackInteractionId.ManageChickens: {
                // TODO: Move to chicken management service
                const user = await this.userRepo.getBySlackId(
                    userId,
                    interaction.team.id
                );

                if (user && user.chickens) {
                    await this.api.sendDirectMessage(
                        apiToken,
                        userId,
                        this.messageBuilder.manageChickens(user.chickens)
                    );
                }
                break;
            }
            case SlackInteractionId.RenameChicken: {
                // TODO: Move to chicken renaming service
                const chickenId = Number(action.value || '0');
                const chicken = await this.chickenRepo.getById(chickenId);

                if (chicken) {
                    chicken.awaitingRename = true;
                    await this.chickenRepo.save(chicken);
                    await this.api.sendDirectMessage(
                        apiToken,
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
