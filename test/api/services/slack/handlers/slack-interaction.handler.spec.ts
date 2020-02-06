import { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { Just } from 'purify-ts';
import { LeaderboardService } from '../../../../../src/api/services/messaging';
import { SlackTeamProvider } from '../../../../../src/business/providers';
import {
    SlackApiService,
    SlackGuideBookService,
    SlackMessageBuilderService,
} from '../../../../../src/api/services/slack';
import { SlackInteractionHandler } from '../../../../../src/api/services/slack/handlers';
import { SlackTeam } from '../../../../../src/business/view-models';
import { Chicken, SlackUser } from '../../../../../src/db/entities';
import { ChickenRepo, SlackUserRepo } from '../../../../../src/db/repos';
import { CreateMaybeAsync } from '../../../../../src/purify/create-maybe-async.fns';
import { SlackInteractionId } from '../../../../../src/shared/enums';
import { GuideBookPageId } from '../../../../../src/shared/models/guide-book';
import { ISlackInteractionPayload } from '../../../../../src/shared/models/slack/interactions/slack-interaction-payload.model';
import { SlackBlockMessage } from '../../../../../src/shared/models/slack/messages';
import { ISpec, UnitTestSetup } from '../../../../test-utilities';
import { TestClass, TestMethod } from '../../../../test-utilities/directives';

@TestClass()
export class SlackInteractionHandlerSpec
    implements ISpec<SlackInteractionHandler> {
    public testData = {
        team: {
            slackTeamId: '🏦',
            botUserId: '🤖',
            oauthToken: '🗝',
        } as SlackTeam,
    };

    @TestMethod()
    public async should_deferToLeaderboardService_when_leaderboardInteraction(): Promise<
        void
    > {
        // arrange
        const setup = this.getUnitTestSetup();

        setup.dependencies
            .get(LeaderboardService)
            .shouldHandleInteraction(Arg.any())
            .returns(true);

        const interaction = this.makePayload({
            team: { id: this.testData.team.slackTeamId, domain: '' },
            user: { id: 'U' } as any,
            actions: [{ action_id: '' } as any],
            response_url: 'fart',
        });

        // act
        await setup.unitUnderTest.handleInteraction(interaction);

        // assert
        setup.dependencies
            .get(LeaderboardService)
            .received()
            .handleInteraction(
                interaction.user.id,
                interaction.team.id,
                interaction.response_url,
                interaction.actions[0]
            );
    }

    @TestMethod()
    public async should_sendGuideBookPage_when_jumpedTo(): Promise<void> {
        // arrange
        const setup = this.getUnitTestSetup();

        // - test data
        setup.dependencies
            .get(LeaderboardService)
            .shouldHandleInteraction(Arg.any())
            .returns(false);

        const testPage = new SlackBlockMessage([], 'test');
        setup.dependencies
            .get(SlackGuideBookService)
            .build(Arg.all())
            .returns(testPage);

        const userId = 'U1234';
        const goToPage = GuideBookPageId.LearnAboutChicks;
        const responseHookUrl = 'respond_here';

        const interaction = this.makePayload({
            response_url: responseHookUrl,
            team: { id: this.testData.team.slackTeamId, domain: '' },
            user: {
                id: userId,
                username: 'test_user',
                team_id: this.testData.team.slackTeamId,
            },
            actions: [
                {
                    block_id: '1234',
                    type: 'static_select',
                    action_id: SlackInteractionId.GuideBookJumpToPage,
                    selected_option: {
                        value: goToPage,
                    },
                },
            ],
        });

        // act
        await setup.unitUnderTest.handleInteraction(interaction);

        // assert
        setup.dependencies
            .get(SlackGuideBookService)
            .received()
            .build(userId, this.testData.team.botUserId, goToPage);
        setup.dependencies
            .get(SlackApiService)
            .received()
            .sendHookMessage(
                this.testData.team.oauthToken,
                responseHookUrl,
                testPage
            );
    }

    @TestMethod()
    public async should_sendManageChickens_when_manageChickensClicked(): Promise<
        void
    > {
        // arrange
        const setup = this.getUnitTestSetup();

        // - test data
        setup.dependencies
            .get(LeaderboardService)
            .shouldHandleInteraction(Arg.any())
            .returns(false);

        const userId = '1234';
        const user = new SlackUser();
        user.chickens = [new Chicken()];

        setup.dependencies
            .get(SlackUserRepo)
            .getBySlackId(userId, this.testData.team.slackTeamId)
            .returns(Promise.resolve(user));

        const message = new SlackBlockMessage([], 'test');
        setup.dependencies
            .get(SlackMessageBuilderService)
            .manageChickens(user.chickens)
            .returns(message);

        const interaction = this.makePayload({
            team: { domain: 'slack', id: this.testData.team.slackTeamId },
            user: {
                id: userId,
                team_id: this.testData.team.slackTeamId,
                username: 'foo',
            },
            actions: [
                {
                    block_id: '1',
                    type: 'button',
                    action_id: SlackInteractionId.ManageChickens,
                },
            ],
        });

        // act
        await setup.unitUnderTest.handleInteraction(interaction);

        // assert
        setup.dependencies
            .get(SlackMessageBuilderService)
            .received()
            .manageChickens(user.chickens);
        setup.dependencies
            .get(SlackApiService)
            .received()
            .sendDirectMessage(this.testData.team.oauthToken, userId, message);
    }

    @TestMethod()
    public async should_flagChickenAsAwaitingRename_when_renameChickenClicked(): Promise<
        void
    > {
        // arrange
        const setup = this.getUnitTestSetup();

        // - test data
        const chicken = new Chicken();
        chicken.id = 12;

        setup.dependencies
            .get(ChickenRepo)
            .getById(chicken.id)
            .returns(Promise.resolve(chicken));

        setup.dependencies
            .get(LeaderboardService)
            .shouldHandleInteraction(Arg.any())
            .returns(false);

        const interaction = this.makePayload({
            actions: [
                {
                    action_id: SlackInteractionId.RenameChicken,
                    value: chicken.id.toString(),
                    block_id: '1',
                    type: 'button',
                },
            ],
        });

        // act
        await setup.unitUnderTest.handleInteraction(interaction);

        // assert
        expect(chicken.awaitingRename).to.be.true;
    }

    private makePayload(
        part: Partial<ISlackInteractionPayload>
    ): ISlackInteractionPayload {
        const interactionBase: ISlackInteractionPayload = {
            type: 'block_actions',
            api_app_id: '12345',
            response_url: '',
            team: {
                domain: 'test',
                id: this.testData.team.slackTeamId,
            },
            token: '1234',
            user: {
                id: 'U123',
                team_id: this.testData.team.slackTeamId,
                username: 'sally_user',
            },
            actions: [],
        };

        Object.assign(interactionBase, part);

        return interactionBase;
    }

    public getUnitTestSetup(): UnitTestSetup<SlackInteractionHandler> {
        const test = new UnitTestSetup(SlackInteractionHandler);

        test.dependencies
            .get(SlackTeamProvider)
            .getBySlackId(this.testData.team.slackTeamId)
            .returns(CreateMaybeAsync.fromMaybe(Just(this.testData.team)));

        return test;
    }
}
