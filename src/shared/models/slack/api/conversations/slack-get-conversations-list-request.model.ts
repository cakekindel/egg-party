import { AxiosRequestConfig, Method } from 'axios';

import { ConversationType } from '../../conversations';
import { SlackApiBaseUrl } from '../slack-api-base-url.const';

export class SlackGetConversationsListRequest implements AxiosRequestConfig {
    public baseURL = SlackApiBaseUrl;
    public url = 'conversations.list';
    public method: Method = 'GET';
    public params: { };

    constructor
    (
        token: string,
        channelTypes: ConversationType[] = [ConversationType.Public],
        nextPageCursor?: string,
        excludeArchivedChannels: boolean = true,
        limit: number = 1000
    )
    {
        const types = channelTypes.map((type) =>
            {
                if (type === ConversationType.Private)
                {
                    return 'private_channel';
                }

                return type;
            });

        this.params = {
            token,
            types,
            limit,
            cursor: nextPageCursor,
            exclude_archived: excludeArchivedChannels,
        };
    }
}
