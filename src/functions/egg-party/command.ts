import { Future } from 'fp-ts-fluture/lib/Future';
import { None } from 'fp-ts/lib/Option';
import { SlackDmCommand } from '../../types/egg-party/command';
import { Err } from '../../types/err';
import { SlackUserContext } from '../../types/slack/user';

export enum ActOnCommandErr {
    _ = '_',
}

export async function actOnCommandAsync(
    user: SlackUserContext,
    command: SlackDmCommand
): Future<Err<ActOnCommandErr>, None>;
