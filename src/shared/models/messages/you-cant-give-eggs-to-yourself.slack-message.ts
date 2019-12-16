import { SlackBlockMessage } from '../slack/messages';

export class SlackMessageYouCantGiveEggsToYourself extends SlackBlockMessage {
    constructor() {
        super([], 'You can\'t give eggs to yourself, silly!');
    }
}
