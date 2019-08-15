import { SlackMessageTextComposition } from '../text/slack-message-text-composition.model';
import { SlackMessageOptionComposition } from './slack-message-option-composition.model';

export class SlackMessageOptionGroupComposition {
    /**
     * @param label The label to be displayed above the options specified. Max length 75 chars
     * @param options Options that belong to this group. Max 100 items.
     */
    constructor(
        public label: SlackMessageTextComposition,
        public options: SlackMessageOptionComposition[],
    ) { }
}
