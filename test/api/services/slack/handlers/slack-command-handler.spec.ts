import { Arg } from '@fluffy-spoon/substitute';
import {
    SlackApiService,
    SlackGuideBookService,
    SlackMessageBuilderService,
} from '../../../../../src/api/services/slack';
import { SlackCommandHandler } from '../../../../../src/api/services/slack/handlers';
import { SlackUser, SlackTeam } from '../../../../../src/db/entities';
import { SlackUserRepo } from '../../../../../src/db/repos';
import { SlackDmCommand } from '../../../../../src/shared/enums';
import { GuideBookPageId } from '../../../../../src/shared/models/guide-book';
import { SlackMessageUnknownCommand } from '../../../../../src/shared/models/messages';
import { SlackBlockMessage } from '../../../../../src/shared/models/slack/messages';
import { ISpec, UnitTestSetup } from '../../../../test-utilities';
import { TestClass, TestMethod } from '../../../../test-utilities/directives';
import { LeaderboardService } from '../../../../../src/api/services/messaging';

@TestClass()
export class SlackCommandHandlerSpec implements ISpec<SlackCommandHandler> {
    public readonly testConstants = {
        botId: '🤖',
        userId: '👲',
        workspaceId: '🏢',
        guideBook: new SlackBlockMessage([]),
    } as const;

    @TestMethod()
    public async should_sendGuideBook_when_helpCommandReceived(): Promise<
        void
    > {
        // arrange
        const unitTestSetup = this.getUnitTestSetup();

        const user = this.createSlackUser(unitTestSetup);
        const cmd: SlackDmCommand = SlackDmCommand.Help;

        this.setupGuideBook(unitTestSetup);

        // act
        await unitTestSetup.unitUnderTest.handleCommand(
            user.slackUserId,
            user.slackWorkspaceId,
            cmd
        );

        // assert
        unitTestSetup.dependencies
            .get(SlackGuideBookService)
            .received()
            .send(user);
    }

    @TestMethod()
    public async should_sendChickenManagement_when_chickensCommandReceived(): Promise<
        void
    > {
        // arrange
        const unitTestSetup = this.getUnitTestSetup();

        const user = this.createSlackUser(unitTestSetup);
        const cmd: SlackDmCommand = SlackDmCommand.ManageChickens;

        // act
        await unitTestSetup.unitUnderTest.handleCommand(
            user.slackUserId,
            user.slackWorkspaceId,
            cmd
        );

        // assert
        unitTestSetup.dependencies
            .get(SlackMessageBuilderService)
            .received()
            .manageChickens(user.chickens);
    }

    @TestMethod()
    public async should_sendUnknownCommandMessage_when_unknownCommandSent(): Promise<
        void
    > {
        // arrange
        const unitTestSetup = this.getUnitTestSetup();

        const user = this.createSlackUser(unitTestSetup);
        const cmd = '❓' as SlackDmCommand;

        this.setupGuideBook(unitTestSetup);

        // act
        await unitTestSetup.unitUnderTest.handleCommand(
            user.slackUserId,
            user.slackWorkspaceId,
            cmd
        );

        // assert
        unitTestSetup.dependencies
            .get(SlackApiService)
            .received(1)
            .sendDirectMessage(
                user.team.oauthToken,
                user.slackUserId,
                Arg.is(m => m instanceof SlackMessageUnknownCommand)
            );

        unitTestSetup.dependencies
            .get(SlackGuideBookService)
            .received(1)
            .send(user, GuideBookPageId.LearnAboutCommands);
    }

    // TODO: implement, tracked in issue #64
    @TestMethod.skip()
    public async should_sendProfile_when_profileCommandReceived(): Promise<
        void
    > {
        // arrange
        const unitTestSetup = this.getUnitTestSetup();

        const user = this.createSlackUser(unitTestSetup);
        const cmd: SlackDmCommand = SlackDmCommand.Profile;

        // act
        await unitTestSetup.unitUnderTest.handleCommand(
            user.slackUserId,
            user.slackWorkspaceId,
            cmd
        );

        // assert
    }

    @TestMethod()
    public async should_sendLeaderboard_when_leaderboardCommandReceived(): Promise<
        void
    > {
        // arrange
        const unitTestSetup = this.getUnitTestSetup();

        const user = this.createSlackUser(unitTestSetup);
        const cmd: SlackDmCommand = SlackDmCommand.Leaderboard;

        // act
        await unitTestSetup.unitUnderTest.handleCommand(
            user.slackUserId,
            user.slackWorkspaceId,
            cmd
        );

        // assert

        unitTestSetup.dependencies
            .get(LeaderboardService)
            .received()
            .send(user.slackUserId, user.slackWorkspaceId);
    }

    private setupGuideBook(
        unitTestSetup: UnitTestSetup<SlackCommandHandler>
    ): void {
        unitTestSetup.dependencies
            .get(SlackGuideBookService)
            .build(Arg.all())
            .returns(this.testConstants.guideBook);
    }

    public getUnitTestSetup(): UnitTestSetup<SlackCommandHandler> {
        return new UnitTestSetup(SlackCommandHandler);
    }

    private createSlackUser(
        unitTestSetup: UnitTestSetup<SlackCommandHandler>
    ): SlackUser {
        const user = new SlackUser();
        user.slackUserId = this.testConstants.userId;
        user.slackWorkspaceId = this.testConstants.workspaceId;
        user.chickens = [];
        user.team = { oauthToken: '🔑' } as SlackTeam;

        unitTestSetup.dependencies
            .get(SlackUserRepo)
            .getOrCreateAndSendGuideBook(
                user.slackUserId,
                user.slackWorkspaceId
            )
            .returns(Promise.resolve(user));

        return user;
    }
}
