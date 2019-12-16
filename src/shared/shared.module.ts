import { Module } from '@nestjs/common';
import { ConfigService } from './utility';

@Module({
    providers: [ConfigService],
    exports: [ConfigService],
})
export class SharedModule {}
