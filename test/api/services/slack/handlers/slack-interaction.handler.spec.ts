import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

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

@suite()
export class SlackInteractionHandlerSpec {
    @test()
    public async should_sendGuideBookPage_when_jumpedTo(): Promise<void> {
        // arrange

        // - dependencies
        const api = Substitute.for<SlackApiService>();
        const guideBook = Substitute.for<SlackGuideBookService>();

        // - test data
        const testPage = new SlackBlockMessage([], 'test');
        guideBook.build(Arg.all()).returns(testPage);

        const botId = 'Z789';
        api.getBotUserId().returns(Promise.resolve(botId));

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

        // - unit under test
        const uut = new SlackInteractionHandler(
            api,
            null,
            null,
            null,
            guideBook
        );

        // act
        await uut.handleInteraction(interaction);

        // assert
        guideBook.received().build(userId, botId, goToPage);
        api.received().sendHookMessage(responseHookUrl, testPage);
    }

    @test()
    public async should_sendManageChickens_when_manageChickensClicked(): Promise<
        void
    > {
        // arrange

        // - dependencies
        const api = Substitute.for<SlackApiService>();
        const userRepo = Substitute.for<SlackUserRepo>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();

        // - test data
        const userId = '1234';
        const teamId = 'slack';
        const user = new SlackUser();
        user.chickens = [new Chicken()];

        userRepo.getBySlackId(userId, teamId).returns(Promise.resolve(user));

        const message = new SlackBlockMessage([], 'test');
        messageBuilder.manageChickens(user.chickens).returns(message);

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

        // - unit under test
        const uut = new SlackInteractionHandler(
            api,
            messageBuilder,
            userRepo,
            null,
            null
        );

        // act
        await uut.handleInteraction(interaction);

        // assert
        messageBuilder.received().manageChickens(user.chickens);
        api.received().sendDirectMessage(userId, message);
    }

    @test()
    public async should_flagChickenAsAwaitingRename_when_renameChickenClicked(): Promise<
        void
    > {
        // arrange

        // - dependencies
        const api = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();
        const chickenRepo = Substitute.for<ChickenRepo>();

        // - test data
        const chicken = new Chicken();
        chicken.id = 12;

        chickenRepo.getById(chicken.id).returns(Promise.resolve(chicken));

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

        // - unit under test
        const uut = new SlackInteractionHandler(
            api,
            messageBuilder,
            null,
            chickenRepo,
            null
        );

        // act
        await uut.handleInteraction(interaction);

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
}
