import { SlackMessageTextCompositionType } from '../../composition/text/slack-message-text-composition-type.enum';
import { SlackMessageTextComposition } from '../../composition/text/slack-message-text-composition.model';
import { ISlackMessageBlockElement } from '../../element/slack-message-block-element.interface';
import { SlackMessageLayoutBlockType } from '../slack-message-layout-block-type.enum';
import { ISlackMessageLayoutBlock } from '../slack-message-layout-block.interface';

// tslint:disable:variable-name
/** @see {@link https://api.slack.com/reference/messaging/blocks#section} */
export class SlackMessageSectionBlock implements ISlackMessageLayoutBlock {
    public readonly type = SlackMessageLayoutBlockType.Section;

    /**
     * @param text Max length 3,000 chars
     * @param fields fields will be rendered in 2 columns of side-by-side text.
     *      Maximum 10 items, with each item having a max length of 2,000 chars.
     * @param accessory An Element to display in the section
     */
    constructor(
        public text?: SlackMessageTextComposition,
        public fields?: SlackMessageTextComposition[],
        public accessory?: ISlackMessageBlockElement,
        public block_id?: string
    ) {}

    public static fromText(text: string): SlackMessageSectionBlock {
        const textObj = new SlackMessageTextComposition(
            SlackMessageTextCompositionType.Markdown,
            text
        );
        return new SlackMessageSectionBlock(textObj);
    }
}
