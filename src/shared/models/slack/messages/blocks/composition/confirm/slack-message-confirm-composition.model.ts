import { SlackMessageTextComposition } from '../text/slack-message-text-composition.model';

export class SlackMessageConfirmComposition {
    /**
     * @param title Plaintext only - max length 100 characters
     * @param text Plaintext only - max length 300 characters
     * @param confirm Plaintext only - max length 30 characters
     * @param deny Plaintext only - max length 30 characters
     */
    constructor(
        public title: SlackMessageTextComposition,
        public text: SlackMessageTextComposition,
        public confirm: SlackMessageTextComposition,
        public deny: SlackMessageTextComposition,
    ) { }
}
