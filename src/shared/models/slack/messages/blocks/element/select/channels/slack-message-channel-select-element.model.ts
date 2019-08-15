import { SlackMessageConfirmComposition } from '../../../composition/confirm/slack-message-confirm-composition.model';
import { SlackMessageTextComposition } from '../../../composition/text/slack-message-text-composition.model';
import { SlackMessageBlockElementType } from '../../slack-message-block-element-type.enum';
import { ISlackMessageSelectElement } from '../slack-message-select-element.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/block-elements#select} */
export class SlackMessageChannelSelectElement implements ISlackMessageSelectElement {
    public type = SlackMessageBlockElementType.ChannelSelect;

    /**
     * @param action_id A unique (within the message) identifier for this select menu. Will be included in interaction payload.
     * @param placeholder Placeholder text shown on the menu. Plaintext only, max length 150 chars
     * @param initial_channel Optional ID of a channel to be preselected
     * @param confirm Optional confirmation dialog when a user is selected
     */
    constructor(
        public action_id: string,
        public placeholder: SlackMessageTextComposition,
        public initial_channel?: string,
        public confirm?: SlackMessageConfirmComposition,
    ) { }
}
