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
        // - dependencies
        const slackApi = Substitute.for<SlackApiService>();
        const handler = Substitute.for<SlackInteractionHandlerService>();
        const response = Substitute.for<Response>();

        // - test data
        slackApi.verifySlackRequest(Arg.any()).returns(Promise.resolve(false));

        const request: HttpRequest = {
            method: 'POST',
            url: 'test',
            headers: { },
            query: { },
            params: { }
        };

        // - unit under test
        const uut = new SlackInteractionsController(slackApi, handler);

        // act
        await uut.handleInteraction(request, response);

        // assert
        response.received().sendStatus(401);
    }

    @test
    public async should_callInteractionHandler_when_requestVerified(): Promise<void>
    {
        // arrange
        // - dependencies
        const handler = Substitute.for<SlackInteractionHandlerService>();
        const slackApi = Substitute.for<SlackApiService>();
        const respond = Substitute.for<Response>();

        // - test data
        slackApi.verifySlackRequest(Arg.any()).returns(Promise.resolve(true));

        const request: HttpRequest = {
            method: 'POST',
            url: 'test',
            body: 'payload={}',
            headers: { },
            query: { },
            params: { }
        };

        // - unit under test
        const uut = new SlackInteractionsController(slackApi, handler);

        // act
        await uut.handleInteraction(request, respond);

        // assert
        handler.received().handleInteraction(Arg.any());
    }

    @test
    public async should_parsePayload_when_requestVerified(): Promise<void>
    {
        // arrange
        // - dependencies
        const handler = Substitute.for<SlackInteractionHandlerService>();
        const slackApi = Substitute.for<SlackApiService>();
        const respond = Substitute.for<Response>();

        // - test data
        const handleInteractionFake = fake((a: any) => { });
        handler.handleInteraction(Arg.any()).mimicks(handleInteractionFake);

        slackApi.verifySlackRequest(Arg.any()).returns(Promise.resolve(true));

        const testPayload = { foo: 'bar' };
        const request: HttpRequest = {
            method: 'POST',
            url: 'test',
            body: 'payload=' + JSON.stringify(testPayload),
            headers: { },
            query: { },
            params: { }
        };

        // - unit under test
        const uut = new SlackInteractionsController(slackApi, handler);

        // act
        await uut.handleInteraction(request, respond);

        // assert
        const payloadWasParsed = handleInteractionFake.calledWithMatch(testPayload);
        expect(payloadWasParsed, 'payload was parsed').to.be.true;
    }
}
