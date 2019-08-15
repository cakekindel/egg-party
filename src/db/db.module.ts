import { Module } from '@nestjs/common';

import { DbConnectionProvider } from './db-connection.provider';
import { ChickenRepo, EggRepo, SlackUserRepo } from './repos';

@Module({
    providers: [
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
