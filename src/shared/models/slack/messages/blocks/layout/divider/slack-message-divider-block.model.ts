import { SlackMessageLayoutBlockType } from '../slack-message-layout-block-type.enum';
import { ISlackMessageLayoutBlock } from '../slack-message-layout-block.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/blocks#divider} */
export class SlackMessageDividerBlock implements ISlackMessageLayoutBlock {
    public type = SlackMessageLayoutBlockType.Divider;

    constructor(public block_id?: string) { }
}
