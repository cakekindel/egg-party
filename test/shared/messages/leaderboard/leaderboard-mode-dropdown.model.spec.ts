import { expect } from 'chai';
import { SlackInteractionId, TimePeriod } from '../../../../src/shared/enums';
import { TestClass, TestMethod } from '../../../test-utilities/directives';
import { LeaderboardDropdown } from '../../../../src/shared/models/messages/leaderboard/interaction';
import { LeaderboardMode } from '../../../../src/shared/models/messages/leaderboard';

@TestClass()
export class LeaderboardDropdownSpec {
    @TestMethod()
    public async should_createBlocks(): Promise<void> {
        // arrange
        const test = new LeaderboardDropdown(
            LeaderboardMode.Givers,
            TimePeriod.AllTime
        );

        const modes = [LeaderboardMode.Givers, LeaderboardMode.Receivers];
        const periods = [
            TimePeriod.Today,
            TimePeriod.Week,
            TimePeriod.Month,
            TimePeriod.AllTime,
        ];

        // act

        // assert
        expect(test.action_id).to.equal(
            SlackInteractionId.LeaderboardModeChange
        );

        expect(test.option_groups.map(g => g.label.text)).to.deep.equal(
            modes.map(m => `Top ${m}`)
        );

        expect(
            test.option_groups.map(g => g.options.map(o => o.text.text))
        ).to.deep.equal(modes.map(m => periods.map(p => `Top ${m} - ${p}`)));
    }
}
