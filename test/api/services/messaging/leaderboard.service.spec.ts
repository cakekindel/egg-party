import { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { Just } from 'purify-ts';
import { LeaderboardService } from '../../../../src/api/services/messaging';
import { SlackTeamProvider } from '../../../../src/api/services/providers';
import { SlackApiService } from '../../../../src/api/services/slack';
import * as ViewModel from '../../../../src/business/view-models';
import { SlackUserRepo } from '../../../../src/db/repos';
import { CreateMaybeAsync } from '../../../../src/purify/create-maybe-async.fns';
import {
    EnumUtility,
    SlackInteractionId,
    TimePeriod,
} from '../../../../src/shared/enums';
import {
    LeaderboardConstants,
    LeaderboardMode,
    LeaderboardSlackMessage,
} from '../../../../src/shared/models/messages/leaderboard';
import { ISpec, UnitTestSetup } from '../../../test-utilities';
import { TestClass, TestMethod } from '../../../test-utilities/directives';
import qs = require('qs');
import sinon = require('sinon');
import Sinon = require('sinon');

@TestClass()
export class LeaderboardServiceSpec implements ISpec<LeaderboardService> {
    private readonly testData = {
        userId: 'U123',
        wsId: 'W123',
        hookUrl: 'http://www.cheese.com',
        team: { oauthToken: '🔑' } as ViewModel.SlackTeam,
    };

    private sandbox: Sinon.SinonSandbox;
    public before(): void {
        this.sandbox = sinon.createSandbox();
    }

    public after(): void {
        this.sandbox.restore();
    }

    @TestMethod()
    public async should_sendLeaderboard_when_sendInvoked(): Promise<void> {
        // arrange
        const test = this.getUnitTestSetup();

        // act
        await test.unitUnderTest.send(this.testData.userId, this.testData.wsId);

        // assert
        test.dependencies
            .get(SlackApiService)
            .received()
            .sendDirectMessage(
                this.testData.team.oauthToken,
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

        this.sandbox.stub(EnumUtility, 'Parse').callsFake((_, val) => val);

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
                this.testData.team.oauthToken,
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

        const badMode =
            'eeshould_sendUnknownCommandMessage_when_unknownCommandSentk bad data';
        const goodPeriod = TimePeriod.Week;

        this.sandbox.stub(EnumUtility, 'Parse').callsFake((_, val) => {
            return val === goodPeriod ? goodPeriod : undefined;
        });

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
                this.testData.team.oauthToken,
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
        const test = new UnitTestSetup(LeaderboardService);

        test.dependencies
            .get(SlackUserRepo)
            .getAllInWorkspace(this.testData.wsId)
            .returns(Promise.resolve([]));

        test.dependencies
            .get(SlackTeamProvider)
            .getBySlackId(this.testData.wsId)
            .returns(CreateMaybeAsync.fromMaybe(Just(this.testData.team)));

        return test;
    }
}
