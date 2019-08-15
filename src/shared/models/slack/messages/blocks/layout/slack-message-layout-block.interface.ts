import { SlackMessageLayoutBlockType } from './slack-message-layout-block-type.enum';

export interface ISlackMessageLayoutBlock {
    type: SlackMessageLayoutBlockType;
    block_id?: string;
}
