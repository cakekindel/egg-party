import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { ITypeormConfig } from '../shared/utility/typeorm-config.interface';

export class DbConnectionOptions implements SqlServerConnectionOptions {
    public readonly type = 'mssql';
    public readonly name: string;
    public readonly database: string;
    public readonly host: string;
    public readonly username: string;
    public readonly password: string;
    public readonly entities: string[];
    public readonly options = { encrypt: true };

    constructor(environmentName: string, config: ITypeormConfig) {
        this.name = environmentName;

        this.database = config.databaseName;
        this.host = config.hostUrl;
        this.username = config.adminUsername;
        this.password = config.adminPassword;
        this.entities = [config.entities];
    }
}
