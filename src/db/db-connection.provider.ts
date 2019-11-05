import { Provider } from '@nestjs/common';
import { Connection, createConnection, getConnection, getConnectionManager } from 'typeorm';

import { ConfigService } from '../shared/utility';

export const DbConnectionProvider: Provider = {
    provide: Connection,
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<Connection> =>
    {
        const connectionExists = getConnectionManager().has(config.environment);

        return connectionExists ? getConnection(config.environment) : await createConnection(config.environment);
    }
};
