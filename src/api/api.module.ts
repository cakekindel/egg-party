import { Module } from '@nestjs/common';

import { SlackEventsController, SlackInteractionsController } from './controllers';

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
        SlackEventsController,
        SlackInteractionsController,
    ],
    providers: [
        SlackApiService,
        SlackMessageBuilderService,
        SlackGuideBookService,
        SlackEventHandlerService,
        SlackInteractionHandlerService,
    ],
    exports: [],
})
export class ApiModule { }
