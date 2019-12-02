import { Provider, Scope } from '@nestjs/common';
import { Connection, getConnectionManager } from 'typeorm';
import { ConfigService } from '../shared/utility';
import { DbConnectionConfig } from './db-connection-config.model';

async function connectionFactory(environment: ConfigService): Promise<Connection>
{
    const config = new DbConnectionConfig(environment);

    const connections = getConnectionManager();
    const alreadyConfigured = connections.has(environment.environment);
    const connection = alreadyConfigured ? connections.get(environment.environment) : connections.create(config);

    if (!connection.isConnected)
        return await connection.connect();

    return connection;
}

export const DbConnectionProvider: Provider = {
    provide: Connection,
    scope: Scope.REQUEST,
    inject: [ConfigService],
    useFactory: connectionFactory
};
