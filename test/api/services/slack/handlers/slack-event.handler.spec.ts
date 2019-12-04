import { suite, test } from 'mocha-typescript';

import { SlackEventHandler, SlackMessageHandler, SlackReactionHandler } from '../../../../../src/api/services/slack/handlers';
import { SlackEmoji } from '../../../../../src/shared/models/slack';
import {
    ISlackEvent,
    ISlackEventMessagePosted,
    ISlackEventReactionAdded,
    ISlackEventWrapper,
    SlackEventType
} from '../../../../../src/shared/models/slack/events';
import { ISpec, UnitTestSetup } from '../../../../test-utilities';

@suite()
export class SlackEventHandlerSpec implements ISpec<SlackEventHandler>
{
    private testConstants = {
        userId: 'U123',
    };

    @test()
    public async should_callMessageHandler_when_messageEventFires(): Promise<void>
    {
        // arrange
        const event = this.createMessage('My Message');
        const testSetup = this.getUnitTestSetup();

        // act
        await testSetup.unitUnderTest.handleEvent(event);

        // assert
        testSetup.dependencies.get(SlackMessageHandler)
                              .received()
                              .handleMessage(event.event);
    }

    @test()
    public async should_callReactionHandler_when_reactionEventFires(): Promise<void>
    {
        // arrange
        const event = this.createReaction('egg');
        const testSetup = this.getUnitTestSetup();

        // act
        await testSetup.unitUnderTest.handleEvent(event);

        // assert
        testSetup.dependencies.get(SlackReactionHandler)
                              .received()
                              .handleReaction(event);
    }

    @test()
    public async should_notThrow_when_otherEventFires(): Promise<void>
    {
        // arrange
        const event = { type: 'user_florped' as SlackEventType } as ISlackEvent;

        // act
        await this.getUnitTestSetup().unitUnderTest.handleEvent(event);

        // assert
    }

    private createMessage(message: string): ISlackEventWrapper<ISlackEventMessagePosted>
    {
        const partialEvent = { text: message, user: this.testConstants.userId };
        return this.createEvent<ISlackEventMessagePosted>(partialEvent, SlackEventType.MessagePosted);
    }

    private createReaction(emoji: string): ISlackEventWrapper<ISlackEventReactionAdded>
    {
        const partialEvent = { reaction: emoji as SlackEmoji, user: this.testConstants.userId };
        return this.createEvent<ISlackEventReactionAdded>(partialEvent, SlackEventType.ReactionAdded);
    }

    private createEvent<TInnerEvent extends ISlackEvent>(
        messageParts: Partial<TInnerEvent>,
        innerEventTypeName: SlackEventType,
    ): ISlackEventWrapper<TInnerEvent>
    {
        const innerEvent = { type: innerEventTypeName } as TInnerEvent;
        Object.assign(innerEvent, messageParts);

        const event = {
            type: SlackEventType.EventWrapper,
            event: innerEvent,
        } as ISlackEventWrapper<TInnerEvent>;

        return event;
    }

    public getUnitTestSetup(): UnitTestSetup<SlackEventHandler>
    {
        return new UnitTestSetup(SlackEventHandler);
    }
}
