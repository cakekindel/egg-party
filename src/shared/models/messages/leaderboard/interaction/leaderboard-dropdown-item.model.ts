import { SlackMessageOptionComposition } from '../../../slack/messages/blocks/composition/option/slack-message-option-composition.model';
import { LeaderboardMode } from '../leaderboard-mode.enum';
import { TimePeriod } from '../../../../enums';
import { SlackPlaintext } from '../../../slack/messages/blocks/composition/text/slack-plaintext.model';
import { ILeaderboardInteractionPayload } from './leaderboard-interaction-payload.model';
import qs = require('qs');

export class LeaderboardDropdownOption extends SlackMessageOptionComposition {
    constructor(mode: LeaderboardMode, period: TimePeriod) {
        const payload: ILeaderboardInteractionPayload = {
            mode,
            period,
        };

        super(
            new SlackPlaintext(`Top ${mode} - ${period}`),
            qs.stringify(payload)
        );
    }
}
