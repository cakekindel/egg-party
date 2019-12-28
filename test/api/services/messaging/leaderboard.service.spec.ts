import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { LeaderboardService } from '../../../../src/api/services/messaging';
import { SlackApiService } from '../../../../src/api/services/slack';
import {
    LeaderboardSlackMessage,
    LeaderboardMode,
    LeaderboardConstants,
} from '../../../../src/shared/models/messages/leaderboard';
import { ISpec, UnitTestSetup } from '../../../test-utilities';
import {
    TestClass,
    TestMethod,
    TestCase,
} from '../../../test-utilities/directives';
import { SlackUserRepo } from '../../../../src/db/repos';
import { expect } from 'chai';
import { SlackInteractionId, TimePeriod } from '../../../../src/shared/enums';
import qs = require('qs');

@TestClass()
export class LeaderboardServiceSpec implements ISpec<LeaderboardService> {
    private readonly testData = {
        userId: 'U123',
        wsId: 'W123',
        hookUrl: 'http://www.cheese.com',
    };

    @TestMethod()
    public async should_sendLeaderboard_when_sendInvoked(): Promise<void> {
        // arrange
        const testSetup = this.getUnitTestSetup();

        // act
        await testSetup.unitUnderTest.send(
            this.testData.userId,
            this.testData.wsId
        );

        // assert
        testSetup.dependencies
            .get(SlackApiService)
            .received()
            .sendDirectMessage(
                this.testData.userId,
                Arg.is(m => m instanceof LeaderboardSlackMessage)
            );
    }

    @TestMethod()
    public async should_returnTrue_when_shouldHandleInteraction(): Promise<
        void
    > {
        // arrange
        const testSetup = this.getUnitTestSetup();
        const interaction = {
            action_id: SlackInteractionId.LeaderboardModeChange,
        };

        // act
        const actual = testSetup.unitUnderTest.shouldHandleInteraction(
            interaction as any
        );

        // assert
        expect(actual).to.equal(true);
    }

    @TestMethod()
    public async should_returnFalse_when_shouldNotHandleInteraction(): Promise<
        void
    > {
        // arrange
        const testSetup = this.getUnitTestSetup();
        const interaction = {
            action_id: SlackInteractionId.LearnAboutChickens,
        };

        // act
        const actual = testSetup.unitUnderTest.shouldHandleInteraction(
            interaction as any
        );

        // assert
        expect(actual).to.equal(false);
    }

    @TestMethod()
    public async should_sendLeaderboard_when_interactionFired(): Promise<void> {
        // arrange
        const testSetup = this.getUnitTestSetup();

        const expectedMode = LeaderboardMode.Receivers;
        const expectedPeriod = TimePeriod.Month;

        const interaction = {
            selected_option: {
                value: qs.stringify({
                    mode: expectedMode,
                    period: expectedPeriod,
                }),
            },
        };

        // act
        await testSetup.unitUnderTest.handleInteraction(
            this.testData.userId,
            this.testData.wsId,
            this.testData.hookUrl,
            interaction as any
        );

        // assert
        testSetup.dependencies
            .get(SlackApiService)
            .received()
            .sendHookMessage(
                this.testData.hookUrl,
                Arg.is((m: LeaderboardSlackMessage) => {
                    expect(m).to.be.instanceOf(LeaderboardSlackMessage);
                    expect(m.data.mode).to.equal(expectedMode);
                    expect(m.data.period).to.equal(expectedPeriod);

                    return true;
                })
            );
    }

    @TestMethod()
    public async should_useDefaultMode_when_interactionFiredAndModeUnknown(): Promise<
        void
    > {
        // arrange
        const testSetup = this.getUnitTestSetup();

        const badMode = 'eek bad data';
        const goodPeriod = TimePeriod.Week;

        const interaction = {
            selected_option: {
                value: qs.stringify({
                    mode: badMode,
                    period: goodPeriod,
                }),
            },
        };

        // act
        await testSetup.unitUnderTest.handleInteraction(
            this.testData.userId,
            this.testData.wsId,
            this.testData.hookUrl,
            interaction as any
        );

        // assert
        testSetup.dependencies
            .get(SlackApiService)
            .received()
            .sendHookMessage(
                this.testData.hookUrl,
                Arg.is((m: LeaderboardSlackMessage) => {
                    expect(m).to.be.instanceOf(LeaderboardSlackMessage);
                    expect(m.data.mode).to.equal(
                        LeaderboardConstants.DefaultMode
                    );
                    expect(m.data.period).to.equal(goodPeriod);

                    return true;
                })
            );
    }

    public getUnitTestSetup(): UnitTestSetup<LeaderboardService> {
        const setup = new UnitTestSetup(LeaderboardService);

        setup.dependencies
            .get(SlackUserRepo)
            .getAllInWorkspace(this.testData.wsId)
            .returns(Promise.resolve([]));

        return setup;
    }
}
