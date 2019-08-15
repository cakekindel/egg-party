import { SlackMessageConfirmComposition } from '../../composition/confirm/slack-message-confirm-composition.model';
import { SlackMessageTextComposition } from '../../composition/text/slack-message-text-composition.model';
import { ISlackMessageInteractiveBlockElement } from '../slack-message-interactive-block-element.interface';

export interface ISlackMessageSelectElement extends ISlackMessageInteractiveBlockElement {
    placeholder: SlackMessageTextComposition;
    confirm?: SlackMessageConfirmComposition;
}
