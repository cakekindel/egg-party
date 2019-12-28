import * as qs from 'qs';
import { TimePeriod } from '../../../../enums/time-period.enum';
import { ISlackInteractionAction } from '../../../slack/interactions/slack-interaction-action.model';
import { LeaderboardMode } from '../leaderboard-mode.enum';
import { ILeaderboardInteractionPayload } from './leaderboard-interaction-payload.model';

export class LeaderboardInteraction implements ISlackInteractionAction {
    public readonly type = 'static_select';
    public readonly action_id: string;
    public readonly block_id: string;
    public readonly value?: string;
    public readonly selected_option?: { value: string };

    public readonly mode?: LeaderboardMode;
    public readonly period?: TimePeriod;

    constructor(rawInteraction: ISlackInteractionAction) {
        this.action_id = rawInteraction.action_id;
        this.block_id = rawInteraction.block_id;
        this.value = rawInteraction.value;
        this.selected_option = rawInteraction.selected_option;

        const leaderboardModeMeta = qs.parse(
            this.selected_option?.value ?? ''
        ) as ILeaderboardInteractionPayload;

        this.mode = leaderboardModeMeta.mode;
        this.period = leaderboardModeMeta.period;
    }
}
