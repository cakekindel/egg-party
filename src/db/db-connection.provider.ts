import { Provider } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';

import { EnvironmentVariables } from '../shared/utility';

export const DbConnectionProvider: Provider = {
    provide: Connection,
    useFactory: async () => (await createConnection(EnvironmentVariables.Environment)),
};
