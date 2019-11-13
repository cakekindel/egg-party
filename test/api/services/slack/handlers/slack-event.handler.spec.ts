import Substitute from '@fluffy-spoon/substitute';
import { suite, test } from 'mocha-typescript';

import { SlackEventHandler, SlackMessageHandler } from '../../../../../src/api/services/slack/handlers';
import { ISlackEvent, ISlackEventMessagePosted, ISlackEventWrapper, SlackEventType } from '../../../../../src/shared/models/slack/events';

@suite()
export class SlackEventHandlerSpec
{
    @test()
    public async should_callMessageHandler_when_messageEventFires(): Promise<void>
    {
        // arrange
        // - dependencies
        const messageHandler = Substitute.for<SlackMessageHandler>();
        // - test data
        const event = this.createMessageEvent({ });
        // - unit under test
        const uut = new SlackEventHandler(messageHandler);

        // act
        await uut.handleEvent(event);

        // assert
        messageHandler.received().handleMessage(event.event as ISlackEventMessagePosted);
    }

    @test()
    public async should_notThrow_when_otherEventFires(): Promise<void>
    {
        // arrange
        // - dependencies
        const messageHandler = Substitute.for<SlackMessageHandler>();
        // - test data
        const event = this.createEvent('user_florped');
        // - unit under test
        const uut = new SlackEventHandler(messageHandler);

        // act
        await uut.handleEvent(event);
    }

    private createMessageEvent(messageParts: Partial<ISlackEventMessagePosted>): ISlackEventWrapper
    {
        const event = this.createEvent(SlackEventType.EventWrapper) as ISlackEventWrapper;

        const innerEvent = this.createEvent(SlackEventType.MessagePosted) as ISlackEventMessagePosted;
        Object.assign(innerEvent, messageParts);

        event.event = innerEvent;

        return event;
    }

    private createEvent(type: string): ISlackEvent
    {
        return { type: type as SlackEventType };
    }
}
