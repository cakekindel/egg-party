import { Module, Provider } from '@nestjs/common';
import { SlackTeamProvider } from './providers';
import {
    SlackTeamMapper,
    SlackUserStubMapper,
} from './providers/resource-mappers';

const services: Array<Provider<unknown>> = [
    SlackTeamProvider,
    SlackTeamMapper,
    SlackUserStubMapper,
];

@Module({
    providers: [...services],
    exports: [...services],
})
export class BusinessModule {}
