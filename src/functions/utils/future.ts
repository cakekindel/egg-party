import { future } from 'fp-ts-fluture';
import { Err } from '../../types/err';

export const okOrErr = <T extends Err>(e: T) => future.fromOption(() => e);
