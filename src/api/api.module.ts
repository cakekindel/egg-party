import { Module } from '@nestjs/common';

import { ConfigService } from '../shared/utility';

import { HealthCheckController } from './controllers';
import {
    SlackEventsController,
    SlackInteractionsController,
} from './controllers/slack';

import {
    ChickenRenamingService,
    DailyEggsService,
    EggGivingService,
} from './services';
import {
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
import { LeaderboardService } from './services/messaging';

import { DbModule } from '../db/db.module';
import { SharedModule } from '../shared/shared.module';
@Module({
    imports: [SharedModule, DbModule],
    controllers: [
        HealthCheckController,
        SlackEventsController,
        SlackInteractionsController,
    ],
    providers: [
        SlackApiService,
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
    ],
    exports: [],
})
export class ApiModule {}
