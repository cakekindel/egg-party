import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { Request, Response } from 'express';
import { fake } from 'sinon';
import { SlackInteractionsController } from '../../../src/api/controllers/slack';
import { SlackApiService } from '../../../src/api/services/slack';
import { SlackInteractionHandler } from '../../../src/api/services/slack/handlers';
import { TestClass, TestMethod } from '../../test-utilities/directives';

@TestClass()
export class SlackInteractionsControllerSpec {
    @TestMethod()
    public async should_respondUnauthorized_when_slackRequestUnverified(): Promise<
        void
    > {
        // arrange
        // - dependencies
        const slackApi = Substitute.for<SlackApiService>();
        const handler = Substitute.for<SlackInteractionHandler>();

        // - test data
        slackApi.verifySlackRequest(Arg.any()).returns(false);

        const request = Substitute.for<Request>();
        const response = Substitute.for<Response>();

        // - unit under test
        const uut = new SlackInteractionsController(slackApi, handler);

        // act
        await uut.handleInteraction(request, response);

        // assert
        response.received().sendStatus(401);
    }

    @TestMethod()
    public async should_callInteractionHandler_when_requestVerified(): Promise<
        void
    > {
        // arrange
        // - dependencies
        const handler = Substitute.for<SlackInteractionHandler>();
        const slackApi = Substitute.for<SlackApiService>();

        // - test data
        slackApi.verifySlackRequest(Arg.any()).returns(true);

        const request = { body: 'payload={}' } as Request;
        const respond = Substitute.for<Response>();

        // - unit under test
        const uut = new SlackInteractionsController(slackApi, handler);

        // act
        await uut.handleInteraction(request, respond);

        // assert
        handler.received().handleInteraction(Arg.any());
    }

    @TestMethod()
    public async should_parsePayload_when_requestVerified(): Promise<void> {
        // arrange
        // - dependencies
        const handler = Substitute.for<SlackInteractionHandler>();
        const slackApi = Substitute.for<SlackApiService>();

        // - test data
        const handleInteractionFake = fake(() => {});
        handler.handleInteraction(Arg.any()).mimicks(handleInteractionFake);

        slackApi.verifySlackRequest(Arg.any()).returns(true);

        const testPayload = { foo: 'bar' };

        const request = {
            body: 'payload=' + JSON.stringify(testPayload),
        } as Request;
        const respond = Substitute.for<Response>();

        // - unit under test
        const uut = new SlackInteractionsController(slackApi, handler);

        // act
        await uut.handleInteraction(request, respond);

        // assert
        const payloadWasParsed = handleInteractionFake.calledWithMatch(
            testPayload
        );
        expect(payloadWasParsed, 'payload was parsed').to.be.true;
    }
}
