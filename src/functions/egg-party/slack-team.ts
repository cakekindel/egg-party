import { Future } from 'fp-ts-fluture/lib/Future';
import { Option } from 'fp-ts/lib/Option';
import { sql } from 'slonik';

import { UtcDateString } from '../../types/egg-party/brands';
import {AnyErrSev, Err} from '../../types/err';
import { SlackOauthToken } from '../../types/slack/brands';
import { SlackTeamUniqueId, SlackUserUniqueId } from '../../types/slack/user';
import {DbTable} from '../db/common';
import {DbErrKind} from '../db/err';
import {queryFirstAsync} from '../db/query';
import { nameof } from '../utils/nameof';

export type SlackTeam = {
    id: number;
    createdDate: UtcDateString;
    slackTeamId: SlackTeamUniqueId;
    oauthToken: SlackOauthToken;
    botUserId: SlackUserUniqueId;
};

export function getTeamAsync(
    teamId: SlackTeamUniqueId
): Future<Err<DbErrKind>, Option<SlackTeam>> {
    return queryFirstAsync<SlackTeam>(sql`
        SELECT *
        FROM   ${DbTable.SlackTeam}
        WHERE  ${nameof<SlackTeam>('slackTeamId')} = '${teamId}'
    `);
}
