import {otherwise, pattern, when} from '@matchbook/ts';
import {encaseP as encasePromise} from 'fluture';
import {array} from 'fp-ts';
import {future} from 'fp-ts-fluture';
import {chain, Future, map, mapLeft} from 'fp-ts-fluture/lib/Future';
import {Option} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

import {QueryResultType, SlonikError} from 'slonik';
import * as err from '../../types/err';
import {Err} from '../../types/err';
import {lengthGt} from '../utils/length';
import {SchemaBase, SqlQuery} from './common';
import {DbErrKind, rowCountErr} from './err';
import {pool} from './init';

export function queryFirstAsync<T extends SchemaBase>(
    query: SqlQuery<T>
): Future<Err<DbErrKind>, Option<T>> {
    const multipleRowsErr = (rows: T[]) => rowCountErr(1, rows.length, query);

    const getFirst = pattern(
        when(lengthGt<T[]>(1), rows => future.left(multipleRowsErr(rows))),
        otherwise(rows => future.right(array.lookup(0, rows)))
    );

    return queryAsync<T>(query)
        .pipe(map(res => [...res.rows]))
        .pipe(chain(getFirst));
}

export function queryAsync<T extends SchemaBase | null>(
    query: SqlQuery<T>
): Future<Err<DbErrKind>, QueryResultType<T>> {
    return pipe(
        query,
        encasePromise(q => pool.query<T>(q)),
        mapLeft(e => err.error(DbErrKind.SlonikErr, e as SlonikError))
    );
}

