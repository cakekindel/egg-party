import { SlackBlockMessage } from '../slack/messages';

export class YouReceivedEggsSlackMessage extends SlackBlockMessage {
    constructor(giverId: string, eggCount: number) {
        const plural = eggCount !== 1;
        super(
            [],
            `<@${giverId} gave you ${plural ? eggCount : 'an'} egg${
                plural ? 's' : ''
            }>`
        );
    }
}
