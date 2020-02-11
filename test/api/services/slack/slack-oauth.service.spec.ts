import Axios, { AxiosRequestConfig } from 'axios';
import { expect, use } from 'chai';
import { SlackOauthService } from '../../../../src/api/services/slack';
import { SlackOauthAccessRequest } from '../../../../src/shared/models/slack/api/oauth';
import { ConfigService } from '../../../../src/shared/utility';
import { ISpec, UnitTestSetup } from '../../../test-utilities';
import { TestClass, TestMethod } from '../../../test-utilities/directives';
import sinon = require('sinon');
import chaiPromises = require('chai-as-promised');

use(chaiPromises);

@TestClass()
export class SlackOauthServiceSpec implements ISpec<SlackOauthService> {
    private testData = {
        oauthCode: 'foo',
        clientId: '123',
        clientSecret: 'shhh',
        authResponse: {
            ok: true,
            access_token: 'foo',
            token_type: 'bot',
            scope: 'user.list,reaction.add',
            bot_user_id: 'B234',
            app_id: 'A123',
            team: {
                id: 'T123',
                name: 'Rowdy Rangers',
            },
        },
    };

    private sandbox: sinon.SinonSandbox;
    private axiosStub: sinon.SinonStub<[AxiosRequestConfig], Promise<unknown>>;

    public before(): void {
        this.sandbox = sinon.createSandbox();
        this.axiosStub = this.sandbox.stub(Axios, 'request');
    }

    public after(): void {
        this.sandbox.restore();
    }

    @TestMethod()
    public async authenticate_should_sendSlackOauthAccessRequest(): Promise<
        void
    > {
        // arrange
        const test = this.getUnitTestSetup();
        const installCode = '🔑';
        const appClientId = '🤖';
        const appClientSecret = '🗝';

        const request = new SlackOauthAccessRequest(
            installCode,
            appClientId,
            appClientSecret
        );

        test.dependencies
            .get(ConfigService)
            .slackClientId()
            .returns(appClientId);

        test.dependencies
            .get(ConfigService)
            .slackClientSecret()
            .returns(appClientSecret);

        this.axiosStub.returns(
            Promise.resolve({ data: this.testData.authResponse })
        );

        // act
        await test.unitUnderTest.authenticate(installCode);

        // assert
        const actualRequest = this.axiosStub.getCalls()[0].args[0];
        expect(actualRequest).to.deep.equal(request);
    }

    @TestMethod()
    public async authenticate_should_throw_when_OauthV2ResponseNotOk(): Promise<
        void
    > {
        // arrange
        const test = this.getUnitTestSetup();

        const response = {
            ok: false,
        };

        this.axiosStub.returns(Promise.resolve({ data: response }));

        // act
        const accessClosure = async () => test.unitUnderTest.authenticate('');

        // assert
        expect(accessClosure()).to.be.rejected;
    }

    public getUnitTestSetup(): UnitTestSetup<SlackOauthService> {
        return new UnitTestSetup(SlackOauthService);
    }
}
