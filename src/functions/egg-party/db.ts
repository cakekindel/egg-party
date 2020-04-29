import { otherwise, pattern, when } from '@matchbook/ts';
import { encaseP } from 'fluture';
import { future } from 'fp-ts-fluture';
import { chain, Future, map, mapLeft } from 'fp-ts-fluture/lib/Future';
import { lookup } from 'fp-ts/lib/Array';
import { Option } from 'fp-ts/lib/Option';
import {
    QueryResultType,
    SlonikError,
} from 'slonik';

import { err, Err } from '../../types/err';
import { DbErrKind, SchemaBase } from '../db/common';
