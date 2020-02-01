import { Module, Provider } from '@nestjs/common';

const services: Array<Provider<unknown>> = [];

@Module({
    providers: [...services],
    exports: [...services],
})
export class BusinessModule {}
