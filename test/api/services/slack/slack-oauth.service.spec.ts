import { TestClass, TestMethod } from '../../../test-utilities/directives';
import { ISpec, UnitTestSetup } from '../../../test-utilities';
import { SlackOauthService } from '../../../../src/api/services/slack';
import sinon = require('sinon');
import Axios, { AxiosRequestConfig } from 'axios';
import { expect, use } from 'chai';
import chaiPromises = require('chai-as-promised');
import { SlackOauthAccessRequest } from '../../../../src/shared/models/slack/api/oauth';
import { ConfigService } from '../../../../src/shared/utility';
import { SlackTeamProvider } from '../../../../src/api/services/providers';

use(chaiPromises);

@TestClass()
export class SlackOauthServiceSpec implements ISpec<SlackOauthService> {
    private testData = {
        oauthCode: 'foo',
        clientId: '123',
        clientSecret: 'shhh',
        accessResponse: {
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
    public async handleInstallation_should_getAccess(): Promise<void> {
        // arrange
        const expectedRequest = new SlackOauthAccessRequest(
            this.testData.oauthCode,
            this.testData.clientId,
            this.testData.clientSecret
        );

        const test = this.getUnitTestSetup();
        test.dependencies
            .get(ConfigService)
            .slackClientId()
            .returns(this.testData.clientId);
        test.dependencies
            .get(ConfigService)
            .slackClientSecret()
            .returns(this.testData.clientSecret);
        this.axiosStub.returns(
            Promise.resolve({ data: this.testData.accessResponse })
        );

        // act
        await test.unitUnderTest.handleInstallation('foo');

        // assert
        expect(this.axiosStub.calledOnce).to.be.true;
        const request = this.axiosStub.getCalls()[0]
            .args[0] as SlackOauthAccessRequest;
        expect(request).to.deep.equal(expectedRequest);
    }

    @TestMethod()
    public async handleInstallation_should_createSlackTeam(): Promise<void> {
        // arrange
        const test = this.getUnitTestSetup();
        this.axiosStub.returns(
            Promise.resolve({ data: this.testData.accessResponse })
        );

        // act
        await test.unitUnderTest.handleInstallation('foo');

        // assert
        test.dependencies
            .get(SlackTeamProvider)
            .received()
            .create(
                this.testData.accessResponse.team.id,
                this.testData.accessResponse.access_token,
                this.testData.accessResponse.bot_user_id
            );
    }

    @TestMethod()
    public async getOauthAccess_should_deserializeOauthV2Response(): Promise<
        void
    > {
        // arrange
        const test = this.getUnitTestSetup();

        const expected = {
            ok: true,
            accessToken: 'foo',
            tokenType: 'bot',
            scopes: ['user.list', 'reaction.add'],
            botUserId: 'B234',
            appId: 'A123',
            team: {
                id: 'T123',
                name: 'Rowdy Rangers',
            },
        };

        this.axiosStub.returns(
            Promise.resolve({ data: this.testData.accessResponse })
        );

        // act
        const actual = await test.unitUnderTest.getOauthAccess(
            'code',
            'client id',
            'client secret'
        );

        // assert
        expect(actual).to.deep.equal(expected);
    }

    @TestMethod()
    public async getOauthAccess_should_throw_when_OauthV2ResponseNotOk(): Promise<
        void
    > {
        // arrange
        const test = this.getUnitTestSetup();

        const response = {
            ok: false,
        };

        this.axiosStub.returns(Promise.resolve({ data: response }));

        // act
        const accessClosure = async () =>
            test.unitUnderTest.getOauthAccess('', '', '');

        // assert
        expect(accessClosure()).to.be.rejected;
    }

    public getUnitTestSetup(): UnitTestSetup<SlackOauthService> {
        return new UnitTestSetup(SlackOauthService);
    }
}
