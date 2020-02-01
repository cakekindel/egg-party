import { Provider, Scope } from '@nestjs/common';
import { Connection, getConnectionManager } from 'typeorm';
import { ConfigService } from '../shared/utility';
import { DbConnectionOptions } from './db-connection-config.model';

async function connectionFactory(
    configService: ConfigService
): Promise<Connection> {
    const dbOptions = new DbConnectionOptions(
        configService.environment,
        configService.getTypeOrmConfig()
    );

    const connections = getConnectionManager();
    const alreadyConfigured = connections.has(configService.environment);
    const getConnection = () => connections.get(configService.environment);
    const createConnection = () => connections.create(dbOptions);

    const connection = alreadyConfigured ? getConnection() : createConnection();

    return connection.isConnected ? connection : connection.connect();
}

export const DbConnectionProvider: Provider = {
    provide: Connection,
    scope: Scope.REQUEST,
    inject: [ConfigService],
    useFactory: connectionFactory,
};
