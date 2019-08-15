import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';
import * as hashJs from 'hash.js';

import {
    ISlackGetConversationInfoResponse,
    ISlackGetConversationsListResponse,
    SlackGetConversationInfoRequest,
    SlackGetConversationsListRequest
} from '../../../shared/models/slack/api/conversations';
import { SlackSendMessageRequest } from '../../../shared/models/slack/api/messages';

import { RequestWithRawBody } from '../../../shared/models/express/request-with-raw-body.model';
import { ISlackResponse } from '../../../shared/models/slack/api';
import { SlackAuthTestRequest, ISlackAuthTestResponse } from '../../../shared/models/slack/api/auth';
import { ISlackConversation } from '../../../shared/models/slack/conversations';
import { SlackBlockMessage } from '../../../shared/models/slack/messages';
import { EnvironmentVariables } from '../../../shared/utility';

@Injectable()
export class SlackApiService
{
    public async getAllPublicChannels(): Promise<ISlackConversation[]>
    {
        const getChannels = new SlackGetConversationsListRequest();
        const response = await axios.request<ISlackGetConversationsListResponse>(getChannels);

        return response.data.channels;
    }

    public async verifySlackRequest(request: Request): Promise<boolean>
    {
        const requestSignature = request.header('x-slack-signature');
        const timestamp = request.header('x-slack-request-timestamp');

        if (requestSignature && timestamp)
        {
            const signingSecret = EnvironmentVariables.SlackSigningSecret;
            const rawBody = (request as RequestWithRawBody).rawBody;

            const baseString = `v0:${timestamp}:${rawBody}`;
            const computedSignature = hashJs.hmac(
                                                hashJs.sha256 as unknown as Sha256,
                                                EnvironmentVariables.SlackSigningSecret,
                                                'hex'
                                            )
                                            .update(baseString)
                                            .digest('hex');

            if (computedSignature === requestSignature)
            {
                return true;
            }
        }

        return false;
    }

    public async getChannelInfo(channelId: string): Promise<ISlackConversation>
    {
        const getChannel = new SlackGetConversationInfoRequest(channelId);
        const response = await axios.request<ISlackGetConversationInfoResponse>(getChannel);

        return response.data.channel;
    }

    public async getBotUserId(): Promise<string>
    {
        const getOwnIdentity = new SlackAuthTestRequest();
        const response = await axios.request<ISlackAuthTestResponse>(getOwnIdentity);

        return response.data.user_id;
    }

    public async sendMessage(message: SlackBlockMessage): Promise<void>
    {
        const sendMessage = new SlackSendMessageRequest(message);
        const response = await axios.request<ISlackResponse>(sendMessage);
    }

    private async getRawSlackRequestBody(request: Request): Promise<string>
    {
        const rawBodyPromise = new Promise<string>((resolve) =>
        {
            let buffer = '';
            request.on('data', (chunk) => {
                buffer += chunk;
            });

            request.on('end', () =>
            {
                resolve(buffer);
            });
        });

        return await rawBodyPromise;
    }
}
