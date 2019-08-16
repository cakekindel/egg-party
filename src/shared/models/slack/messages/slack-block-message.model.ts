import { ISlackMessageLayoutBlock } from './blocks/layout/slack-message-layout-block.interface';

// tslint:disable:variable-name
export class SlackBlockMessage {
    /**
     * @param blocks Layout Blocks to display in the message
     * @param channel ID of channel to send message to
     * @param text Optional fallback text to be shown in notifications
     * @param thread_ts Optionally send message as a reply to a thread
     */
    constructor(
        public blocks: ISlackMessageLayoutBlock[],
        public text?: string,
        public thread_ts?: string,
        public channel?: string,
    ) { }
}
