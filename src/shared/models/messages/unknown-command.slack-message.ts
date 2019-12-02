import { SlackBlockMessage } from '../slack/messages';
import { SlackMessageSectionBlock } from '../slack/messages/blocks/layout/section';

export class SlackMessageUnknownCommand extends SlackBlockMessage
{
    constructor()
    {
        super([
            SlackMessageSectionBlock.fromText(`I'm sorry, I don't understand that command :confused:`),
            SlackMessageSectionBlock.fromText(`Here's a list of commands I know about:`),
        ]);
    }
}
