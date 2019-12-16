import { Module } from '@nestjs/common';

import { ConfigService } from '../shared/utility';
import { DbConnectionProvider } from './db-connection.provider';
import { ChickenRepo, EggRepo, SlackUserRepo } from './repos';

// TODO: NOT THIS!!!
import {
    SlackApiService,
    SlackGuideBookService,
    SlackMessageBuilderService,
} from '../api/services/slack';

@Module({
    providers: [
        ConfigService,
        DbConnectionProvider,
        SlackUserRepo,
        ChickenRepo,
        EggRepo,
        // TODO: NOT THIS!!!
        SlackApiService,
        SlackMessageBuilderService,
        SlackGuideBookService,
    ],
    exports: [SlackUserRepo, ChickenRepo, EggRepo],
})
export class DbModule {}
