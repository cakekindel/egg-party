import { expect } from 'chai';
import { TimePeriod } from '../../../../src/shared/enums';
import {
    LeaderboardMode,
    LeaderboardSlackMessage,
} from '../../../../src/shared/models/messages/leaderboard';
import { LeaderboardData } from '../../../../src/shared/models/messages/leaderboard/data';
import { LeaderboardDropdown } from '../../../../src/shared/models/messages/leaderboard/interaction';
import { SlackEmoji } from '../../../../src/shared/models/slack';
import { SlackMarkdown } from '../../../../src/shared/models/slack/messages/blocks/composition/text/slack-markdown.model';
import { ISlackMessageLayoutBlock } from '../../../../src/shared/models/slack/messages/blocks/layout';
import { SlackMessageDividerBlock } from '../../../../src/shared/models/slack/messages/blocks/layout/divider';
import { SlackMessageSectionBlock } from '../../../../src/shared/models/slack/messages/blocks/layout/section';
import { TestCase, TestClass } from '../../../test-utilities/directives';

const mode = LeaderboardMode.Givers;
const period = TimePeriod.AllTime;

function getMessageStart(): ISlackMessageLayoutBlock[] {
    return [
        new SlackMessageDividerBlock(),
        new SlackMessageSectionBlock(
            new SlackMarkdown(`*:${SlackEmoji.Trophy}:   Leaderboard*`),
            undefined,
            new LeaderboardDropdown(mode, period)
        ),
        new SlackMessageDividerBlock(),
        new SlackMessageSectionBlock(undefined, [
            new SlackMarkdown(`*Person*`),
            new SlackMarkdown(`*Number of Eggs*`),
        ]),
    ];
}

@TestClass()
export class LeaderboardSlackMessageSpec {
    @TestCase(
        {
            data: {
                users: [
                    { place: 1, score: 10, userId: 'A' },
                    { place: 2, score: 7, userId: 'B' },
                ],
                ...({} as any),
            } as LeaderboardData,
            expectedBlocks: [
                ...getMessageStart(),
                new SlackMessageSectionBlock(undefined, [
                    new SlackMarkdown(`*1.* <@A>`),
                    new SlackMarkdown(`10 :egg:`),
                ]),
                new SlackMessageSectionBlock(undefined, [
                    new SlackMarkdown(`*2.* <@B>`),
                    new SlackMarkdown(`7 :egg:`),
                ]),
            ],
        },
        'for 2 users'
    )
    @TestCase(
        {
            data: {
                users: [{ place: 1, score: 10, userId: 'A' }],
                self: { place: 2, score: 7, userId: 'B' },
                ...({} as any),
            } as LeaderboardData,
            expectedBlocks: [
                ...getMessageStart(),
                new SlackMessageSectionBlock(undefined, [
                    new SlackMarkdown(`*1.* <@A>`),
                    new SlackMarkdown(`10 :egg:`),
                ]),
                new SlackMessageSectionBlock(undefined, [
                    new SlackMarkdown('—'),
                    new SlackMarkdown('—'),
                ]),
                new SlackMessageSectionBlock(undefined, [
                    new SlackMarkdown(`*2.* <@B>`),
                    new SlackMarkdown(`7 :egg:`),
                ]),
            ],
        },
        'for 1 user and self'
    )
    public async should_createBlocks(testCase: {
        data: LeaderboardData;
        expectedBlocks: ISlackMessageLayoutBlock[];
    }): Promise<void> {
        // arrange
        testCase.data = Object.assign(testCase.data, {
            mode,
            period,
        });

        // act
        const message = new LeaderboardSlackMessage(testCase.data);

        // assert
        expect(message.blocks).to.deep.equal(testCase.expectedBlocks);
    }
}
