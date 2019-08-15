import { AxiosRequestConfig, Method } from 'axios';

import { EnvironmentVariables } from '../../../../utility';

import { ConversationType } from '../../conversations';
import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackGetConversationsListRequest implements AxiosRequestConfig {
    private channelTypesSanitized: string[];

    public baseURL = SlackApiBaseUrl;
    public url = 'conversations.list';
    public method: Method = 'GET';
    public params = {
        token: EnvironmentVariables.SlackApiToken,
        cursor: this.nextPageCursor,
        exclude_archived: this.excludeArchivedChannels,
        limit: this.limit,
        types: this.channelTypesSanitized
    };

    constructor
    (
        public channelTypes: ConversationType[] = [ConversationType.Public],
        public nextPageCursor?: string,
        public excludeArchivedChannels: boolean = true,
        public limit: number = 1000
    )
    {
        this.channelTypesSanitized = this.channelTypes.map((type) =>
            {
                if (type === ConversationType.Private)
                {
                    return 'private_channel';
                }

                return type;
            });
    }
}
