import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { HttpStatus } from '@nestjs/common';
import { Request, Response, Send } from 'express';
import { SlackEventsController } from '../../../src/api/controllers/slack';
import { SlackApiService } from '../../../src/api/services/slack';
import {
    ISlackEvent,
    ISlackEventChallenge,
    SlackEventType,
} from '../../../src/shared/models/slack/events';
import { ISpec, UnitTestSetup } from '../../test-utilities';
import { TestClass, TestMethod } from '../../test-utilities/directives';

@TestClass()
export class SlackEventsControllerSpec implements ISpec<SlackEventsController> {
    @TestMethod()
    public async should_respondUnauthorized_when_slackRequestUnverified(): Promise<
        void
    > {
        // arrange
        const testSetup = this.getUnitTestSetup();
        this.setupRequestAuthentic(testSetup, false);

        const respond = Substitute.for<Response>();

        // act
        await testSetup.unitUnderTest.receiveEvent(undefined, respond);

        // assert
        respond.received().sendStatus(HttpStatus.UNAUTHORIZED);
    }

    @TestMethod()
    public async should_respondWithChallenge_when_challengeEventReceived(): Promise<
        void
    > {
        // arrange
        const testSetup = this.getUnitTestSetup();
        this.setupRequestAuthentic(testSetup, true);

        const event: ISlackEventChallenge = {
            type: SlackEventType.Challenge,
            challenge: 'chall',
            token: '',
        };
        const request = this.createMockRequest(event);
        const response = Substitute.for<Response>();

        // act
        await testSetup.unitUnderTest.receiveEvent(request, response);

        // assert
        (response.received().send as Send)(request.body.challenge);
    }

    private createMockRequest(event: ISlackEvent): Request {
        return { body: event } as Request;
    }

    private setupRequestAuthentic(
        testSetup: UnitTestSetup<SlackEventsController>,
        authentic: boolean
    ): void {
        testSetup.dependencies
            .get(SlackApiService)
            .verifySlackRequest(Arg.any())
            .returns(authentic);
    }

    public getUnitTestSetup(): UnitTestSetup<SlackEventsController> {
        return new UnitTestSetup(SlackEventsController);
    }
}
