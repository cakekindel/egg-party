import { Request, Response } from 'express';
import { SlackOauthController } from '../../../src/api/controllers/slack';
import { SlackOauthService } from '../../../src/api/services/slack/slack-oauth.service';
import { ConfigService } from '../../../src/shared/utility';
import { ISpec, UnitTestSetup } from '../../test-utilities';
import { TestClass, TestMethod } from '../../test-utilities/directives';
import { SlackOauthAccessResponse } from '../../../src/shared/models/slack/api/oauth';
import { SlackTeamProvider } from '../../../src/api/services/providers';
import Substitute from '@fluffy-spoon/substitute';

@TestClass()
export class SlackOauthControllerSpec implements ISpec<SlackOauthController> {
    @TestMethod()
    public async should_authenticateAndCreateTeam_when_installed(): Promise<
        void
    > {
        // arrange
        const installCode = 'foo';
        const mockAuthResponse = {
            team: {
                id: 'robot team',
            },
            accessToken: '🔑',
            botUserId: '🤖',
        } as SlackOauthAccessResponse;

        const test = this.getUnitTestSetup();

        test.dependencies
            .get(SlackOauthService)
            .authenticate(installCode)
            .returns(Promise.resolve(mockAuthResponse));

        const request = ({
            query: { code: installCode },
        } as unknown) as Request;

        // act
        await test.unitUnderTest.redirect(request, Substitute.for<Response>());

        // assert
        test.dependencies
            .get(SlackOauthService)
            .received()
            .authenticate(installCode);

        test.dependencies
            .get(SlackTeamProvider)
            .received()
            .create(
                mockAuthResponse.team.id,
                mockAuthResponse.accessToken,
                mockAuthResponse.botUserId
            );
    }

    public getUnitTestSetup(): UnitTestSetup<SlackOauthController> {
        return new UnitTestSetup(SlackOauthController);
    }
}
