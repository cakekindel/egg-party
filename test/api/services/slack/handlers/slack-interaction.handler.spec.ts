import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import {
    SlackApiService,
    SlackGuideBookService,
    SlackMessageBuilderService,
} from '../../../../../src/api/services/slack';
import { SlackInteractionHandler } from '../../../../../src/api/services/slack/handlers';
import { Chicken, SlackUser } from '../../../../../src/db/entities';
import { ChickenRepo, SlackUserRepo } from '../../../../../src/db/repos';
import { SlackInteractionId } from '../../../../../src/shared/enums';
import { GuideBookPageId } from '../../../../../src/shared/models/guide-book';
import { ISlackInteractionPayload } from '../../../../../src/shared/models/slack/interactions/slack-interaction-payload.model';
import { SlackBlockMessage } from '../../../../../src/shared/models/slack/messages';
import { TestClass, TestMethod } from '../../../../test-utilities/directives';
import { ISpec, UnitTestSetup } from '../../../../test-utilities';
import { LeaderboardService } from '../../../../../src/api/services/messaging';

@TestClass()
export class SlackInteractionHandlerSpec
    implements ISpec<SlackInteractionHandler> {
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
            team: { id: 'foo', domain: '' },
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

        const botId = 'Z789';
        setup.dependencies
            .get(SlackApiService)
            .getBotUserId()
            .returns(Promise.resolve(botId));

        const userId = 'U1234';
        const goToPage = GuideBookPageId.LearnAboutChicks;
        const responseHookUrl = 'respond_here';

        const interaction = this.makePayload({
            response_url: responseHookUrl,
            user: { id: userId, username: 'test_user', team_id: '1234' },
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
            .build(userId, botId, goToPage);
        setup.dependencies
            .get(SlackApiService)
            .received()
            .sendHookMessage(responseHookUrl, testPage);
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
        const teamId = 'slack';
        const user = new SlackUser();
        user.chickens = [new Chicken()];

        setup.dependencies
            .get(SlackUserRepo)
            .getBySlackId(userId, teamId)
            .returns(Promise.resolve(user));

        const message = new SlackBlockMessage([], 'test');
        setup.dependencies
            .get(SlackMessageBuilderService)
            .manageChickens(user.chickens)
            .returns(message);

        const interaction = this.makePayload({
            team: { domain: 'slack', id: teamId },
            user: { id: userId, team_id: teamId, username: 'foo' },
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
            .sendDirectMessage(userId, message);
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
                id: 'test',
            },
            token: '1234',
            user: {
                id: 'U123',
                team_id: 'test',
                username: 'sally_user',
            },
            actions: [],
        };

        Object.assign(interactionBase, part);

        return interactionBase;
    }

    public getUnitTestSetup(): UnitTestSetup<SlackInteractionHandler> {
        return new UnitTestSetup(SlackInteractionHandler);
    }
}
