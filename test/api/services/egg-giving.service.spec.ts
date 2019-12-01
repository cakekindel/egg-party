import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { suite, test } from 'mocha-typescript';
import { fake } from 'sinon';

import { DailyEggsService } from '../../../src/api/services/daily-eggs.service';
import { EggGivingService } from '../../../src/api/services/egg-giving.service';
import { SlackApiService, SlackMessageBuilderService } from '../../../src/api/services/slack';
import { Egg, SlackUser } from '../../../src/db/entities';
import { EggRepo, SlackUserRepo } from '../../../src/db/repos';
import {
    SlackMessageYouCantGiveEggsToEggParty,
    SlackMessageYouCantGiveEggsToYourself,
    SlackMessageYouGaveEggs
} from '../../../src/shared/models/messages';

@suite()
export class EggGivingServiceSpec
{
    @test()
    public async should_giveEggs(): Promise<void>
    {
        // parameterize
        interface ITestCase { eggCount: number; giveToIds: string[]; }
        const testCases: ITestCase[] = [
            { eggCount: 1, giveToIds: ['U2323'] },
            { eggCount: 5, giveToIds: ['U4343'] },
            { eggCount: 2, giveToIds: ['U3333', 'U2222'] },
            { eggCount: 1, giveToIds: ['U3333', 'U2222', 'U1111', 'U9999', 'U4444'] },
        ];

        const userId = 'U1234';
        const workspaceId = 'W222';

        for (const testCase of testCases)
        {
            // arrange
            // - dependencies
            const userRepo = Substitute.for<SlackUserRepo>();
            const slackApi = Substitute.for<SlackApiService>();
            const messageBuilder = Substitute.for<SlackMessageBuilderService>();
            const dailyEggSvc = Substitute.for<DailyEggsService>();
            const eggRepo = Substitute.for<EggRepo>();

            // - test data
            const user = new SlackUser();
            user.slackUserId = userId;
            user.eggs = Array.from(Array(5)).map(() => new Egg());

            // - dependency setup
            async function getOrCreateUserFake(id: string, _wsId: never): Promise<SlackUser> {
                return id === userId ? user : new SlackUser();
            }

            userRepo.getOrCreateAndSendGuideBook(userId, workspaceId).mimicks(getOrCreateUserFake);
            userRepo.getById(user.id).returns(Promise.resolve(user));

            // - unit under test
            const uut = new EggGivingService(userRepo, eggRepo, dailyEggSvc, slackApi, messageBuilder);

            // act
            await uut.giveEggs(workspaceId, userId, testCase.eggCount, testCase.giveToIds);

            // assert
            eggRepo.received(testCase.giveToIds.length * testCase.eggCount).giveToUser(Arg.any(), Arg.any());
        }
    }

