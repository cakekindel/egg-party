import { Injectable } from '@nestjs/common';

import { SlackApiService } from './slack-api.service';
import { SlackMessageBuilderService } from './slack-message-builder.service';

import { SlackUserRepo } from '../../../db/repos';
import { SlackEventType } from '../../../shared/models/slack/events';
import { ISlackEvent, ISlackEventChallenge, ISlackEventMessagePosted, ISlackEventWrapper } from '../../../shared/models/slack/events';

@Injectable()
export class SlackEventHandlerService
{
    constructor
    (
        private api: SlackApiService,
        private messageBuilder: SlackMessageBuilderService,
        private userRepo: SlackUserRepo,
    ) { }

    public async handleEvent(event: ISlackEvent): Promise<void | string>
    {
        switch (event.type)
        {
            case SlackEventType.Challenge:
                return (event as ISlackEventChallenge).challenge;
            case SlackEventType.EventWrapper:
                return await this.handleWrapper(event as ISlackEventWrapper);
        }
    }

    private async handleWrapper(wrapper: ISlackEventWrapper): Promise<void>
    {
        const innerEvent = wrapper.event;

        switch (innerEvent.type)
        {
            case SlackEventType.MessagePosted:
            {
                return await this.handleMessagePosted(innerEvent as ISlackEventMessagePosted, wrapper.team_id);
            }
        }
    }

    private async handleMessagePosted(event: ISlackEventMessagePosted, workspaceId: string): Promise<void>
    {
        if (event.subtype)
        {
            return;
        }

        const botIsInChannel = (await this.api.getChannelInfo(event.channel)).is_member;
        const mentions = event.text.match(/<(@.*?)>/g) || [];

        if (botIsInChannel && event.user && mentions.length && event.text.includes(':egg:'))
        {
            const slackUser = await this.userRepo.getOrCreateBySlackId(event.user, workspaceId);
            const users = mentions.map((m) => m.replace(/[\<\>]/g, ''));
            const eggCount = (event.text.match(/:egg:/g) || []).length;

            // if (userCanGiveEggs(event.user))
            // {

            // }

            this.api.sendMessage(this.messageBuilder.testGiveEggsResponse(mentions, eggCount, event.channel));
        }
    }
}
