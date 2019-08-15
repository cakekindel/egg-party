import { SlackMessageConfirmComposition } from '../../composition/confirm/slack-message-confirm-composition.model';
import { SlackMessageTextComposition } from '../../composition/text/slack-message-text-composition.model';
import { SlackMessageBlockElementType } from '../slack-message-block-element-type.enum';
import { ISlackMessageInteractiveBlockElement } from '../slack-message-interactive-block-element.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/block-elements#datepicker} */
export class SlackMessageDatepickerElement implements ISlackMessageInteractiveBlockElement {
    public type = SlackMessageBlockElementType.DatePicker;

    /**
     * @param action_id A unique (within the message) identifier for this datepicker. Will be included in interaction payload.
     * @param placeholder The placeholder text shown on the picker. Plaintext only, max length 150 chars
     * @param initial_date Initially selected date, in `'YYYY-MM-DD'` format
     * @param confirm Optional confirmation dialog that's shown after a date is selected
     */
    constructor(
        public action_id: string,
        public placeholder?: SlackMessageTextComposition,
        public initial_date?: string,
        public confirm?: SlackMessageConfirmComposition,
    ) { }
}
