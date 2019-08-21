import { SlackMessageConfirmComposition } from '../../../composition/confirm/slack-message-confirm-composition.model';
import { SlackMessageOptionComposition } from '../../../composition/option/slack-message-option-composition.model';
import { SlackMessageOptionGroupComposition } from '../../../composition/option/slack-message-option-group-composition.model';
import { SlackMessageTextComposition } from '../../../composition/text/slack-message-text-composition.model';
import { SlackMessageBlockElementType } from '../../slack-message-block-element-type.enum';
import { ISlackMessageSelectElement } from '../slack-message-select-element.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/block-elements#select} */
export class SlackMessageStaticSelectElement implements ISlackMessageSelectElement {
    public type = SlackMessageBlockElementType.StaticSelect;

    /**
     * @param action_id A unique (within the message) identifier for this select menu. Will be included in interaction payload.
     * @param placeholder Placeholder text shown on the menu. Plaintext only, max length 150 chars
     * @param options Options to be displayed in the select menu. Max 100.
     * @param option_groups Option groups to be displayed in the select menu. Max 100.
     * @param initial_option Optional item to be preselected
     * @param min_query_length Optionally specify how many characters must be typed in the lookahead field
     *      before Slack will hit your API for options
     * @param confirm Optional confirmation dialog when a user is selected
     */
    constructor(
        public action_id: string,
        public placeholder: SlackMessageTextComposition,
        public options?: SlackMessageOptionComposition[],
        public option_groups?: SlackMessageOptionGroupComposition[],
        public initial_option?: SlackMessageOptionComposition,
        public min_query_length?: number,
        public confirm?: SlackMessageConfirmComposition,
    ) { }
}
