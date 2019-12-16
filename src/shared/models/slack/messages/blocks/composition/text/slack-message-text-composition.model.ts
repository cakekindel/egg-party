import { SlackMessageTextCompositionType } from './slack-message-text-composition-type.enum';

export class SlackMessageTextComposition {
    /** @param emoji Indicates if text wrapped with colons will be interpreted as emojis -
     *      only applicable if `type is Plaintext (default: true)
     * @param verbatim Indicates if links and formatting should **not** be parsed -
     *      only applicable if `type is Markdown (default: false)
     */
    constructor(
        public type: SlackMessageTextCompositionType,
        public text: string,
        public emoji?: boolean,
        public verbatim?: boolean
    ) {}
}
