import { parseEnumValue } from '../../functions/utils/enum';
import { isSome, Option } from 'fp-ts/lib/Option';

export enum SlackDmCommand {
    Help = 'help',
    ManageChickens = 'chickens',
    Leaderboard = 'leaderboard',
    Profile = 'profile',
}

export function parseCommand(str: string): Option<SlackDmCommand> {
    return parseEnumValue(SlackDmCommand, str);
}

export function textIsCommand(str: string): str is SlackDmCommand {
    return isSome(parseCommand(str));
}
