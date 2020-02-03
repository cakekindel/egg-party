import { Injectable } from '@nestjs/common';
import { SlackUserRepo } from '../../../db/repos';
import {
    EnumUtility,
    SlackInteractionId,
    TimePeriod,
} from '../../../shared/enums';
import {
    LeaderboardConstants,
    LeaderboardMode,
    LeaderboardSlackMessage,
} from '../../../shared/models/messages/leaderboard';
import { LeaderboardData } from '../../../shared/models/messages/leaderboard/data';
import { LeaderboardInteraction } from '../../../shared/models/messages/leaderboard/interaction';
import { ISlackInteractionAction } from '../../../shared/models/slack/interactions/slack-interaction-action.model';
import { TimePeriodService } from '../../../shared/utility/time-period.service';
import { SlackApiService } from '../slack';
import { SlackTeamProvider } from '../providers';

@Injectable()
export class LeaderboardService {
    constructor(
        private readonly timePeriodHelper: TimePeriodService,
        private readonly slackApi: SlackApiService,
        private readonly userRepo: SlackUserRepo,
        private readonly slackTeams: SlackTeamProvider
    ) {}

    public async send(userId: string, workspaceId: string): Promise<void> {
        const message = await this.createMessage(userId, workspaceId);
        const apiToken = await this.slackTeams
            .getBySlackId(workspaceId)
            .map(t => t.oauthToken)
            .run();

        return this.slackApi.sendDirectMessage(
            apiToken.orDefault(''),
            userId,
            message
        );
    }

    public shouldHandleInteraction(
        interaction: ISlackInteractionAction
    ): boolean {
        return (
            interaction.action_id === SlackInteractionId.LeaderboardModeChange
        );
    }

    public async handleInteraction(
        slackUserId: string,
        workspaceId: string,
        responseUrl: string,
        rawInteraction: ISlackInteractionAction
    ): Promise<void> {
        const interaction = new LeaderboardInteraction(rawInteraction);

        const mode =
            EnumUtility.Parse(LeaderboardMode, interaction.mode) ??
            LeaderboardConstants.DefaultMode;

        const period =
            EnumUtility.Parse(TimePeriod, interaction.period) ??
            LeaderboardConstants.DefaultPeriod;

        const message = await this.createMessage(
            slackUserId,
            workspaceId,
            mode,
            period
        );

        const apiToken = await this.slackTeams
            .getBySlackId(workspaceId)
            .map(t => t.oauthToken)
            .run();

        return this.slackApi.sendHookMessage(
            apiToken.orDefault(''),
            responseUrl,
            message
        );
    }

    private async createMessage(
        slackUserId: string,
        workspaceId: string,
        mode?: LeaderboardMode,
        period?: TimePeriod
    ): Promise<LeaderboardSlackMessage> {
        const users = await this.userRepo.getAllInWorkspace(workspaceId);
        const data = new LeaderboardData(
            this.timePeriodHelper,
            users ?? [],
            slackUserId,
            mode,
            period
        );

        return new LeaderboardSlackMessage(data);
    }
}
