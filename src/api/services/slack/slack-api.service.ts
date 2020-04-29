import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHmac, timingSafeEqual as hashesEqual } from 'crypto';
import { Request } from 'express';
import { Either, Left, Nothing, Right } from 'purify-ts';
import { IRequestWithRawBody } from '../../../shared/models/express/request-with-raw-body.model';
import { ISlackResponse } from '../../../shared/models/slack/api';
import {
    ISlackGetConversationInfoResponse,
    ISlackGetConversationsListResponse,
    SlackGetConversationInfoRequest,
    SlackGetConversationsListRequest,
} from '../../../shared/models/slack/api/conversations';
import { SlackOpenDirectMessageRequest } from '../../../shared/models/slack/api/conversations/slack-open-direct-message-request.model';
import { ISlackOpenDirectMessageResponse } from '../../../shared/models/slack/api/conversations/slack-open-direct-message-response.model';
import { SlackSendMessageRequest } from '../../../shared/models/slack/api/messages';
import { ISlackConversation } from '../../../shared/models/slack/conversations';
import { SlackBlockMessage } from '../../../shared/models/slack/messages';
import { ConfigService } from '../../../shared/utility';

@Injectable()
export class SlackApiService {
    constructor(private readonly config: ConfigService) {}

    public verifySlackRequest(request: Request): boolean {
        const requestSignature = this.getHeader(request, 'x-slack-signature');
        const timestamp = this.getHeader(request, 'x-slack-request-timestamp');

        if (
            typeof requestSignature === 'string' &&
            typeof timestamp === 'string'
        ) {
            const signingSecret = this.config.slackSigningSecret;
            const body = (request as IRequestWithRawBody).rawBody;
            const signature = createHmac('sha256', signingSecret)
                .update(`v0:${timestamp}:${body}`)
                .digest('hex');

            return hashesEqual(
                Buffer.from(`v0=${signature}`),
                Buffer.from(requestSignature)
            );
        }

        return false;
    }

    public async getAllPublicChannels(
        apiToken: string
    ): Promise<ISlackConversation[]> {
        const getChannels = new SlackGetConversationsListRequest(apiToken);
        const response = await axios.request<
            ISlackGetConversationsListResponse
        >(getChannels);
        this.throwIfNotOk(response.data);

        return response.data.channels;
    }

    public async getChannelInfo(
        apiToken: string,
        channelId: string
    ): Promise<ISlackConversation> {
        const getChannel = new SlackGetConversationInfoRequest(
            apiToken,
            channelId
        );
        const response = await axios.request<ISlackGetConversationInfoResponse>(
            getChannel
        );
        this.throwIfNotOk(response.data);

        return response.data.channel;
    }

    public async sendHookMessage(
        apiToken: string,
        hookUrl: string,
        message: SlackBlockMessage
    ): Promise<void> {
        const sendMessage = new SlackSendMessageRequest(
            apiToken,
            message,
            hookUrl
        );

        const response = await axios.request<ISlackResponse>(sendMessage);
        this.throwIfNotOk(response.data);
    }

    public async sendMessage(
        apiToken: string,
        channelId: string,
        message: SlackBlockMessage
    ): Promise<void> {
        message.channel = channelId;
        const sendMessage = new SlackSendMessageRequest(apiToken, message);
        const response = await axios.request<ISlackResponse>(sendMessage);
        this.throwIfNotOk(response.data);
    }

    public async sendDirectMessage(
        apiToken: string,
        userId: string,
        message: SlackBlockMessage
    ): Promise<void> {
        const directMessageChannelId = await this.getDirectMessageChannelId(
            apiToken,
            userId
        );

        message.channel = directMessageChannelId;

        const sendMessage = new SlackSendMessageRequest(apiToken, message);
        const response = await axios.request<ISlackResponse>(sendMessage);
        this.throwIfNotOk(response.data);
    }

    private async getDirectMessageChannelId(
        apiToken: string,
        userId: string
    ): Promise<string> {
        const openDm = new SlackOpenDirectMessageRequest(apiToken, userId);
        const response = await axios.request<ISlackOpenDirectMessageResponse>(
            openDm
        );
        this.throwIfNotOk(response.data);

        return response.data.channel.id;
    }

    private throwIfNotOk(response: ISlackResponse): void {
        if (!response.ok) {
            throw new Error(response.error);
        }
    }

    private getHeader(
        request: Request,
        header: string
    ): string | string[] | undefined {
        const headerClean = header.trim().toLowerCase();
        const headerKey = Object.keys(request.headers).find(
            h => h.toLowerCase().trim() === headerClean
        );

        return headerKey && request.headers[headerKey];
    }
}
