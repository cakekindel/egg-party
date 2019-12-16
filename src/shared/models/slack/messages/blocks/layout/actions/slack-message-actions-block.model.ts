import { ISlackMessageInteractiveBlockElement } from '../../element/slack-message-interactive-block-element.interface';
import { SlackMessageLayoutBlockType } from '../slack-message-layout-block-type.enum';
import { ISlackMessageLayoutBlock } from '../slack-message-layout-block.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/blocks#actions} */
export class SlackMessageActionsBlock implements ISlackMessageLayoutBlock {
    public type = SlackMessageLayoutBlockType.Actions;

    /** @param elements Interactive elements to show in this block. Max 5 */
    constructor(
        public elements: ISlackMessageInteractiveBlockElement[],
        public block_id?: string
    ) {}
}
