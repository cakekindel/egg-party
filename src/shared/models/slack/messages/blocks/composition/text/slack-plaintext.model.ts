import { SlackMessageTextCompositionType } from './slack-message-text-composition-type.enum';
import { SlackMessageTextComposition } from './slack-message-text-composition.model';

export class SlackPlaintext extends SlackMessageTextComposition {
    constructor(text: string) {
        super(SlackMessageTextCompositionType.Plaintext, text);
    }
}
