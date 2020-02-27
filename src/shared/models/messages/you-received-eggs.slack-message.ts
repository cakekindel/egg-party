import { SlackBlockMessage } from '../slack/messages';

export class YouReceivedEggsSlackMessage extends SlackBlockMessage {
    constructor(giverId: string, eggCount: number) {
        const plural = eggCount !== 1;

        const atGiver = `<@${giverId}>`;
        const eggCountString = `${plural ? eggCount : 'an'}`;
        const eggOrEggs = `egg${plural ? 's' : ''}`;

        super([], `${atGiver} gave you ${eggCountString} ${eggOrEggs}!`);
    }
}
