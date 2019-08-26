import { Provider } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';

import { ConfigService } from '../shared/utility';

export const DbConnectionProvider: Provider = {
    provide: Connection,
    useFactory: async (config: ConfigService) => (await createConnection(config.environment)),
    inject: [ConfigService]
};
