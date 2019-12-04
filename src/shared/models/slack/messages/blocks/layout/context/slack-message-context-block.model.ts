import { SlackMessageTextCompositionType } from '../../composition/text/slack-message-text-composition-type.enum';
import { SlackMessageTextComposition } from '../../composition/text/slack-message-text-composition.model';
import { SlackMessageImageElement } from '../../element/image/slack-message-image-element.model';
import { SlackMessageLayoutBlockType } from '../slack-message-layout-block-type.enum';
import { ISlackMessageLayoutBlock } from '../slack-message-layout-block.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/blocks#context} */
export class SlackMessageContextBlock implements ISlackMessageLayoutBlock {
    public type = SlackMessageLayoutBlockType.Context;

    /** @param elements Elements to show in the context block. Max 10 */
    constructor(public elements: Array<SlackMessageImageElement | SlackMessageTextComposition>, public block_id?: string) { }

    public static fromText(text: string): SlackMessageContextBlock
    {
        const textObj = new SlackMessageTextComposition(SlackMessageTextCompositionType.Markdown, text);
        return new SlackMessageContextBlock([textObj]);
    }
}
