import { SlackInteractionId } from '../../../../enums';
import { TimePeriod } from '../../../../enums/time-period.enum';
import { SlackMessageOptionComposition as Option } from '../../../slack/messages/blocks/composition/option/slack-message-option-composition.model';
import { SlackMessageOptionGroupComposition as OptionGroup } from '../../../slack/messages/blocks/composition/option/slack-message-option-group-composition.model';
import { SlackPlaintext } from '../../../slack/messages/blocks/composition/text/slack-plaintext.model';
import { SlackMessageStaticSelectElement } from '../../../slack/messages/blocks/element/select/static';
import { LeaderboardConstants } from '../leaderboard-constants';
import { LeaderboardMode } from '../leaderboard-mode.enum';
import { LeaderboardDropdownOption } from './leaderboard-dropdown-item.model';

export class LeaderboardDropdown extends SlackMessageStaticSelectElement {
    constructor(selectedMode: LeaderboardMode, selectedPeriod: TimePeriod) {
        super(
            SlackInteractionId.LeaderboardModeChange,
            new SlackPlaintext('Change Mode')
        );

        this.option_groups = this.createOptionGroups(
            selectedMode,
            selectedPeriod
        );
    }

    private createOptionGroups(
        selectedMode: LeaderboardMode,
        selectedPeriod: TimePeriod
    ): OptionGroup[] {
        return LeaderboardConstants.SupportedModes.map(mode =>
            this.createOptionGroup(mode, selectedMode, selectedPeriod)
        );
    }

    private createOptionGroup(
        mode: LeaderboardMode,
        selectedMode: LeaderboardMode,
        selectedPeriod: TimePeriod
    ): OptionGroup {
        return new OptionGroup(
            new SlackPlaintext(`Top ${mode}`),
            this.createOptions(mode, selectedMode, selectedPeriod)
        );
    }

    private createOptions(
        mode: LeaderboardMode,
        selectedMode: LeaderboardMode,
        selectedPeriod: TimePeriod
    ): Option[] {
        return LeaderboardConstants.SupportedPeriods.map(period => {
            const option = new LeaderboardDropdownOption(mode, period);

            if (mode === selectedMode && period === selectedPeriod) {
                this.initial_option = option;
            }

            return option;
        });
    }
}
