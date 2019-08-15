import { SlackMessageTextComposition } from '../text/slack-message-text-composition.model';

/** @see {@link https://api.slack.com/reference/messaging/composition-objects#option} */
export class SlackMessageOptionComposition {
    /**
     * @param text The text shown in the menu option. Plaintext only, max 75 chars
     * @param value The string value passed to your app when this option is chosen, max 75 chars
     */
    constructor(public text: SlackMessageTextComposition, public value: string) { }
}
