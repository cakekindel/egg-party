import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { HttpRequest } from '@azure/functions';
import { Response } from 'express';
import { SlackEventsController } from '../../../api/controllers';
import { SlackApiService, SlackEventHandlerService } from '../../../api/services/slack';

@suite
class SpecSlackEventsController
{
    @test
    public async should_respondUnauthorized_when_slackRequestUnverified(): Promise<void>
    {
        // arrange
        const handler = Substitute.for<SlackEventHandlerService>();
        const slackApi = Substitute.for<SlackApiService>();
        const controller = new SlackEventsController(handler, slackApi);

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
        await controller.receiveEvent(request, response);

        // assert
        response.received().sendStatus(401);
    }
}
