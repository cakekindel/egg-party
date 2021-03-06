import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { ConfigService } from '../shared/utility';

export class DbConnectionConfig implements SqlServerConnectionOptions {
    public readonly type = 'mssql' as const;
    public readonly name: string;
    public readonly database: string;
    public readonly host: string;
    public readonly username: string;
    public readonly password: string;
    public readonly entities: string[];
    public readonly options = { encrypt: true };

    constructor(config: ConfigService) {
        this.name = config.environment;
        this.database = config.typeOrmConfig.databaseName;
        this.host = config.typeOrmConfig.hostUrl;
        this.username = config.typeOrmConfig.adminUsername;
        this.password = config.typeOrmConfig.adminPassword;
        this.entities = [config.typeOrmConfig.entities];
    }
}
