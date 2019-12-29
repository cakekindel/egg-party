import { LeaderboardMode } from '../leaderboard-mode.enum';

import { TimePeriod } from '../../../../enums';

export interface ILeaderboardInteractionPayload {
    mode: LeaderboardMode;
    period: TimePeriod;
}
