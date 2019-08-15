import { Module } from '@nestjs/common';

import { SlackEventsController } from './controllers';
import { SlackApiService, SlackEventHandlerService, SlackMessageBuilderService } from './services/slack';
import { DbModule } from '../db/db.module';

@Module({
    imports: [
        DbModule,
    ],
    controllers: [
        SlackEventsController
    ],
    providers: [
        SlackApiService,
        SlackMessageBuilderService,
        SlackEventHandlerService,
    ],
    exports: [],
})
export class ApiModule { }
