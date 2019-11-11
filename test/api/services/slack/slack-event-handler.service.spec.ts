import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { SlackApiService, SlackEventHandler, SlackGuideBookService } from '../../../../src/api/services/slack';
import { SlackUser } from '../../../../src/db/entities';
import { SlackUserRepo } from '../../../../src/db/repos';
import { ErrorUserTriedToGiveTooManyEggs } from '../../../../src/shared/errors';
import { ConversationType } from '../../../../src/shared/models/slack/conversations';
import {
    ISlackEventChallenge,
    ISlackEventMessagePosted,
    ISlackEventWrapper,
    SlackEventType
} from '../../../../src/shared/models/slack/events';
import { SlackBlockMessage } from '../../../../src/shared/models/slack/messages';

@suite
class SlackEventHandlerServiceSpec
{
    @test
    public async should_returnChallenge_when_challengeEventFired(): Promise<void>
    {
        // arrange
        // - test data
        const event: ISlackEventChallenge = {
            challenge: 'challenging',
            type: SlackEventType.Challenge,
            token: 'foo'
        };

        // - unit under test
        const uut = new SlackEventHandler(null, null, null, null, null);

        // act
        const actual = await uut.handleEvent(event);

        // assert
        expect(actual).to.equal(event.challenge);
    }

    @test
    public async should_createUserAndSendGuide_when_newUserGivesEggs(): Promise<void>
    {
        // arrange
        // - dependencies
        const api = Substitute.for<SlackApiService>();
        const userRepo = Substitute.for<SlackUserRepo>();
        const guideBook = Substitute.for<SlackGuideBookService>();

        // - test data
        const botUserId = 'E9999';
        api.getBotUserId().returns(Promise.resolve(botUserId));

        const teamId = 'egg-party-team';
        const userId = 'U2345';
        const event: Partial<ISlackEventWrapper> = {
            type: SlackEventType.EventWrapper,
            team_id: teamId,
            event: {
                type: SlackEventType.MessagePosted,
                channel_type: ConversationType.Public,
                text: '<@U1234> good job today! :egg:',
                user: userId,
            } as ISlackEventMessagePosted
        };

        userRepo.getBySlackId(userId, teamId).returns(Promise.resolve(null));

        const message = new SlackBlockMessage([], 'This is a unit test');
        guideBook.build(userId, botUserId).returns(message);

        // - unit under test
        const uut = new SlackEventHandler(api, userRepo, null, null, guideBook);

        // act
        await uut.handleEvent(event as ISlackEventWrapper);

        // assert
        userRepo.received().create(userId, teamId);
        api.received().sendDirectMessage(userId, message);
    }

    @test
    public async should_createUserAndSendGuide_when_newUserReceivesEggs(): Promise<void>
    {
        // arrange
        // - dependencies
        const api = Substitute.for<SlackApiService>();
        const userRepo = Substitute.for<SlackUserRepo>();
        const guideBook = Substitute.for<SlackGuideBookService>();

        // - test data
        const botUserId = 'E9999';
        api.getBotUserId().returns(Promise.resolve(botUserId));

        const teamId = 'egg-party-team';
        const userId = 'U2345';
        const giveToUserId = 'U1234';
        const event: Partial<ISlackEventWrapper> = {
            type: SlackEventType.EventWrapper,
            team_id: teamId,
            event: {
                type: SlackEventType.MessagePosted,
                channel_type: ConversationType.Public,
                text: `<@${giveToUserId}> good job today! :egg:`,
                user: userId,
            } as ISlackEventMessagePosted
        };

        userRepo.getOrCreate(userId, teamId).returns(Promise.resolve({ wasCreated: false, user: null }));
        userRepo.getOrCreate(giveToUserId, teamId).returns(Promise.resolve({ wasCreated: true, user: null }));

        guideBook.build(Arg.all()).returns(null);

        // - unit under test
        const uut = new SlackEventHandler(api, userRepo, null, null, guideBook);

        // act
        await uut.handleEvent(event as ISlackEventWrapper);

        // assert
        userRepo.received().create(giveToUserId, teamId);
        api.received().sendDirectMessage(giveToUserId, null);
    }

    @test
    public async should_NotCreateOrMessageReceiver_when_tooManyEggsGivenToNewUser(): Promise<void>
    {
        // arrange
        // - dependencies
        const api = Substitute.for<SlackApiService>();
        const userRepo = Substitute.for<SlackUserRepo>();
        const guideBook = Substitute.for<SlackGuideBookService>();

        // - test data
        const botUserId = 'E9999';
        api.getBotUserId().returns(Promise.resolve(botUserId));

        const teamId = 'egg-party-team';
        const userId = 'U2345';
        const giveToUserId = 'U1234';
        const event: Partial<ISlackEventWrapper> = {
            type: SlackEventType.EventWrapper,
            team_id: teamId,
            event: {
                type: SlackEventType.MessagePosted,
                channel_type: ConversationType.Public,
                text: `<@${giveToUserId}> good job today! :egg::egg::egg::egg::egg::egg:`,
                user: userId,
            } as ISlackEventMessagePosted
        };

        // Giver is NOT new
        userRepo.getOrCreate(userId, teamId)
                .returns(Promise.resolve({ wasCreated: false, user: new SlackUser() }));

        // Receiver IS new
        userRepo.getOrCreate(giveToUserId, teamId)
                .returns(Promise.resolve({ wasCreated: true, user: new SlackUser() }));

        // Giver tried to give too many
        userRepo.throwIfUserCannotGiveEggs(userId, Arg.any(), Arg.any())
                .returns(Promise.reject(new ErrorUserTriedToGiveTooManyEggs(5, 6)));

        guideBook.build(Arg.all()).returns(null);

        // - unit under test
        const uut = new SlackEventHandler(api, userRepo, null, null, guideBook);

        // act
        await uut.handleEvent(event as ISlackEventWrapper);

        // assert

        // nothing was sent to receiver
        api.didNotReceive().sendDirectMessage(giveToUserId, Arg.any());
    }
}
