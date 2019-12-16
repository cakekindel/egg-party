import { SlackMessageBlockElementType } from '../slack-message-block-element-type.enum';
import { ISlackMessageBlockElement } from '../slack-message-block-element.interface';

// tslint:disable:variable-name
export class SlackMessageImageElement implements ISlackMessageBlockElement {
    public type = SlackMessageBlockElementType.Image;

    /** @param alt_text A plaintext summary of the image without markup */
    constructor(public image_url: string, public alt_text?: string) {}
}
