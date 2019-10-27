import { SlackMessageConfirmComposition } from '../../composition/confirm/slack-message-confirm-composition.model';
import { SlackMessageTextComposition } from '../../composition/text/slack-message-text-composition.model';
import { SlackMessageBlockElementType } from '../slack-message-block-element-type.enum';
import { ISlackMessageInteractiveBlockElement } from '../slack-message-interactive-block-element.interface';

import { SlackMessageButtonElementStyle } from './slack-message-button-element-style.enum';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/block-elements#button} */
export class SlackMessageButtonElement implements ISlackMessageInteractiveBlockElement {
    public type = SlackMessageBlockElementType.Button;

    /**
     * @param action_id A unique (within the message) identifier for this button. Will be included in interaction payload.
     * @param text Must be type Plaintext, max length 75 characters
     * @param url A URL to load in the user's browser on click. Max length 3,000 characters
     * @param value The value to send with the interaction payload
     * @param style
     * @param confirm Optional confirmation dialog
     */
    constructor(
        public action_id: string,
        public text: SlackMessageTextComposition,
        public url?: string,
        public value?: string,
        public style?: SlackMessageButtonElementStyle,
        public confirm?: SlackMessageConfirmComposition,
    ) { }
}
