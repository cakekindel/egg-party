import { Module } from '@nestjs/common';

import { ConfigService } from '../shared/utility';
import { DbConnectionProvider } from './db-connection.provider';
import { ChickenRepo, EggRepo, SlackUserRepo } from './repos';

@Module({
    providers: [
        ConfigService,
        DbConnectionProvider,
        SlackUserRepo,
        ChickenRepo,
        EggRepo,
    ],
    exports: [
        SlackUserRepo,
        ChickenRepo,
        EggRepo,
    ]
})
export class DbModule { }
