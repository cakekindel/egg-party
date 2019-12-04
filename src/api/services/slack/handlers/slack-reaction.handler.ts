import { Injectable } from '@nestjs/common';
import { SlackEmoji } from '../../../../shared/models/slack';
import { ISlackEventReactionAdded, ISlackEventWrapper } from '../../../../shared/models/slack/events';
import { EggGivingService } from '../../egg-giving.service';

@Injectable()
export class SlackReactionHandler
{
    constructor(private eggGivingService: EggGivingService) { }

    public async handleReaction(event: ISlackEventWrapper<ISlackEventReactionAdded>): Promise<void>
    {
        if (event.event.reaction === SlackEmoji.Egg)
        {
            return await this.eggGivingService.giveEggs(event.team_id, event.event.user, 1, [event.event.item_user]);
        }
    }
}
