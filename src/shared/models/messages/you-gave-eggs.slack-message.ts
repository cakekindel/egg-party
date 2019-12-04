import { SlackBlockMessage } from '../slack/messages';
import { SlackMessageContextBlock } from '../slack/messages/blocks/layout/context';
import { SlackMessageSectionBlock } from '../slack/messages/blocks/layout/section';

export class SlackMessageYouGaveEggs extends SlackBlockMessage
{
    constructor(userIds: string[], numberOfEggsGivenEach: number, numberOfEggsLeft: number)
    {
        const mentionsList = SlackMessageYouGaveEggs.getReadableMentionsList(userIds);
        const numberOfEggsString = numberOfEggsGivenEach === 1 ? 'an egg' : `${numberOfEggsGivenEach} eggs`;

        super([
            SlackMessageSectionBlock.fromText(`You gave ${numberOfEggsString} ${userIds.length > 1 ? 'each to' : 'to'} ${mentionsList}!`),
            SlackMessageContextBlock.fromText(`_(You have ${numberOfEggsLeft} eggs left to give today)_`),
        ]);
    }

    /** transforms `['U123', 'U222', 'U723']` into `'@user1, @user2, and @user3'` */
    private static getReadableMentionsList(userIds: string[]): string
    {
        const mentions = userIds.map(id => `<@${id}>`);

        let mentionsReadable: string;
        if (mentions.length <= 1)
        {
            mentionsReadable = mentions[0];
        }
        else if (mentions.length === 2)
        {
            mentionsReadable = `${mentions[0]} and ${mentions[1]}`;
        }
        else
        {
            const lastMention = mentions.pop() || '';
            mentions.push(`and ${lastMention}`);
            mentionsReadable = mentions.join(', ');
        }

        return mentionsReadable;
    }
}
