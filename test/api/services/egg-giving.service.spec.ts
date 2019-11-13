import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { suite, test } from 'mocha-typescript';

import { EggGivingService } from '../../../src/api/services/egg-giving.service';
import { SlackApiService, SlackMessageBuilderService } from '../../../src/api/services/slack';
import { Egg, SlackUser } from '../../../src/db/entities';
import { EggRepo, SlackUserRepo } from '../../../src/db/repos';

@suite()
export class EggGivingServiceSpec
{
    @test()
    public async should_sendGiverWelcomeMessage_when_newUserTriesToGiveEggs(): Promise<void>
    {
        // arrange
        // - dependencies
        const userRepo = Substitute.for<SlackUserRepo>();
        const eggRepo = Substitute.for<EggRepo>();
        const slackApi = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();

        // - test data
        const giverId = 'U1234';
        const botUserId = 'BEEP BOOP BLORP';
        const toUsers = ['U2345'];
        const workspaceId = 'W222';
        const giveNumberOfEggs = 1;

        const user = new SlackUser();

        const userMeta = { wasCreated: true, user };

        // - dependency setup
        userRepo.getOrCreate(Arg.all()).returns(Promise.resolve(userMeta));
        slackApi.getBotUserId().returns(Promise.resolve(botUserId));

        // - unit under test
        const uut = new EggGivingService(userRepo, eggRepo, slackApi, messageBuilder);

        // act
        await uut.giveEggs(workspaceId, giverId, giveNumberOfEggs, toUsers);

        // assert
        messageBuilder.received().guideBook(giverId, botUserId);
        slackApi.received().sendDirectMessage(giverId, messageBuilder.guideBook(giverId, botUserId));
    }

    @test()
    public async should_messageGiver_when_giveEggsInvokedAndUserOutOfEggs(): Promise<void>
    {
        // arrange
        // - dependencies
        const userRepo = Substitute.for<SlackUserRepo>();
        const slackApi = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();

        // - test data
        const userId = 'U1234';
        const giveToIds = ['U2345'];
        const workspaceId = 'W222';
        const eggCount = 1;

        const user = new SlackUser();
        const egg = new Egg();
        egg.givenOnDate = new Date();
        user.eggsGiven = [egg, egg, egg, egg, egg];

        const userMeta = { wasCreated: false, user };

        // - dependency setup
        userRepo.getOrCreate(Arg.all()).returns(Promise.resolve(userMeta));

        // - unit under test
        const uut = new EggGivingService(userRepo, null, slackApi, messageBuilder);

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        messageBuilder.received().outOfEggs();
        slackApi.received().sendDirectMessage(userId, messageBuilder.outOfEggs());
    }

    // should_createUserAndSendGuide_when_newUserGivesEggs
    // should_createUserAndSendGuide_when_newUserReceivesEggs
    // should_NotCreateOrMessageReceiver_when_tooManyEggsGivenToNewUser
}
