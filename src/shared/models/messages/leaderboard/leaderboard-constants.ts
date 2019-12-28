import { Immutable } from '../../../types/immutable';
import { LeaderboardMode } from './leaderboard-mode.enum';
import { TimePeriod } from '../../../enums/time-period.enum';

export class LeaderboardConstants {
    public static readonly DefaultMode = LeaderboardMode.Givers;
    public static readonly SupportedModes: Immutable<LeaderboardMode[]> = [
        LeaderboardMode.Givers,
        LeaderboardMode.Receivers,
    ];

    public static readonly DefaultPeriod = TimePeriod.Today;
    public static readonly SupportedPeriods: Immutable<TimePeriod[]> = [
        TimePeriod.Today,
        TimePeriod.Week,
        TimePeriod.Month,
        TimePeriod.AllTime,
    ];
}
