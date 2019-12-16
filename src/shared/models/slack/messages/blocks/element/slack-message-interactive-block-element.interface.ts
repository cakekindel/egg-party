import { ISlackMessageBlockElement } from './slack-message-block-element.interface';

export interface ISlackMessageInteractiveBlockElement
    extends ISlackMessageBlockElement {
    action_id: string;
}
