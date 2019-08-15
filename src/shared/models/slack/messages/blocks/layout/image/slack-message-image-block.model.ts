import { SlackMessageTextComposition } from '../../composition/text/slack-message-text-composition.model';
import { SlackMessageLayoutBlockType } from '../slack-message-layout-block-type.enum';
import { ISlackMessageLayoutBlock } from '../slack-message-layout-block.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/blocks#image} */
export class SlackMessageImageBlock implements ISlackMessageLayoutBlock {
    public type = SlackMessageLayoutBlockType.Image;

    /** @param title {SlackMessageTextComposition} **Note**: title.type *must* be Plaintext. */

    /**
     * @param image_url Max 3,000 chars
     * @param alt_text A plain-text summary of the image. Max 2,000 chars.
     * @param title An optional title for the image. Plaintext only, max 2,000 chars.
     */
    constructor(
        public image_url: string,
        public alt_text: string,
        public title?: SlackMessageTextComposition,
        public block_id?: string,
    ) { }
}
