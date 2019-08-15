import { Injectable } from '@nestjs/common';
import { SlackBlockMessage } from '../../../shared/models/slack/messages';

@Injectable()
export class SlackMessageBuilderService
{
    public testGiveEggsResponse(mentions: string[], eggCount: number, channelId: string): SlackBlockMessage
    {
        return new SlackBlockMessage(channelId, [], `You gave ${mentions.join(', ')} each ${eggCount} egg(s)!`);
    }
}
