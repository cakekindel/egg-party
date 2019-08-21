import { HttpRequest } from '@azure/functions';
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
    public async verifySlackRequest(request: HttpRequest): Promise<boolean>
    {
        const requestSignature = this.getHeader(request, 'x-slack-signature');
        const timestamp = this.getHeader(request, 'x-slack-request-timestamp');

        if (requestSignature && timestamp)
        {
            const signingSecret = EnvironmentVariables.SlackSigningSecret;
            const body = (request as RequestWithRawBody).rawBody;
            const signature = createHmac('sha256', signingSecret).update(`v0:${timestamp}:${body}`).digest('hex');

            return hashesEqual(Buffer.from(`v0=${signature}`), Buffer.from(requestSignature));
        }

        return false;
    }

    public async getAllPublicChannels(): Promise<ISlackConversation[]>
    {
        const getChannels = new SlackGetConversationsListRequest();
        const response = await axios.request<ISlackGetConversationsListResponse>(getChannels);
        this.throwIfNotOk(response.data);

        return response.data.channels;
    }

    public async getChannelInfo(channelId: string): Promise<ISlackConversation>
    {
        const getChannel = new SlackGetConversationInfoRequest(channelId);
        const response = await axios.request<ISlackGetConversationInfoResponse>(getChannel);
        this.throwIfNotOk(response.data);

        return response.data.channel;
    }

    public async getBotUserId(): Promise<string>
    {
        const getOwnIdentity = new SlackAuthTestRequest();
        const response = await axios.request<ISlackAuthTestResponse>(getOwnIdentity);
        this.throwIfNotOk(response.data);

        return response.data.user_id;
    }

    public async sendHookMessage(hookUrl: string, message: SlackBlockMessage): Promise<void>
    {
        const sendMessage = new SlackSendMessageRequest(message);
        sendMessage.baseURL = '';
        sendMessage.url = hookUrl;

        const response = await axios.request<ISlackResponse>(sendMessage);
        this.throwIfNotOk(response.data);
    }

    public async sendMessage(channelId: string, message: SlackBlockMessage): Promise<void>
    {
        message.channel = channelId;
        const sendMessage = new SlackSendMessageRequest(message);
        const response = await axios.request<ISlackResponse>(sendMessage);
        this.throwIfNotOk(response.data);
    }

    public async sendDirectMessage(userId: string, message: SlackBlockMessage): Promise<void>
    {
        const directMessageChannelId = await this.getDirectMessageChannelId(userId);
        message.channel = directMessageChannelId;

        const sendMessage = new SlackSendMessageRequest(message);
        const response = await axios.request<ISlackResponse>(sendMessage);
        this.throwIfNotOk(response.data);
    }

    private async getDirectMessageChannelId(userId: string): Promise<string>
    {
        const openDm = new SlackOpenDirectMessageRequest(userId);
        const response = await axios.request<ISlackOpenDirectMessageResponse>(openDm);
        this.throwIfNotOk(response.data);

        return response.data.channel.id;
    }

    private throwIfNotOk(response: ISlackResponse): void
    {
        if (!response.ok)
        {
            throw new Error(response.error);
        }
    }

    private getHeader(request: HttpRequest, header: string): string | undefined
    {
        const headerClean = header.trim().toLowerCase();
        const headerKey = Object.keys(request.headers).find((h) => h.toLowerCase().trim() === headerClean);

        return headerKey && request.headers[headerKey];
    }
}
