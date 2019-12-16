// tslint:disable: variable-name
export class SlackTextMessage {
    /** @param thread_ts Optionally send message as a thread reply
     * @param mrkdwn Indicate that the text should be interpreted with formatting
     */
    constructor(
        public text: string,
        public thread_ts?: string,
        public mrkdwn = false
    ) {}
}