    @test()
    public async should_messageGiver_when_eggsGivenToThemselves(): Promise<void>
    {
        // arrange
        // - dependencies
        const userRepo = Substitute.for<SlackUserRepo>();
        const slackApi = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();
        const dailyEggSvc = Substitute.for<DailyEggsService>();
        const eggRepo = Substitute.for<EggRepo>();

        // - test data
        const userId = 'U1234';
        const giveToIds = ['U1234'];
        const workspaceId = 'W222';
        const eggCount = 2;

        const user = new SlackUser();
        const egg = new Egg();
        user.slackUserId = userId;
        user.eggs = [egg, egg];

        // - dependency setup
        userRepo.getOrCreateAndSendGuideBook(userId, workspaceId).returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));

        // - unit under test
        const uut = new EggGivingService(userRepo, eggRepo, dailyEggSvc, slackApi, messageBuilder);

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        slackApi.received().sendDirectMessage(userId, Arg.is(m => m instanceof SlackMessageYouCantGiveEggsToYourself));
    }

    @test()
    public async should_messageGiver_when_eggsGivenToEggParty(): Promise<void>
    {
        // arrange
        // - dependencies
        const userRepo = Substitute.for<SlackUserRepo>();
        const slackApi = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();
        const dailyEggSvc = Substitute.for<DailyEggsService>();
        const eggRepo = Substitute.for<EggRepo>();

        // - test data
        const userId = 'U1234';
        const botId = 'BEEPBOOP';
        const giveToIds = [botId];
        const workspaceId = 'W222';
        const eggCount = 2;

        const user = new SlackUser();
        const egg = new Egg();
        user.slackUserId = userId;
        user.eggs = [egg, egg];

        // - dependency setup
        slackApi.getBotUserId().returns(Promise.resolve(botId));
        userRepo.getOrCreateAndSendGuideBook(userId, workspaceId).returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));

        // - unit under test
        const uut = new EggGivingService(userRepo, eggRepo, dailyEggSvc, slackApi, messageBuilder);

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        slackApi.received().sendDirectMessage(userId, Arg.is(m => m instanceof SlackMessageYouCantGiveEggsToEggParty));
    }

    @test()
    public async should_messageGiver_when_eggsGiven(): Promise<void>
    {
        // arrange
        // - dependencies
        const userRepo = Substitute.for<SlackUserRepo>();
        const slackApi = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();
        const dailyEggSvc = Substitute.for<DailyEggsService>();
        const eggRepo = Substitute.for<EggRepo>();

        // - test data
        const userId = 'U1234';
        const giveToIds = ['U2345'];
        const workspaceId = 'W222';
        const eggCount = 2;

        const user = new SlackUser();
        user.slackUserId = userId;

        const egg = new Egg();
        user.eggs = [egg, egg];

        // - dependency setup
        userRepo.getOrCreateAndSendGuideBook(userId, workspaceId).returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));

        // - unit under test
        const uut = new EggGivingService(userRepo, eggRepo, dailyEggSvc, slackApi, messageBuilder);

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        slackApi.received().sendDirectMessage(userId, Arg.is(m => m instanceof SlackMessageYouGaveEggs));
        eggRepo.received().giveToUser(egg, Arg.any());
    }

    @test()
    public async should_messageGiver_when_giveEggsInvokedAndUserCannotGiveThatMany(): Promise<void>
    {
        // arrange
        // - dependencies
        const userRepo = Substitute.for<SlackUserRepo>();
        const slackApi = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();
        const dailyEggSvc = Substitute.for<DailyEggsService>();

        // - test data
        const userId = 'U1234';
        const giveToIds = ['U2345'];
        const workspaceId = 'W222';
        const eggCount = 6;

        const user = new SlackUser();
        const egg = new Egg();
        user.slackUserId = userId;
        user.eggs = [egg];

        // - dependency setup
        const sendMessageFake = fake();
        slackApi.sendDirectMessage(Arg.all()).mimicks(sendMessageFake);
        userRepo.getOrCreateAndSendGuideBook(Arg.all()).returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));

        // - unit under test
        const uut = new EggGivingService(userRepo, null, dailyEggSvc, slackApi, messageBuilder);

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        messageBuilder.received().triedToGiveTooManyEggs();
        sendMessageFake.calledWith(userId, messageBuilder.triedToGiveTooManyEggs());
    }

    @test()
    public async should_messageGiver_when_giveEggsInvokedAndUserOutOfEggs(): Promise<void>
    {
        // arrange
        // - dependencies
        const userRepo = Substitute.for<SlackUserRepo>();
        const slackApi = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();
        const dailyEggSvc = Substitute.for<DailyEggsService>();

        // - test data
        const userId = 'U1234';
        const giveToIds = ['U2345'];
        const workspaceId = 'W222';
        const eggCount = 1;

        const user = new SlackUser();
        user.slackUserId = userId;

        // - dependency setup
        const sendMessageFake = fake();
        slackApi.sendDirectMessage(Arg.all()).mimicks(sendMessageFake);
        userRepo.getOrCreateAndSendGuideBook(Arg.all()).returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));

        // - unit under test
        const uut = new EggGivingService(userRepo, null, dailyEggSvc, slackApi, messageBuilder);

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        messageBuilder.received().outOfEggs();
        sendMessageFake.calledWith(userId, messageBuilder.outOfEggs());
    }

    // should_createUserAndSendGuide_when_newUserGivesEggs
    // should_createUserAndSendGuide_when_newUserReceivesEggs
    // should_NotCreateOrMessageReceiver_when_tooManyEggsGivenToNewUser
}
