import { Module } from '@nestjs/common';

import { ConfigService } from '../shared/utility';

import { HealthCheckController } from './controllers';
import { SlackEventsController, SlackInteractionsController } from './controllers/slack';

import {
    SlackApiService,
    SlackEventHandler,
    SlackGuideBookService,
    SlackInteractionHandler,
    SlackMessageBuilderService
} from './services/slack';

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
        SlackEventHandler,
        SlackInteractionHandler,
    ],
    exports: [],
})
export class ApiModule { }
