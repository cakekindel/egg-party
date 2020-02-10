import { Module, Provider } from '@nestjs/common';
import { SlackTeamProvider } from './providers';
import {
    SlackTeamMapper,
    SlackUserStubMapper,
} from './providers/resource-mappers';
import { DbModule } from '../db';
import { SharedModule } from '../shared/shared.module';

const services: Array<Provider<unknown>> = [
    SlackTeamProvider,
    SlackTeamMapper,
    SlackUserStubMapper,
];

@Module({
    imports: [DbModule, SharedModule],
    providers: [...services],
    exports: [...services],
})
export class BusinessModule {}
