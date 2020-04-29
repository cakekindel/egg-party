import {Err, error} from '../../types/err';
import {SqlQuery} from './common';

export enum DbErrKind {
    SlonikErr = 'db_connection_error',
    ResultCountErr = 'db_result_count_error',
}

export function rowCountErr(expected: number, actual: number, query: SqlQuery): Err<DbErrKind> {
    return error(DbErrKind.ResultCountErr, {
        expected,
        actual,
        query,
    });
}

