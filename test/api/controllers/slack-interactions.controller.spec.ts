import { HttpRequest } from '@azure/functions';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { Response } from 'express';
import { fake } from 'sinon';

import { SlackApiService, SlackInteractionHandlerService } from '../../../src/api/services/slack';

import { SlackInteractionsController } from '../../../src/api/controllers';

@suite
class SlackInteractionsControllerSpec
{
    @test
    public async should_respondUnauthorized_when_slackRequestUnverified(): Promise<void>
    {
        // arrange
        const slackApi = Substitute.for<SlackApiService>();
        const handler = Substitute.for<SlackInteractionHandlerService>();
        const controller = new SlackInteractionsController(slackApi, handler);

        slackApi.verifySlackRequest(Arg.any())
                .returns(Promise.resolve(false));

        const request: HttpRequest = {
            method: 'POST',
            url: 'test',
            headers: { },
            query: { },
            params: { }
        };

        const response = Substitute.for<Response>();

        // act
        await controller.handleInteraction(request, response);

        // assert
        response.received().sendStatus(401);
    }

    @test
    public async should_callInteractionHandler_when_requestVerified(): Promise<void>
    {
        // arrange
        const handler = Substitute.for<SlackInteractionHandlerService>();
        const slackApi = Substitute.for<SlackApiService>();
        const controller = new SlackInteractionsController(slackApi, handler);

        slackApi.verifySlackRequest(Arg.any())
                .returns(Promise.resolve(true));

        const request: HttpRequest = {
            method: 'POST',
            url: 'test',
            body: 'payload={}',
            headers: { },
            query: { },
            params: { }
        };

        const respond = Substitute.for<Response>();

        // act
        await controller.handleInteraction(request, respond);

        // assert
        handler.received().handleInteraction(Arg.any());
    }

    @test
    public async should_parsePayload_when_requestVerified(): Promise<void>
    {
        // arrange
        const handler = Substitute.for<SlackInteractionHandlerService>();
        const handleInteractionFake = fake((a: any) => { });
        handler.handleInteraction(Arg.any()).mimicks(handleInteractionFake);

        const slackApi = Substitute.for<SlackApiService>();
        slackApi.verifySlackRequest(Arg.any())
                .returns(Promise.resolve(true));

        const controller = new SlackInteractionsController(slackApi, handler);

        const testPayload = { foo: 'bar' };
        const request: HttpRequest = {
            method: 'POST',
            url: 'test',
            body: 'payload=' + JSON.stringify(testPayload),
            headers: { },
            query: { },
            params: { }
        };

        const respond = Substitute.for<Response>();

        // act
        await controller.handleInteraction(request, respond);

        // assert
        const payloadWasParsed = handleInteractionFake.calledWithMatch(testPayload);
        expect(payloadWasParsed, 'payload was parsed').to.be.true;
    }
}
