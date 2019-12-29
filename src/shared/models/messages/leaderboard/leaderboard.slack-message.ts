import { JsonConfigurable, JsonIgnore } from '../../../decorators/json';
import { PureFunc } from '../../../types/delegates/func';
import { Immutable } from '../../../types/immutable';
import { SlackEmoji } from '../../slack';
import { SlackBlockMessage } from '../../slack/messages';
import { SlackMarkdown } from '../../slack/messages/blocks/composition/text/slack-markdown.model';
import { SlackMessageDividerBlock } from '../../slack/messages/blocks/layout/divider';
import { SlackMessageSectionBlock } from '../../slack/messages/blocks/layout/section';
import { ILeaderboardEntry } from './data';
import { LeaderboardData } from './data/leaderboard-data.model';
import { LeaderboardDropdown } from './interaction';
import _ = require('lodash');

@JsonConfigurable()
export class LeaderboardSlackMessage extends SlackBlockMessage {
    @JsonIgnore()
    public readonly data: Immutable<LeaderboardData>;

    constructor(data: Immutable<LeaderboardData>) {
        const mapLeaderboardEntryToSection: PureFunc<
            ILeaderboardEntry,
            SlackMessageSectionBlock
        > = u => {
            return new SlackMessageSectionBlock(undefined, [
                new SlackMarkdown(`*${u.place}.* <@${u.userId}>`),
                new SlackMarkdown(`${u.score} :egg:`),
            ]);
        };

        const userRows = data.users.map(mapLeaderboardEntryToSection);

        super([
            new SlackMessageDividerBlock(),
            new SlackMessageSectionBlock(
                new SlackMarkdown(`*:${SlackEmoji.Trophy}:   Leaderboard*`),
                undefined,
                new LeaderboardDropdown(data.mode, data.period)
            ),
            new SlackMessageDividerBlock(),
            new SlackMessageSectionBlock(undefined, [
                new SlackMarkdown(`*Person*`),
                new SlackMarkdown(`*Number of Eggs*`),
            ]),
            ...userRows,
        ]);

        this.data = data;

        const showSelfSeparately = !data.users.some(
            u => u.userId === data.self?.userId
        );

        if (data.self && showSelfSeparately) {
            this.blocks.push(
                new SlackMessageSectionBlock(undefined, [
                    new SlackMarkdown('—'),
                    new SlackMarkdown('—'),
                ])
            );

            this.blocks.push(mapLeaderboardEntryToSection(data.self));
        }
    }
}
