import { Injectable } from '@nestjs/common';
import { Moment } from 'moment';
import { TimePeriod } from '../enums';
import { Immutable, ImmutableMap } from '../types/immutable';
import moment = require('moment');

@Injectable()
export class TimePeriodService {
    private readonly getPeriodStartMap: ImmutableMap<
        TimePeriod,
        () => Moment
    > = new Map([
        [
            TimePeriod.Today,
            () =>
                moment()
                    .utc()
                    .hour(0)
                    .minute(0)
                    .second(0),
        ],
        [
            TimePeriod.Week,
            () =>
                moment()
                    .utc()
                    .day('Monday')
                    .hour(0)
                    .minute(0)
                    .second(0),
        ],
        [
            TimePeriod.Month,
            () =>
                moment()
                    .utc()
                    .date(1)
                    .hour(0)
                    .minute(0)
                    .second(0),
        ],
        [TimePeriod.AllTime, () => moment(0)], // unix epoch
    ]);

    public dateIsWithinPeriod(
        date: Immutable<Date>,
        period: TimePeriod
    ): boolean {
        const periodStart = this.getPeriodStart(period);
        return this.dateAfterMoment(date, periodStart);
    }

    public getPeriodStart(period: TimePeriod): Moment {
        const getMoment =
            this.getPeriodStartMap.get(period) ?? (() => moment());
        return getMoment();
    }

    private dateAfterMoment(
        date: Immutable<Date>,
        momentInstance: Moment
    ): boolean {
        return moment(date.toISOString()).isAfter(momentInstance);
    }
}
