import { Substitute } from '@fluffy-spoon/substitute';
import axios, { AxiosRequestConfig } from 'axios';
import { expect } from 'chai';
import { createHmac } from 'crypto';
import * as Sinon from 'sinon';
import { SlackApiService } from '../../../../src/api/services/slack';
import { IRequestWithRawBody } from '../../../../src/shared/models/express/request-with-raw-body.model';
import { ConfigService } from '../../../../src/shared/utility';
import { TestClass, TestMethod } from '../../../test-utilities/directives';
import { ISpec, UnitTestSetup } from '../../../test-utilities';

@TestClass()
export class SlackApiServiceSpec implements ISpec<SlackApiService> {
    public axiosRequestStub: Sinon.SinonStub<
        [AxiosRequestConfig],
        Promise<unknown>
    >;

    public testData = {
        apiToken: '🔑',
    };

    public before(): void {
        // beforeEach
        this.axiosRequestStub = Sinon.stub(axios, 'request');
    }

    public after(): void {
        // afterEach
        this.axiosRequestStub.restore();
    }

    @TestMethod()
    public async should_acceptAuthenticRequests_when_verifySlackRequestInvoked(): Promise<
        void
    > {
        // arrange
        // - dependencies
        const config = Substitute.for<ConfigService>();

        // - test data
        const signingSecret = 'test-secret';
        config.slackSigningSecret.returns(signingSecret);

        const timestamp = '123456';
        const rawBody = 'test=1234&token=foobar';

        const expectedHash = createHmac('sha256', signingSecret).update(
            `v0:${timestamp}:${rawBody}`
        );
        const expectedSignature = 'v0=' + expectedHash.digest('hex');

        const headers = {
            'x-slack-signature': expectedSignature,
            'x-slack-request-timestamp': timestamp,
        };

        const request = Substitute.for<IRequestWithRawBody>();
        request.headers.returns(headers);
        request.rawBody.returns(rawBody);

        // - unit under test
        const uut = new SlackApiService(config);

        // act
        const verified = uut.verifySlackRequest(request);

        // assert
        expect(verified, 'request authentic').to.be.true;
    }

    @TestMethod()
    public async should_rejectNonAuthenticRequests_when_verifySlackRequestInvoked(): Promise<
        void
    > {
        // arrange
        // - dependencies
        const config = Substitute.for<ConfigService>();

        // - test data
        const badSecret = 'i-am-a-malicious-request';
        const goodSecret = 'i-am-a-good-boy';
        config.slackSigningSecret.returns(goodSecret);

        const timestamp = '123456';
        const rawBody = 'test=1234&token=foobar';

        const badHash = createHmac('sha256', badSecret).update(
            `v0:${timestamp}:${rawBody}`
        );
        const badSignature = 'v0=' + badHash.digest('hex');

        const headers = {
            'x-slack-signature': badSignature,
            'x-slack-request-timestamp': timestamp,
        };

        const request = Substitute.for<IRequestWithRawBody>();

        // - unit under test
        const uut = new SlackApiService(config);

        // act
        const verified = uut.verifySlackRequest(request);

        // assert
        expect(verified, 'request authentic').to.be.false;
    }

    @TestMethod()
    public async should_throwError_when_getAllPublicChannelsReceivesBadResponse(): Promise<
        void
    > {
        // arrange
        const errorMessage =
            'this is a helpful error from the slack api and definitely not a unit test';

        const notOkResponse = Promise.resolve({
            data: { ok: false, error: errorMessage },
        });

        this.axiosRequestStub.returns(notOkResponse);

        const test = this.getUnitTestSetup();

        // act
        let error: Error;

        try {
            await test.unitUnderTest.getAllPublicChannels(
                this.testData.apiToken
            );
        } catch (e) {
            error = e;
        }

        // assert
        expect(error).to.not.be.undefined;
        expect(error.message).to.equal(errorMessage);
    }

    @TestMethod()
    public async should_throwError_when_getChannelInfoReceivesBadResponse(): Promise<
        void
    > {
        // arrange
        // - test data
        const errorMessage =
            'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({
            data: { ok: false, error: errorMessage },
        });
        this.axiosRequestStub.returns(notOkResponse);

        // - unit under test
        const test = this.getUnitTestSetup();

        // act
        let error: Error;

        try {
            await test.unitUnderTest.getChannelInfo(
                this.testData.apiToken,
                '12345'
            );
        } catch (e) {
            error = e;
        }

        // assert
        expect(error).to.not.be.undefined;
        expect(error.message).to.equal(errorMessage);
    }

    @TestMethod()
    public async should_throwError_when_sendHookMessageReceivesBadResponse(): Promise<
        void
    > {
        // arrange
        // - test data
        const errorMessage =
            'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({
            data: { ok: false, error: errorMessage },
        });
        this.axiosRequestStub.returns(notOkResponse);

        // - unit under test
        const uut = new SlackApiService(({
            slackApiToken: 'foo',
        } as unknown) as ConfigService);

        // act
        let error: Error;

        try {
            await uut.sendHookMessage(this.testData.apiToken, 'hookUrl', {
                blocks: [],
                text: 'foo',
            });
        } catch (e) {
            error = e;
        }

        // assert
        expect(error).to.not.be.undefined;
        expect(error.message).to.equal(errorMessage);
    }

    @TestMethod()
    public async should_throwError_when_sendMessageReceivesBadResponse(): Promise<
        void
    > {
        // arrange
        // - test data
        const errorMessage =
            'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({
            data: { ok: false, error: errorMessage },
        });
        this.axiosRequestStub.returns(notOkResponse);

        // - unit under test
        const uut = new SlackApiService(({
            slackApiToken: 'foo',
        } as unknown) as ConfigService);

        // act
        let error: Error;

        try {
            await uut.sendMessage(this.testData.apiToken, 'channelId', {
                blocks: [],
                text: 'foo',
            });
        } catch (e) {
            error = e;
        }

        // assert
        expect(error).to.not.be.undefined;
        expect(error.message).to.equal(errorMessage);
    }

    @TestMethod()
    public async should_throwError_when_sendDirectMessageReceivesBadResponse(): Promise<
        void
    > {
        // arrange
        // - test data
        const errorMessage =
            'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({
            data: { ok: false, error: errorMessage },
        });
        this.axiosRequestStub.returns(notOkResponse);

        // - unit under test
        const uut = new SlackApiService(({
            slackApiToken: 'foo',
        } as unknown) as ConfigService);

        // act
        let error: Error;

        try {
            await uut.sendDirectMessage(this.testData.apiToken, 'userId', {
                blocks: [],
                text: 'foo',
            });
        } catch (e) {
            error = e;
        }

        // assert
        expect(error).to.not.be.undefined;
        expect(error.message).to.equal(errorMessage);
    }

    public getUnitTestSetup(): UnitTestSetup<SlackApiService> {
        return new UnitTestSetup(SlackApiService);
    }
}
