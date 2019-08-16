import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHmac, timingSafeEqual as hashesEqual } from 'crypto';
import { Request } from 'express';

import { EnvironmentVariables } from '../../../shared/utility';

import {
    ISlackGetConversationInfoResponse,
    ISlackGetConversationsListResponse,
    SlackGetConversationInfoRequest,
    SlackGetConversationsListRequest
} from '../../../shared/models/slack/api/conversations';
import { SlackSendMessageRequest } from '../../../shared/models/slack/api/messages';

import { RequestWithRawBody } from '../../../shared/models/express/request-with-raw-body.model';
import { ISlackResponse } from '../../../shared/models/slack/api';
import { ISlackAuthTestResponse, SlackAuthTestRequest } from '../../../shared/models/slack/api/auth';
import { SlackOpenDirectMessageRequest } from '../../../shared/models/slack/api/conversations/slack-open-direct-message-request.model';
import { ISlackOpenDirectMessageResponse } from '../../../shared/models/slack/api/conversations/slack-open-direct-message-response.model';
import { ISlackConversation } from '../../../shared/models/slack/conversations';
import { SlackBlockMessage } from '../../../shared/models/slack/messages';

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

            const body = (request as RequestWithRawBody).rawBody;
            const baseString = `v0:${timestamp}:${body}`;
            const signature = createHmac('sha256', signingSecret).update(baseString).digest('hex');
            const sigBuffer = Buffer.from(`v0=${signature}`);

            const requestSigBuffer = Buffer.from(requestSignature);

            if (hashesEqual(sigBuffer, requestSigBuffer))
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

    public async sendMessage(channelId: string, message: SlackBlockMessage): Promise<void>
    {
        message.channel = channelId;
        const sendMessage = new SlackSendMessageRequest(message);
        const response = await axios.request<ISlackResponse>(sendMessage);
    }

    public async sendDirectMessage(userId: string, message: SlackBlockMessage): Promise<void>
    {
        const directMessageChannelId = await this.getDirectMessageChannelId(userId);

        message.channel = directMessageChannelId;
        const sendMessage = new SlackSendMessageRequest(message);
        await axios.request(sendMessage);
    }

    private async getDirectMessageChannelId(userId: string): Promise<string>
    {
        const openDm = new SlackOpenDirectMessageRequest(userId);
        const response = await axios.request<ISlackOpenDirectMessageResponse>(openDm);
        return response.data.channel.id;
    }
}
