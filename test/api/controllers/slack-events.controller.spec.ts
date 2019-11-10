import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { suite, test } from 'mocha-typescript';

import { Request, Response, Send } from 'express';
import { fake } from 'sinon';
import { SlackEventsController } from '../../../src/api/controllers/index';
import { SlackApiService, SlackEventHandlerService } from '../../../src/api/services/slack/index';

@suite
class SlackEventsControllerSpec
{
    @test
    public async should_respondUnauthorized_when_slackRequestUnverified(): Promise<void>
    {
        // arrange
        const handler = Substitute.for<SlackEventHandlerService>();
        const slackApi = Substitute.for<SlackApiService>();
        const controller = new SlackEventsController(slackApi, handler);

        slackApi.verifySlackRequest(Arg.any())
                .returns(false);

        const request = Substitute.for<Request>();
        const respond = Substitute.for<Response>();

        // act
        await controller.receiveEvent(request, respond);

        // assert
        respond.received().sendStatus(401);
    }

    @test
    public async should_callEventHandler_when_requestVerified(): Promise<void>
    {
        // arrange
        const handler = Substitute.for<SlackEventHandlerService>();
        const slackApi = Substitute.for<SlackApiService>();
        const controller = new SlackEventsController(slackApi, handler);

        slackApi.verifySlackRequest(Arg.any())
                .returns(true);

        const testResponse = 'challenge';
        handler.handleEvent(Arg.any())
               .returns(Promise.resolve(testResponse));

        const request = Substitute.for<Request>();

        const respond = Substitute.for<Response>();
        const sendResponseFake = fake(() => {});
        respond.send().mimicks(sendResponseFake);

        // act
        const response = await controller.receiveEvent(request, respond);

        // assert
        sendResponseFake.calledWith(testResponse);
    }
}
