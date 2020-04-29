import {Future} from 'fp-ts-fluture/lib/Future';
import {None} from 'fp-ts/lib/Option';
import {Err} from '../../types/err';
import {SlackEscapedText} from '../../types/slack/brands';
import {SlackUserContext} from '../../types/slack/user';

export enum ExecRenameErr {
    UserOutOfEggs = 'user_out_of_eggs',
}

export function execRenameAsync(
    user: SlackUserContext,
    newName: SlackEscapedText
): Future<Err<ExecRenameErr>, None> {

}
