import {Future} from 'fp-ts-fluture/lib/Future';
import {None} from 'fp-ts/lib/Option';
import {Err} from '../../types/err';
import {SqlQuery} from './common';
import {DbErrKind} from './err';

export function execAsync(query: SqlQuery): Future<Err<DbErrKind>, None> {

}
