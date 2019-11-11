import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { suite, test } from 'mocha-typescript';

import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { fake } from 'sinon';
import { SlackEventsController } from '../../../src/api/controllers/slack';
import { SlackApiService } from '../../../src/api/services/slack';
import { SlackEventHandler } from '../../../src/api/services/slack/handlers';

@suite()
class SlackEventsControllerSpec
{
    @test()
    public async should_respondUnauthorized_when_slackRequestUnverified(): Promise<void>
    {
        // arrange
        const handler = Substitute.for<SlackEventHandler>();
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

    @test()
    public async should_respondWithChallenge_when_challengeEventReceived(): Promise<void>
    {
        // arrange
        const handler = Substitute.for<SlackEventHandler>();
        const slackApi = Substitute.for<SlackApiService>();
        const controller = new SlackEventsController(slackApi, handler);

        slackApi.verifySlackRequest(Arg.any())
                .returns(true);

        const challenge = 'challenge';

        const request = Substitute.for<Request>();
        const response = Substitute.for<Response>();

        const sendFake = fake(() => response);
        response.send().mimicks(sendFake);

        const statusFake = fake(() => response);
        response.status(Arg.any()).mimicks(statusFake);

        // act
        await controller.receiveEvent(request, response);

        // assert
        statusFake.calledWith(HttpStatus.OK);
        sendFake.calledWith(challenge);
    }
}
