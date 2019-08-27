import { Substitute } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import * as Sinon from 'sinon';
import axios, { AxiosRequestConfig } from 'axios';

import { HttpRequest } from '@azure/functions';
import { createHmac } from 'crypto';
import { SlackApiService } from '../../../../src/api/services/slack';
import { ConfigService } from '../../../../src/shared/utility';

@suite()
class SlackApiServiceSpec
{
    public axiosRequestStub: Sinon.SinonStub<[AxiosRequestConfig], Promise<unknown>>;

    public before(): void // beforeEach
    {
        this.axiosRequestStub = Sinon.stub(axios, 'request');
    }

    public after(): void // afterEach
    {
        this.axiosRequestStub.restore();
    }

    @test
    public async should_acceptAuthenticRequests_when_verifySlackRequestInvoked(): Promise<void>
    {
        // arrange
        const config = Substitute.for<ConfigService>();
        const signingSecret = 'test-secret';
        config.slackSigningSecret.returns(signingSecret);

        const timestamp = '123456';
        const rawBody = 'test=1234&token=foobar';

        const expectedHash = createHmac('sha256', signingSecret).update(`v0:${timestamp}:${rawBody}`);
        const expectedSignature = 'v0=' + expectedHash.digest('hex');

        const headers = {
            'x-slack-signature': expectedSignature,
            'x-slack-request-timestamp': timestamp,
        };

        const request: HttpRequest = {
            headers,
            rawBody,
            body: {},
            method: 'POST',
            params: {},
            query: {},
            url: ''
        }

        const api = new SlackApiService(config);
        
        // act
        const verified = await api.verifySlackRequest(request);

        // assert
        expect(verified).to.be.true;
    }

    @test
    public async should_rejectNonAuthenticRequests_when_verifySlackRequestInvoked(): Promise<void>
    {
        // arrange
        const config = Substitute.for<ConfigService>();

        const goodSecret = 'i-am-a-good-boy';
        config.slackSigningSecret.returns(goodSecret);

        const timestamp = '123456';
        const rawBody = 'test=1234&token=foobar';

        const badSecret = 'i-am-a-malicious-request';
        const badHash = createHmac('sha256', badSecret).update(`v0:${timestamp}:${rawBody}`);
        const badSignature = 'v0=' + badHash.digest('hex');

        const headers = {
            'x-slack-signature': badSignature,
            'x-slack-request-timestamp': timestamp,
        };

        const request: HttpRequest = {
            headers,
            rawBody,
            body: {},
            method: 'POST',
            params: {},
            query: {},
            url: ''
        }

        const api = new SlackApiService(config);
        
        // act
        const verified = await api.verifySlackRequest(request);

        // assert
        expect(verified).to.be.false;
    }

    @test
    public async should_throwError_when_getAllPublicChannelsReceivesBadResponse(): Promise<void>
    {
        // arrange
        const errorMessage = 'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({ data: { ok: false, error: errorMessage } });
        this.axiosRequestStub.returns(notOkResponse);

        const api = new SlackApiService({ slackApiToken: 'foo' } as unknown as ConfigService);

        // act
        try
        {
            await api.getAllPublicChannels();
            expect.fail(null, null, 'getAllPublicChannels should throw if not OK.');
        }
        catch (e)
        {
            // assert
            expect(e.message).to.equal(errorMessage);
        }
    }

    @test
    public async should_throwError_when_getChannelInfoReceivesBadResponse(): Promise<void>
    {
        // arrange
        const errorMessage = 'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({ data: { ok: false, error: errorMessage } });
        this.axiosRequestStub.returns(notOkResponse);

        const api = new SlackApiService({ slackApiToken: 'foo' } as unknown as ConfigService);

        // act
        try
        {
            await api.getChannelInfo('12345');
            expect.fail(null, null, 'getChannelInfo should throw if not OK.');
        }
        catch (e)
        {
            // assert
            expect(e.message).to.equal(errorMessage);
        }
    }

    @test
    public async should_throwError_when_getBotUserIdReceivesBadResponse(): Promise<void>
    {
        // arrange
        const errorMessage = 'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({ data: { ok: false, error: errorMessage } });
        this.axiosRequestStub.returns(notOkResponse);

        const api = new SlackApiService({ slackApiToken: 'foo' } as unknown as ConfigService);

        // act
        try
        {
            await api.getBotUserId();
            expect.fail(null, null, 'getBotUserId should throw if not OK.');
        }
        catch (e)
        {
            // assert
            expect(e.message).to.equal(errorMessage);
        }
    }

    @test
    public async should_throwError_when_sendHookMessageReceivesBadResponse(): Promise<void>
    {
        // arrange
        const errorMessage = 'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({ data: { ok: false, error: errorMessage } });
        this.axiosRequestStub.returns(notOkResponse);

        const api = new SlackApiService({ slackApiToken: 'foo' } as unknown as ConfigService);

        // act
        try
        {
            await api.sendHookMessage('hookUrl', { blocks: [], text: 'foo' });
            expect.fail(null, null, 'sendHookMessage should throw if not OK.');
        }
        catch (e)
        {
            // assert
            expect(e.message).to.equal(errorMessage);
        }
    }

    @test
    public async should_throwError_when_sendMessageReceivesBadResponse(): Promise<void>
    {
        // arrange
        const errorMessage = 'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({ data: { ok: false, error: errorMessage } });
        this.axiosRequestStub.returns(notOkResponse);

        const api = new SlackApiService({ slackApiToken: 'foo' } as unknown as ConfigService);

        // act
        try
        {
            await api.sendMessage('channelId', { blocks: [], text: 'foo' });
            expect.fail(null, null, 'sendMessage should throw if not OK.');
        }
        catch (e)
        {
            // assert
            expect(e.message).to.equal(errorMessage);
        }
    }

    @test
    public async should_throwError_when_sendDirectMessageReceivesBadResponse(): Promise<void>
    {
        // arrange
        const errorMessage = 'this is a helpful error from the slack api and definitely not a unit test';
        const notOkResponse = Promise.resolve({ data: { ok: false, error: errorMessage } });
        this.axiosRequestStub.returns(notOkResponse);

        const api = new SlackApiService({ slackApiToken: 'foo' } as unknown as ConfigService);

        // act
        try
        {
            await api.sendDirectMessage('userId', { blocks: [], text: 'foo' });
            expect.fail(null, null, 'sendDirectMessage should throw if not OK.');
        }
        catch (e)
        {
            // assert
            expect(e.message).to.equal(errorMessage);
        }
    }
}
