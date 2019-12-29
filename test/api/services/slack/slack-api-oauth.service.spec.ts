import { TestClass, TestMethod } from '../../../test-utilities/directives';
import { ISpec, UnitTestSetup } from '../../../test-utilities';
import { SlackApiOauthService } from '../../../../src/api/services/slack';
import sinon = require('sinon');
import Axios, { AxiosRequestConfig } from 'axios';
import { expect, use } from 'chai';
import chaiPromises = require('chai-as-promised');

use(chaiPromises);

@TestClass()
export class SlackApiOauthServiceSpec implements ISpec<SlackApiOauthService> {
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
    public async should_deserializeOauthV2Response(): Promise<void> {
        // arrange
        const test = this.getUnitTestSetup();

        const response = {
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
        };

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

        this.axiosStub.returns(Promise.resolve({ data: response }));

        // act
        const actual = await test.unitUnderTest.access(
            'code',
            'client id',
            'client secret'
        );

        // assert
        expect(actual).to.deep.equal(expected);
    }

    @TestMethod()
    public async should_throw_when_OauthV2ResponseNotOk(): Promise<void> {
        // arrange
        const test = this.getUnitTestSetup();

        const response = {
            ok: false,
        };

        this.axiosStub.returns(Promise.resolve({ data: response }));

        // act
        const accessClosure = async () =>
            await test.unitUnderTest.access('', '', '');

        // assert
        expect(accessClosure()).to.be.rejected;
    }

    public getUnitTestSetup(): UnitTestSetup<SlackApiOauthService> {
        return new UnitTestSetup(SlackApiOauthService);
    }
}
