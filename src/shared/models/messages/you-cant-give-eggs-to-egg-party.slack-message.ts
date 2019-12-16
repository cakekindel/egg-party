import { SlackBlockMessage } from '../slack/messages';

export class SlackMessageYouCantGiveEggsToEggParty extends SlackBlockMessage {
    constructor() {
        super([], 'You can\'t give eggs to me, silly!');
    }
}
