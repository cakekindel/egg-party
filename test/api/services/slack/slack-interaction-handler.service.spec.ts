import { expect } from 'chai';
import { Substitute, Arg } from '@fluffy-spoon/substitute';

import { SlackGuideBookService, SlackApiService, SlackInteractionHandlerService } from '../../../../src/api/services/slack';
import { GuideBookPageId } from '../../../../src/shared/models/guide-book';
import { ISlackInteractionPayload } from '../../../../src/shared/models/slack/interactions/slack-interaction-payload.model';
import { SlackInteractionId } from '../../../../src/shared/enums';
import { SlackBlockMessage } from '../../../../src/shared/models/slack/messages';

@suite
class SlackInteractionHandlerServiceSpec
{
    @test
    public async should_sendGuideBookPage_when_jumpedTo(): Promise<void>
    {
        // arrange
        const guideBook = Substitute.for<SlackGuideBookService>();
        const testPage = new SlackBlockMessage([], 'test');
        guideBook.build(Arg.all()).returns(testPage);
        
        const api = Substitute.for<SlackApiService>();
        const botId = 'Z789';
        api.getBotUserId().returns(Promise.resolve(botId));
        api.sendHookMessage(Arg.any(), Arg.any()).returns(Promise.resolve());

        const uut = new SlackInteractionHandlerService(api, null, null, null, guideBook);

        const userId = 'U1234';
        const goToPage = GuideBookPageId.LearnAboutChicks;
        const responseHookUrl = 'respond_here';
        const interaction: ISlackInteractionPayload = {
            type: 'block_actions',
            api_app_id: '12345',
            response_url: responseHookUrl,
            team: {
                domain: 'test',
                id: 'test',
            },
            token: '1234',
            user: {
                id: userId,
                team_id: 'test',
                username: 'sally_user',
            },
            actions: [
                {
                    block_id: '1234',
                    action_id: SlackInteractionId.GuideBookJumpToPage,
                    type: 'static_select',
                    selected_option: {
                        value: goToPage
                    }
                }
            ]
        };

        // act
        await uut.handleInteraction(interaction);

        // assert
        guideBook.received().build(userId, botId, goToPage);
        api.received().sendHookMessage(responseHookUrl, testPage);
    }
}
