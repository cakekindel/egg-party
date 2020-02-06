import Substitute from '@fluffy-spoon/substitute';
import { Request, Response } from 'express';
import { SlackOauthController } from '../../../src/api/controllers/slack';
import { sendRedirectResponse } from '../../../src/api/functions/response';
import { SlackTeamProvider } from '../../../src/business/providers';
import { SlackOauthService } from '../../../src/api/services/slack/slack-oauth.service';
import { SlackOauthAccessResponse } from '../../../src/shared/models/slack/api/oauth';
import { ISpec, UnitTestSetup } from '../../test-utilities';
import { TestClass, TestMethod } from '../../test-utilities/directives';
import sinon = require('sinon');

@TestClass()
export class SlackOauthControllerSpec implements ISpec<SlackOauthController> {
    private testData = {
        installCode: 'foo',
        mockAuthResponse: {
            team: {
                id: 'robot team',
            },
            accessToken: '🔑',
            botUserId: '🤖',
        } as SlackOauthAccessResponse,
    };

    @TestMethod()
    public async should_authenticateAndCreateTeam_when_installed(): Promise<
        void
    > {
        // arrange
        const test = this.getUnitTestSetup();

        const request = ({
            query: { code: this.testData.installCode },
        } as unknown) as Request;

        // act
        await test.unitUnderTest.redirect(request, Substitute.for<Response>());

        // assert
        test.dependencies
            .get(SlackOauthService)
            .received()
            .authenticate(this.testData.installCode);

        test.dependencies
            .get(SlackTeamProvider)
            .received()
            .create(
                this.testData.mockAuthResponse.team.id,
                this.testData.mockAuthResponse.accessToken,
                this.testData.mockAuthResponse.botUserId
            );
    }

    @TestMethod()
    public async should_redirectToAppInSlack_when_installed(): Promise<void> {
        // arrange
        const test = this.getUnitTestSetup();

        const redirectSpy = sinon.spy(sendRedirectResponse);

        const response = Substitute.for<Response>();
        const request = ({
            query: { code: this.testData.installCode },
        } as unknown) as Request;

        // act
        await test.unitUnderTest.redirect(request, response);

        // assert
        redirectSpy.calledWith(
            response,
            `https://slack.com/app_redirect?app=${this.testData.mockAuthResponse.appId}`
        );
    }

    public getUnitTestSetup(): UnitTestSetup<SlackOauthController> {
        const test = new UnitTestSetup(SlackOauthController);

        test.dependencies
            .get(SlackOauthService)
            .authenticate(this.testData.installCode)
            .returns(Promise.resolve(this.testData.mockAuthResponse));

        return test;
    }
}
