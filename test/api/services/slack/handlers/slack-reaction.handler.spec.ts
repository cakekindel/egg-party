import { Arg } from '@fluffy-spoon/substitute';
import { suite, test } from 'mocha-typescript';

import { isEqual } from 'lodash';
import { EggGivingService } from '../../../../../src/api/services/egg-giving.service';
import { SlackReactionHandler } from '../../../../../src/api/services/slack/handlers';
import { ISlackEventReactionAdded, ISlackEventWrapper, SlackEventType } from '../../../../../src/shared/models/slack/events';
import { ISpec, UnitTestSetup } from '../../../../test-utilities';

@suite()
export class SlackReactionHandlerSpec implements ISpec<SlackReactionHandler>
{
    private testConstants = {
        workspaceId: '🏫',
        userId: '👴'
    };

    @test()
    public async should_callEggGivingService_when_eggReactionReceived(): Promise<void>
    {
        // arrange
        const testSetup = this.getUnitTestSetup();
        const receiverId = '🦸‍♂️';
        const event = this.createReactionEvent(receiverId, 'egg');

        // act
        testSetup.unitUnderTest.handleReaction(event);

        // assert
        testSetup.dependencies.get(EggGivingService)
                              .received()
                              .giveEggs(
                                  this.testConstants.workspaceId,
                                  this.testConstants.userId,
                                  1,
                                  Arg.is(ids => isEqual(ids, [receiverId]))
                              );
    }

    @test()
    public async should_notCallEggGivingService_when_otherReactionReceived(): Promise<void>
    {
        // arrange
        const testSetup = this.getUnitTestSetup();
        const receiverId = '🦸‍♂️';
        const event = this.createReactionEvent(receiverId, 'turtle');

        // act
        testSetup.unitUnderTest.handleReaction(event);

        // assert
        testSetup.dependencies.get(EggGivingService)
                              .didNotReceive()
                              .giveEggs(Arg.any(), Arg.any(), Arg.any(), Arg.any());
    }

    public getUnitTestSetup(): UnitTestSetup<SlackReactionHandler>
    {
        return new UnitTestSetup(SlackReactionHandler);
    }

    private createReactionEvent(receiverId: string, emoji: string): ISlackEventWrapper<ISlackEventReactionAdded>
    {
        return {
            type: SlackEventType.EventWrapper,
            team_id: this.testConstants.workspaceId,
            event: {
                type: SlackEventType.ReactionAdded,
                user: this.testConstants.userId,
                item_user: receiverId,
                reaction: emoji,
                item: { channel: '#honey', ts: '1234', type: 'message' }
            }
        } as ISlackEventWrapper<ISlackEventReactionAdded>;
    }
}
