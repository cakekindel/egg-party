import {_, pattern, strike, when} from '@matchbook/ts';
import {future} from 'fp-ts-fluture';
import {Future} from 'fp-ts-fluture/lib/Future';
import {none, None} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import * as err from '../../types/err';
import {Err} from '../../types/err';
import {SlackEscapedText} from '../../types/slack/brands';
import {SlackChannelKind} from '../../types/slack/channel';
import {SlackMsgEvent} from '../../types/slack/events/message';
import {SlackUserContext} from '../../types/slack/user';
import {okOrErr} from '../utils/future';
import {actOnDirectMsgAsync, actOnPublicMsgAsync} from './handle-message';
import {getTeamAsync, SlackTeam} from './slack-team';

export enum ActOnSlackMsgErrKind {
    TeamNotFound = 'team_not_found',
    MsgIsFromEggParty = 'msg_is_from_egg_party',
}

function teamNotFoundErr(event: SlackMsgEvent): Err<ActOnSlackMsgErrKind> {
    return err.error(ActOnSlackMsgErrKind.TeamNotFound, event);
}

function sentByEggPartyErr(event: SlackMsgEvent): Err<ActOnSlackMsgErrKind> {
    return err.warn(ActOnSlackMsgErrKind.MsgIsFromEggParty, event);
}

export function actOnSlackMsgAsync(event: SlackMsgEvent): Future<Err, None> {
    const user: SlackUserContext = {
        id: event.event.user,
        teamId: event.team_id,
    };

    const actOnPublicAsync = () => actOnPublicMsgAsync(user, event.event.text);
    const actOnDmAsync = () => actOnDirectMsgAsync(user, event.event.text);

    const sentByEggParty = (t: SlackTeam): boolean =>
        t.botUserId !== event.event.user;

    return pipe(
        getTeamAsync(event.team_id),
        future.chain(okOrErr<Err>(teamNotFoundErr(event))),
        future.chain(
            pattern(
                when(sentByEggParty, future.left(sentByEggPartyErr(event))),
                _(future.right(none as None))
            )
        ),
        future.chain(() =>
            strike(
                event.event.channel_type,
                when(SlackChannelKind.PublicChannel, actOnPublicAsync),
                when(SlackChannelKind.DirectMessage, actOnDmAsync),
                _(future.right(none as None))
            )
        )
    );
}
