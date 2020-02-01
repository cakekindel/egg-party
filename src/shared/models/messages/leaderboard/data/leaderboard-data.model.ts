import * as fp from 'lodash/fp';
import { Egg } from '../../../../../db/entities';
import { TimePeriod } from '../../../../enums/time-period.enum';
import { PureAction } from '../../../../types/delegates/action';
import { PureFunc } from '../../../../types/delegates/func';
import { Predicate } from '../../../../types/delegates/predicate';
import { Immutable, ImmutableMap } from '../../../../types/immutable';
import { TimePeriodService } from '../../../../utility/time-period.service';
import { LeaderboardConstants } from '../leaderboard-constants';
import { LeaderboardMode } from '../leaderboard-mode.enum';
import { ILeaderboardEntry } from './leaderboard-user-entry.model';

interface ISlackIdentifier {
    slackUserId: string;
    slackWorkspaceId: string;
}

interface IEggGiver {
    eggsGiven?: Egg[];
}

interface IEggReceiver {
    eggs?: Egg[];
}

export type UserStub = ISlackIdentifier & IEggGiver & IEggReceiver;

export class LeaderboardData {
    constructor(
        private readonly timePeriodHelper: TimePeriodService,
        users: Immutable<UserStub[]>,
        selfId: string,
        mode: LeaderboardMode = LeaderboardConstants.DefaultMode,
        period: TimePeriod = LeaderboardConstants.DefaultPeriod
    ) {
        this.mode = mode;
        this.period = period;

        const sortAndFilterUsers = fp.pipe(
            fp.map(this.filterEggsByPeriod),
            fp.sortBy(this.getScore),
            fp.reverse,
            fp.entries,
            fp.map(([ix, u]) => this.toLeaderboardEntry(ix, u))
        ) as PureFunc<UserStub[], ILeaderboardEntry[]>;

        const allUsers = sortAndFilterUsers(users);

        this.users = fp.take(5, allUsers);
        this.self = fp.find(u => u.userId === selfId, allUsers);
    }
    private readonly scoreForMode: ImmutableMap<
        LeaderboardMode,
        PureFunc<Immutable<UserStub>, number>
    > = new Map([
        [LeaderboardMode.Givers, u => u.eggsGiven?.length ?? 0],
        [LeaderboardMode.Receivers, u => u.eggs?.length ?? 0],
    ]);

    public readonly self?: Immutable<ILeaderboardEntry>;
    public readonly users: Immutable<ILeaderboardEntry[]>;
    public readonly mode: LeaderboardMode;
    public readonly period: TimePeriod;

    private readonly getScore: PureFunc<UserStub, number> = u =>
        this.scoreForMode.get(this.mode)?.(u) ?? 0

    private readonly copyUserAndFilterEggs: PureFunc<
        UserStub,
        TimePeriod,
        UserStub
    > = (user, period) => {
        const eggInPeriod: Predicate<Egg> = e => this.eggInPeriod(e, period);

        return {
            slackUserId: user.slackUserId,
            slackWorkspaceId: user.slackWorkspaceId,
            eggs: user?.eggs?.filter(eggInPeriod),
            eggsGiven: user?.eggsGiven?.filter(eggInPeriod),
        };
    }

    private readonly eggInPeriod: PureFunc<Egg, TimePeriod, boolean> = (
        egg,
        period
    ) => {
        const givenDate = egg.givenOnDate ?? new Date(0);
        return this.timePeriodHelper.dateIsWithinPeriod(givenDate, period);
    }

    private readonly filterEggsByPeriod: PureAction<UserStub> = u =>
        this.copyUserAndFilterEggs(u, this.period)

    private readonly toLeaderboardEntry: PureFunc<
        string,
        UserStub,
        ILeaderboardEntry
    > = (ix, u) => ({
        userId: u.slackUserId,
        score: this.getScore(u),
        place: +ix + 1,
    })
}
