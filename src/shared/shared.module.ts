import { Module } from '@nestjs/common';
import { ConfigService } from './utility';
import { TimePeriodService } from './utility/time-period.service';

@Module({
    providers: [ConfigService, TimePeriodService],
    exports: [ConfigService, TimePeriodService],
})
export class SharedModule {}
