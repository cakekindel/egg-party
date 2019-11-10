import { Provider, Scope } from '@nestjs/common';
import { Connection, ConnectionOptions, createConnection, getConnection, getConnectionManager } from 'typeorm';
import { ConfigService } from '../shared/utility';
import { Entities } from './entities';

export const DbConnectionProvider: Provider = {
    provide: Connection,
    scope: Scope.REQUEST,
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<Connection> =>
    {
        const options: ConnectionOptions = {
            name: config.environment,
            type: 'mssql',
            database: config.typeOrmConfig.databaseName,
            host: config.typeOrmConfig.hostUrl,
            username: config.typeOrmConfig.adminUsername,
            password: config.typeOrmConfig.adminPassword,
            options: { encrypt: true },
            entities: [...Entities]
        };

        const connectionExists = getConnectionManager().has(config.environment);
        return connectionExists ? getConnection(config.environment) : await createConnection(options);
    }
};
