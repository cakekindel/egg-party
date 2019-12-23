import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import * as moment from 'moment';
import { DailyEggsService } from '../../../src/api/services/daily-eggs.service';
import { Chicken, Egg, SlackUser } from '../../../src/db/entities';
import { EggRepo, SlackUserRepo } from '../../../src/db/repos';
import { TestClass, TestMethod } from '../../test-utilities/directives';
import _ = require('lodash');

@TestClass()
export class DailyEggsServiceSpec {
    @TestMethod()
    public async should_refreshEggs_when_itsBeenAHotMinuteSinceTheyGaveEggs(): Promise<
        void
    > {
        // arrange
        // - test data
        const user = new SlackUser();

        user.eggs = [];
        user.chickens = [new Chicken(), new Chicken(), new Chicken()];

        const yesterday = moment().subtract(1, 'day');
        user.dailyEggsLastRefreshedDate = yesterday.toDate();

        // - dependencies
        const eggRepo = Substitute.for<EggRepo>();
        eggRepo
            .getByIds(Arg.any())
            .returns(Promise.resolve(_.cloneDeep(user.eggs)));
        const userRepo = Substitute.for<SlackUserRepo>();

        // - dependency setup

        // - unit under test
        const uut = new DailyEggsService(eggRepo, userRepo);

        // act
        await uut.ensureDailyEggsFresh(user);

        // assert
        userRepo.received().save(user);
        eggRepo
            .received()
            .save(
                Arg.is((eggs?: Egg[]) => eggs?.length === user.chickens?.length)
            );

        const lastRefreshedDateWasUpdated = moment(
            user.dailyEggsLastRefreshedDate
        ).isSame(moment(), 'day');

        expect(
            lastRefreshedDateWasUpdated,
            'SlackUser.lastRefreshedDate was updated'
        ).to.be.true;
    }

    @TestMethod()
    public async should_notRefreshEggs_when_eggsWereRefreshedRecently(): Promise<
        void
    > {
        // arrange
        // - test data
        const user = new SlackUser();

        user.eggs = [];
        user.chickens = [new Chicken(), new Chicken(), new Chicken()];

        // - dependencies
        const eggRepo = Substitute.for<EggRepo>();
        const userRepo = Substitute.for<SlackUserRepo>();
        eggRepo
            .getByIds(Arg.any())
            .returns(Promise.resolve(_.cloneDeep(user.eggs)));

        // - dependency setup

        // - unit under test
        const uut = new DailyEggsService(eggRepo, userRepo);

        // act
        await uut.ensureDailyEggsFresh(user);

        // assert
        userRepo.didNotReceive().save(user);
        eggRepo
            .didNotReceive()
            .save(
                Arg.is((eggs?: Egg[]) => eggs?.length === user.chickens?.length)
            );
    }

    @TestMethod()
    public async should_onlyRefreshUpToNumberOfChickens_when_someEggsLeft(): Promise<
        void
    > {
        // arrange
        // - test data
        const user = new SlackUser();

        user.eggs = [new Egg()];
        user.chickens = [new Chicken(), new Chicken(), new Chicken()];

        const yesterday = moment().subtract(1, 'day');
        user.dailyEggsLastRefreshedDate = yesterday.toDate();

        // - dependencies
        const eggRepo = Substitute.for<EggRepo>();
        const userRepo = Substitute.for<SlackUserRepo>();
        eggRepo
            .getByIds(Arg.any())
            .returns(Promise.resolve(_.cloneDeep(user.eggs)));

        // - dependency setup

        // - unit under test
        const uut = new DailyEggsService(eggRepo, userRepo);

        // act
        await uut.ensureDailyEggsFresh(user);

        // assert
        userRepo.received().save(user);
        eggRepo
            .received()
            .save(
                Arg.is((eggs?: Egg[]) => eggs.length === user.chickens.length)
            );
    }
}
