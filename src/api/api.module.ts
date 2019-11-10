import { Module } from '@nestjs/common';

import { ConfigService } from '../shared/utility';

import { HealthCheckController } from './controllers';
import { SlackEventsController, SlackInteractionsController } from './controllers/slack';

import {
    SlackApiService,
    SlackEventHandlerService,
    SlackGuideBookService,
    SlackInteractionHandlerService,
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
        SlackEventHandlerService,
        SlackInteractionHandlerService,
    ],
    exports: [],
})
export class ApiModule { }
