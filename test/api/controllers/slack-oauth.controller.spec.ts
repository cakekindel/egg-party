import { Request, Response } from 'express';
import { SlackOauthController } from '../../../src/api/controllers/slack';
import { SlackOauthService } from '../../../src/api/services/slack';
import { ConfigService } from '../../../src/shared/utility';
import { ISpec, UnitTestSetup } from '../../test-utilities';
import { TestClass, TestMethod } from '../../test-utilities/directives';
import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';

@TestClass()
export class SlackOauthControllerSpec implements ISpec<SlackOauthController> {
    @TestMethod()
    public async should_authorizeWithCodeFromUrl_when_userRedirected(): Promise<
        void
    > {
        // arrange
        const code = 'foo';
        const clientId = 'meep';
        const clientSecret = 'shhh';

        const test = this.getUnitTestSetup();

        test.dependencies
            .get(ConfigService)
            .slackClientId()
            .returns(clientId);

        test.dependencies
            .get(ConfigService)
            .slackClientSecret()
            .returns(clientSecret);

        const request = ({ query: { code } } as unknown) as Request;

        // act
        test.unitUnderTest.redirect(request, undefined);

        // assert
        test.dependencies
            .get(SlackOauthService)
            .received()
            .handleInstallation(code);
    }

    @TestMethod()
    public async should_redirectToSlackOauthInstall_when_installRequest(): Promise<
        void
    > {
        // arrange
        const clientId = 'meep';

        const test = this.getUnitTestSetup();

        test.dependencies
            .get(ConfigService)
            .slackClientId()
            .returns(clientId);

        const respond = Substitute.for<Response>();

        // act
        test.unitUnderTest.install(respond);

        // assert
        respond.received().sendStatus(301);
        respond.received().header(
            'Location',
            Arg.is((url: string) => {
                expect(url).to.include('https://slack.com/oauth/v2/authorize');
                return true;
            })
        );
    }

    public getUnitTestSetup(): UnitTestSetup<SlackOauthController> {
        return new UnitTestSetup(SlackOauthController);
    }
}
