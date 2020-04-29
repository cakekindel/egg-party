import { Future } from 'fp-ts-fluture/lib/Future';
import { IO } from 'fp-ts/lib/IO';
import {None} from 'fp-ts/lib/Option';

import { EggCount } from '../../types/egg-party/egg';
import { Err } from '../../types/err';
import { SlackUserContext, SlackUserUniqueId } from '../../types/slack/user';

export enum GiveEggsErr {
    UserOutOfEggs = 'user_out_of_eggs',
    UserHasInsufficientEggs = 'user_has_insufficient_eggs',
}

export function tryGiveEggsAsync(
    user: SlackUserContext,
    toUsers: SlackUserUniqueId[],
    giveEach: EggCount
): Future<Err<GiveEggsErr>, None>;
