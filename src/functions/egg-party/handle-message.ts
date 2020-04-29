import { otherwise, strike, when } from '@matchbook/ts';
import { Future } from 'fp-ts-fluture/lib/Future';
import { None } from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import { textIsCommand } from '../../types/egg-party/command';
import { EggCount } from '../../types/egg-party/egg';
import { Err } from '../../types/err';
import { SlackEscapedText } from '../../types/slack/brands';
import { SlackUserContext, SlackUserUniqueId } from '../../types/slack/user';
import { matchAll } from '../utils/regex';
import { actOnCommandAsync } from './command';
import { tryGiveEggsAsync } from './egg-giving';
import { execRenameAsync } from './rename';

export function actOnPublicMsgAsync(
    user: SlackUserContext,
    text: SlackEscapedText
): Future<Err, None> {
    return tryGiveEggsAsync(user, parseUserMentions(text), parseEggCount(text));
}

export function actOnDirectMsgAsync(
    user: SlackUserContext,
    message: SlackEscapedText
): Future<Err, None> {
    return strike(
        message,
        when(textIsCommand, cmd => actOnCommandAsync(user, cmd)),
        otherwise(() => execRenameAsync(user, message))
    );
}

function parseUserMentions(text: SlackEscapedText): SlackUserUniqueId[] {
    const mentions = text.match(/<@\w+>/g) || [];
    const userIds = mentions.map(m => m.replace(/[<>@]/g, ''));
    const uniqUserIds = new Set(userIds);

    pipe(
        matchAll(/<@\w+>/g)
    )

    return Array.from(uniqUserIds) as SlackUserUniqueId[];
}

function parseEggCount(text: SlackEscapedText): EggCount {
    return matchAll(/:egg:/g)(text).length as EggCount;
}
