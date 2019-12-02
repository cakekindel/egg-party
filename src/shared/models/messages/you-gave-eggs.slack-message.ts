import { SlackBlockMessage } from '../slack/messages';
import { SlackMessageSectionBlock } from '../slack/messages/blocks/layout/section';

export class SlackMessageYouGaveEggs extends SlackBlockMessage
{
    constructor(userIds: string[], numberOfEggsGivenEach: number, numberOfEggsLeft: number)
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

        // tslint:disable:max-line-length
        super([
            SlackMessageSectionBlock.fromText(`You gave ${numberOfEggsGivenEach} to ${mentionsReadable} (${numberOfEggsLeft} eggs left today)`),
            SlackMessageSectionBlock.fromText(`Great job! I bet they're honored. I know I would be.`),
        ]);
        // tslint:enable:max-line-length
    }
}
