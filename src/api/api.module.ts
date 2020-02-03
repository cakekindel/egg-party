import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { SharedModule } from '../shared/shared.module';
import { HealthCheckController } from './controllers';
import {
    SlackEventsController,
    SlackInteractionsController,
    SlackOauthController,
} from './controllers/slack';
import {
    ChickenRenamingService,
    DailyEggsService,
    EggGivingService,
} from './services';
import { LeaderboardService } from './services/messaging';
import {
    SlackOauthService,
    SlackApiService,
    SlackGuideBookService,
    SlackMessageBuilderService,
} from './services/slack';
import {
    SlackCommandHandler,
    SlackEventHandler,
    SlackInteractionHandler,
    SlackMessageHandler,
    SlackReactionHandler,
} from './services/slack/handlers';
import { SlackTeamProvider } from './services/providers';
import {
    SlackTeamMapper,
    SlackUserStubMapper,
} from './services/providers/resource-mappers';

@Module({
    imports: [SharedModule, DbModule],
    controllers: [
        HealthCheckController,
        SlackEventsController,
        SlackOauthController,
        SlackInteractionsController,
    ],
    providers: [
        SlackApiService,
        SlackOauthService,
        SlackMessageBuilderService,
        SlackGuideBookService,
        SlackMessageHandler,
        SlackEventHandler,
        SlackInteractionHandler,
        EggGivingService,
        SlackCommandHandler,
        SlackReactionHandler,
        DailyEggsService,
        LeaderboardService,
        ChickenRenamingService,
        SlackTeamMapper,
        SlackUserStubMapper,
        SlackTeamProvider,
    ],
    exports: [],
})
export class ApiModule {}
