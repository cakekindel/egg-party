import { Provider, Scope } from '@nestjs/common';
import { Connection, createConnection, getConnection, getConnectionManager, ConnectionOptions } from 'typeorm';
import { Entities } from './entities';

export const DbConnectionProvider: Provider = {
    provide: Connection,
    scope: Scope.REQUEST,
    useFactory: async (): Promise<Connection> =>
    {
        const options: ConnectionOptions = {
            name: 'egg-party',
            type: 'mssql',
            database: 'EggParty',
            host: process.env.TYPEORM_HOST,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            entities: [...Entities]
        };

        const connectionExists = getConnectionManager().has(options.name || '');
        return connectionExists ? getConnection(options.name) : await createConnection(options);
    }
};
