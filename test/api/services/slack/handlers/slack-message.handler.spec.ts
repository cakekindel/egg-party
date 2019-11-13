import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { suite, test } from 'mocha-typescript';

import { expect } from 'chai';
import { fake } from 'sinon';
import { EggGivingService } from '../../../../../src/api/services/egg-giving.service';
import { SlackMessageHandler } from '../../../../../src/api/services/slack/handlers';
import { SlackCommandHandler } from '../../../../../src/api/services/slack/handlers/slack-command.handler';
import { SlackDmCommand } from '../../../../../src/shared/enums';
import { ConversationType } from '../../../../../src/shared/models/slack/conversations';
import { ISlackEventMessagePosted } from '../../../../../src/shared/models/slack/events';

@suite()
export class SlackMessageHandlerSpec
{
    @test()
    public async should_callCommandHandler_when_directMessageReceived(): Promise<void>
    {
        // arrange
        // - dependencies
        const eggGivingService = Substitute.for<EggGivingService>();
        const commandHandler = Substitute.for<SlackCommandHandler>();
        // - test data
        const command = 'test_command_ooOOoo';
        const message = this.createMessage({ text: command, channel_type: ConversationType.DirectMessage });
        // - unit under test
        const uut = new SlackMessageHandler(eggGivingService, commandHandler);

        // act
        await uut.handleMessage(message);

        // assert
        commandHandler.received().handleCommand(message.text as SlackDmCommand);
    }

    @test()
    public async should_callEggGivingService_when_channelMessageWithEggsReceived(): Promise<void>
    {
        // parameterize
        interface ITestCase { message: string; expectedUserIds: string[]; expectedEggCount: number; }
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
                message: '<@U1234> <@U1234> I accidentally tagged you twice! :egg:',
                expectedUserIds: ['U1234'],
                expectedEggCount: 1,
            },
        ];

        const giverId = 'U2222';
        const workspaceId = 'W111';

        for (const testCase of testCases)
        {
            // arrange
            // - dependencies
            const commandHandler = Substitute.for<SlackCommandHandler>();
            const eggGivingService = Substitute.for<EggGivingService>();

            // - dependency setup
            const giveEggsFake = fake();
            eggGivingService.giveEggs(Arg.all()).mimicks(giveEggsFake);

            // - test data
            const message = this.createMessage({
                user: giverId,
                text: testCase.message,
                channel_type: ConversationType.Public,
                workspaceId
            });

            // - unit under test
            const uut = new SlackMessageHandler(eggGivingService, commandHandler);

            // act
            await uut.handleMessage(message);

            // assert
            expect(giveEggsFake.calledOnce).to.be.true;
            expect(giveEggsFake.lastCall.args[0]).to.equal(workspaceId);
            expect(giveEggsFake.lastCall.args[1]).to.equal(giverId);
            expect(giveEggsFake.lastCall.args[2]).to.equal(testCase.expectedEggCount);
            expect(giveEggsFake.lastCall.args[3]).to.deep.equal(testCase.expectedUserIds);
        }
    }

    @test()
    public async should_notCallEggGivingService_when_channelMessageWithoutEggsReceived(): Promise<void>
    {
        // arrange
        // - dependencies
        const eggGivingService = Substitute.for<EggGivingService>();
        const commandHandler = Substitute.for<SlackCommandHandler>();
        // - test data
        const messageText = '<@U1234> have you been to spatula city?';
        const message = this.createMessage({ text: messageText, channel_type: ConversationType.Public });
        // - unit under test
        const uut = new SlackMessageHandler(eggGivingService, commandHandler);

        // act
        await uut.handleMessage(message);

        // assert
        eggGivingService.didNotReceive().giveEggs(Arg.any(), Arg.any(), Arg.any(), Arg.any());
    }

    private createMessage(msgParts: Partial<ISlackEventMessagePosted>): ISlackEventMessagePosted
    {
        return msgParts as ISlackEventMessagePosted;
    }
}
