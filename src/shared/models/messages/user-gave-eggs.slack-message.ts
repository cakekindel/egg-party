import { SlackBlockMessage } from '../slack/messages';

export class SlackMessageUserGaveEggs extends SlackBlockMessage
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

        super([], `You gave ${numberOfEggsGivenEach} to ${mentionsReadable}. Great job! I bet they're honored. I know I would be.`);
    }
}
