import { SlackMessageConfirmComposition } from '../../composition/confirm/slack-message-confirm-composition.model';
import { SlackMessageOptionComposition } from '../../composition/option/slack-message-option-composition.model';
import { SlackMessageBlockElementType } from '../slack-message-block-element-type.enum';
import { ISlackMessageInteractiveBlockElement } from '../slack-message-interactive-block-element.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/block-elements#overflow} */
export class SlackMessageOverflowElement implements ISlackMessageInteractiveBlockElement {
    public type = SlackMessageBlockElementType.Overflow;

    /**
     * @param action_id A unique (within the message) identifier for this overflow menu. Will be included in interaction payload.
     * @param options Options to display in the menu, min 2, max 5
     * @param confirm Optional confirmation dialog that's shown after a date is selected
     */
    constructor(
        public action_id: string,
        public options: SlackMessageOptionComposition[],
        public confirm?: SlackMessageConfirmComposition,
    ) { }
}
