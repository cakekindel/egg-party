import { Arg } from '@fluffy-spoon/substitute';
import { isEqual } from 'lodash';
import { Just } from 'purify-ts';
import { ChickenRenamingService } from '../../../../../src/api/services/chicken-renaming.service';
import { EggGivingService } from '../../../../../src/api/services/egg-giving.service';
import {
    SlackCommandHandler,
    SlackMessageHandler,
} from '../../../../../src/api/services/slack/handlers';
import { SlackTeamProvider } from '../../../../../src/business/providers';
import { SlackTeam } from '../../../../../src/business/view-models';
import { Chicken } from '../../../../../src/db/entities';
import { CreateEitherAsync } from '../../../../../src/purify/create-either-async.fns';
import { SlackDmCommand } from '../../../../../src/shared/enums';
import { ConversationType } from '../../../../../src/shared/models/slack/conversations';
import { ISlackEventMessagePosted } from '../../../../../src/shared/models/slack/events';
import { MessageSubtype } from '../../../../../src/shared/models/slack/events/message-subtype.enum';
import { UnitTestSetup } from '../../../../test-utilities';
import { TestClass, TestMethod } from '../../../../test-utilities/directives';

@TestClass()
export class SlackMessageHandlerSpec {
    @TestMethod()
    public async should_callCommandHandler_when_dmReceivedAndNoChickensToRename(): Promise<
        void
    > {
        // arrange
        // - test data
        const command = 'test_command_ooOOoo';
        const message = this.createMessage({
            text: command,
            channel_type: ConversationType.DirectMessage,
        });

        // - dependencies
        const unitTestSetup = this.getUnitTestSetup();

        // - dependency setup
        unitTestSetup.dependencies
            .get(ChickenRenamingService)
            .getChickenAwaitingRenameForUser(message.user, message.workspaceId)
            .returns(Promise.resolve(undefined));

        // act
        await unitTestSetup.unitUnderTest.handleMessage(message);

        // assert
        unitTestSetup.dependencies
            .get(SlackCommandHandler)
            .received()
            .handleCommand(
                message.user,
                message.workspaceId,
                message.text as SlackDmCommand
            );
    }

    @TestMethod()
    public async should_notCallCommandHandler_when_dmReceivedAndChickensToRename(): Promise<
        void
    > {
        // arrange
        // - test data
        const command = 'test_command_ooOOoo';
        const message = this.createMessage({
            text: command,
            channel_type: ConversationType.DirectMessage,
        });

        // - dependencies
        const unitTestSetup = this.getUnitTestSetup();

        // - dependency setup
        unitTestSetup.dependencies
            .get(ChickenRenamingService)
            .getChickenAwaitingRenameForUser(message.user, message.workspaceId)
            .returns(Promise.resolve(new Chicken()));

        // act
        await unitTestSetup.unitUnderTest.handleMessage(message);

        // assert
        unitTestSetup.dependencies
            .get(SlackCommandHandler)
            .didNotReceive()
            .handleCommand(
                message.user,
                message.workspaceId,
                message.text as SlackDmCommand
            );

        unitTestSetup.dependencies
            .get(ChickenRenamingService)
            .received()
            .renameChicken(Arg.any(), Arg.any(), Arg.any(), message.text);
    }

    @TestMethod()
    public async should_notCallServices_when_botDmReceived(): Promise<void> {
        // arrange
        const message = this.createMessage({
            text: '🤖 BRRP VOOP MMMM EEEE',
            channel_type: ConversationType.DirectMessage,
            subtype: MessageSubtype.Bot,
        });
        message.user = undefined;

        const unitTestSetup = this.getUnitTestSetup();

        // act
        await unitTestSetup.unitUnderTest.handleMessage(message);

        // assert
        unitTestSetup.dependencies
            .get(SlackCommandHandler)
            .didNotReceive()
            .handleCommand(Arg.any(), Arg.any(), Arg.any());

        unitTestSetup.dependencies
            .get(ChickenRenamingService)
            .didNotReceive()
            .renameChicken(Arg.any(), Arg.any(), Arg.any(), Arg.any());
    }

    @TestMethod()
    public async should_callEggGivingService_when_channelMessageWithEggsReceived(): Promise<
        void
    > {
        // parameterize
        interface ITestCase {
            message: string;
            expectedUserIds: string[];
            expectedEggCount: number;
        }
        const testCases: ITestCase[] = [
            {
                message: '<@U1234> good job! :egg: :egg:',
                expectedUserIds: ['U1234'],
                expectedEggCount: 2,
            },
            {
                message: '<@U1234> <@U2345> <@U8765> :egg: :egg:',
                expectedUserIds: ['U1234', 'U2345', 'U8765'],
                expectedEggCount: 2,
            },
            {
                message:
                    '<@U1234> <@U1234> I accidentally tagged you twice! :egg:',
                expectedUserIds: ['U1234'],
                expectedEggCount: 1,
            },
        ];

        for (const testCase of testCases) {
            // arrange
            const message = this.createMessage({
                text: testCase.message,
                channel_type: ConversationType.Public,
            });

            const test = this.getUnitTestSetup();

            // act
            await test.unitUnderTest.handleMessage(message);

            // assert
            test.dependencies
                .get(EggGivingService)
                .received(1)
                .giveEggs(
                    message.workspaceId,
                    message.user,
                    testCase.expectedEggCount,
                    Arg.is(ids => isEqual(ids, testCase.expectedUserIds))
                );
        }
    }

    @TestMethod()
    public async should_notCallEggGivingService_when_channelMessageWithoutEggsReceived(): Promise<
        void
    > {
        // arrange
        const messageText = '<@U1234> have you been to spatula city?';
        const message = this.createMessage({
            text: messageText,
            channel_type: ConversationType.Public,
        });

        const test = this.getUnitTestSetup();

        // act
        await test.unitUnderTest.handleMessage(message);

        // assert
        test.dependencies
            .get(EggGivingService)
            .didNotReceive()
            .giveEggs(Arg.any(), Arg.any(), Arg.any(), Arg.any());
    }

    private getUnitTestSetup(): UnitTestSetup<SlackMessageHandler> {
        const test = new UnitTestSetup(SlackMessageHandler);

        test.dependencies
            .get(SlackTeamProvider)
            .getBySlackId(Arg.any())
            .returns(
                CreateEitherAsync.wrapRight(
                    Just({ botUserId: '🤖' } as SlackTeam)
                )
            );

        return test;
    }

    private createMessage(
        msgParts: Partial<ISlackEventMessagePosted>
    ): ISlackEventMessagePosted {
        Object.assign(msgParts, { user: 'U123', workspaceId: 'W123' });

        return msgParts as ISlackEventMessagePosted;
    }
}
