import { Module } from '@nestjs/common';

import { ConfigService } from '../shared/utility';

import { HealthCheckController } from './controllers';
import { SlackEventsController, SlackInteractionsController } from './controllers/slack';

import { SlackApiService, SlackGuideBookService, SlackMessageBuilderService } from './services/slack';
import { SlackEventHandler, SlackInteractionHandler, SlackMessageHandler } from './services/slack/handlers';

import { DbModule } from '../db/db.module';

@Module({
    imports: [
        DbModule,
    ],
    controllers: [
        HealthCheckController,
        SlackEventsController,
        SlackInteractionsController,
    ],
    providers: [
        ConfigService,
        SlackApiService,
        SlackMessageBuilderService,
        SlackGuideBookService,
        SlackMessageHandler,
        SlackEventHandler,
        SlackInteractionHandler,
    ],
    exports: [],
})
export class ApiModule { }
