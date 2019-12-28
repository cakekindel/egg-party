import moment = require('moment');
import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { Egg } from '../../../../src/db/entities';
import { TimePeriod } from '../../../../src/shared/enums';
import { LeaderboardMode } from '../../../../src/shared/models/messages/leaderboard';
import {
    LeaderboardData,
    UserStub,
} from '../../../../src/shared/models/messages/leaderboard/data';
import { TimePeriodService } from '../../../../src/shared/utility/time-period.service';
import { TestClass, TestMethod } from '../../../test-utilities/directives';
import _ = require('lodash');

type EggAge =
    | '1 hour ago'
    | '1 day ago'
    | '1 week ago'
    | '1 month ago'
    | '1 year ago';

@TestClass()
export class LeaderboardDataSpec {
    private readonly ageMomentMap = new Map<EggAge, moment.Moment>([
        ['1 hour ago', moment().subtract(1, 'hour')],
        ['1 day ago', moment().subtract(1, 'day')],
        ['1 week ago', moment().subtract(1, 'week')],
        ['1 month ago', moment().subtract(1, 'month')],
        ['1 year ago', moment().subtract(1, 'year')],
    ]);

    @TestMethod()
    public async should_filterEggsByTimePeriod(): Promise<void> {
        // arrange
        const users = [
            this.testUser('gave-eggs', [], ['1 hour ago', '1 day ago']),
        ];

        const timePeriod = Substitute.for<TimePeriodService>();
        const aCoupleHoursAgo = moment().subtract(2, 'hours');
        const isWithinPeriod = (date: Date) =>
            moment(date).isAfter(aCoupleHoursAgo);
        timePeriod.dateIsWithinPeriod(Arg.all()).mimicks(isWithinPeriod);

        // act
        const data = new LeaderboardData(
            timePeriod,
            users,
            '',
            LeaderboardMode.Givers,
            TimePeriod.Today
        );

        // assert
        expect(data.users[0].score).to.equal(1);
    }

    @TestMethod()
    public async should_sortUsersByEggsGiven(): Promise<void> {
        // arrange
        const userIds = {
            first: 'first',
            second: 'second',
            third: 'third',
        };

        const users = [
            this.testUser(
                userIds.second,
                [],
                _.fill(new Array(3), '1 day ago')
            ),
            this.testUser(userIds.first, [], _.fill(new Array(4), '1 day ago')),
            this.testUser(userIds.third, [], _.fill(new Array(2), '1 day ago')),
        ];

        const expectedOrder = [userIds.first, userIds.second, userIds.third];

        const timeHelper = Substitute.for<TimePeriodService>();
        timeHelper.dateIsWithinPeriod(Arg.all()).returns(true);

        // act
        const data = new LeaderboardData(
            timeHelper,
            users,
            '',
            LeaderboardMode.Givers,
            TimePeriod.AllTime
        );

        // assert
        expect(data.users.map(u => u.userId)).to.deep.equal(expectedOrder);
    }

    @TestMethod()
    public async should_sortUsersByEggsReceived(): Promise<void> {
        // arrange
        const userIds = {
            first: 'first',
            second: 'second',
            third: 'third',
        };

        const users = [
            this.testUser(
                userIds.second,
                _.fill(new Array(4), '1 day ago'),
                []
            ),
            this.testUser(userIds.first, _.fill(new Array(5), '1 day ago'), []),
            this.testUser(userIds.third, _.fill(new Array(3), '1 day ago'), []),
        ];

        const expectedOrder = [userIds.first, userIds.second, userIds.third];

        const timeHelper = Substitute.for<TimePeriodService>();
        timeHelper.dateIsWithinPeriod(Arg.all()).returns(true);

        // act
        const data = new LeaderboardData(
            timeHelper,
            users,
            '',
            LeaderboardMode.Receivers,
            TimePeriod.AllTime
        );

        // assert
        expect(data.users.map(u => u.userId)).to.deep.equal(expectedOrder);
    }

    @TestMethod()
    public async should_populateSelf(): Promise<void> {
        // arrange
        const userIds = {
            first: 'first',
            second: 'second',
            third: 'third',
        };

        const users = [
            this.testUser(
                userIds.second,
                _.fill(new Array(4), '1 day ago'),
                []
            ),
            this.testUser(userIds.first, _.fill(new Array(5), '1 day ago'), []),
            this.testUser(userIds.third, _.fill(new Array(3), '1 day ago'), []),
        ];

        const timeHelper = Substitute.for<TimePeriodService>();
        timeHelper.dateIsWithinPeriod(Arg.all()).returns(true);

        // act
        const data = new LeaderboardData(
            timeHelper,
            users,
            userIds.second,
            LeaderboardMode.Receivers,
            TimePeriod.AllTime
        );

        // assert
        expect(data.self).to.deep.equal({
            place: 2,
            score: 4,
            userId: userIds.second,
        });
    }

    private eggFromAge(age: EggAge): Egg {
        const egg = new Egg();
        egg.givenOnDate = this.ageMomentMap.get(age).toDate();
        return egg;
    }

    private testUser(
        id: string,
        eggsReceived: EggAge[],
        eggsGiven: EggAge[]
    ): UserStub {
        return {
            slackUserId: id,
            slackWorkspaceId: '',
            eggs: eggsReceived.map(a => this.eggFromAge(a)),
            eggsGiven: eggsGiven.map(a => this.eggFromAge(a)),
        };
    }
}
