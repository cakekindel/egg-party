import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { fake } from 'sinon';
import { DailyEggsService } from '../../../src/api/services/daily-eggs.service';
import { EggGivingService } from '../../../src/api/services/egg-giving.service';
import {
    SlackApiService,
    SlackMessageBuilderService,
} from '../../../src/api/services/slack';
import { Egg, SlackUser, SlackTeam } from '../../../src/db/entities';
import { EggRepo, SlackUserRepo } from '../../../src/db/repos';
import {
    SlackMessageYouCantGiveEggsToEggParty,
    SlackMessageYouCantGiveEggsToYourself,
    SlackMessageYouGaveEggs,
} from '../../../src/shared/models/messages';
import {
    TestClass,
    TestMethod,
    TestCase,
} from '../../test-utilities/directives';
import _ = require('lodash');

interface ITestCase {
    eggCount: number;
    giveToIds: string[];
}

@TestClass()
export class EggGivingServiceSpec {
    @TestCase({ eggCount: 1, giveToIds: ['1'] })
    @TestCase({ eggCount: 5, giveToIds: ['2'] })
    @TestCase({ eggCount: 2, giveToIds: ['3', '4'] })
    @TestCase({
        eggCount: 1,
        giveToIds: ['1', '2', '3', '4', '5'],
    })
    public async should_giveEggs(testCase: ITestCase): Promise<void> {
        const userId = 'U1234';
        const workspaceId = 'W222';

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
        user.eggs = [undefined, undefined, undefined, undefined, undefined].map(
            (_, ix) => {
                const egg = new Egg();
                egg.id = ix;
                return egg;
            }
        );

        // - dependency setup
        async function getOrCreateUserFake(
            id: string,
            _wsId: never
        ): Promise<SlackUser> {
            const usr = id === userId ? user : new SlackUser();
            return Promise.resolve(usr);
        }

        eggRepo
            .getByIds(Arg.any())
            .returns(Promise.resolve(_.cloneDeep(user.eggs)));
        userRepo
            .getOrCreateAndSendGuideBook(userId, workspaceId)
            .mimicks(getOrCreateUserFake);
        userRepo.getById(user.id).returns(Promise.resolve(user));
        eggRepo.giveToUser(Arg.all()).returns(Promise.resolve());

        // - unit under test
        const uut = new EggGivingService(
            userRepo,
            eggRepo,
            dailyEggSvc,
            slackApi,
            messageBuilder
        );

        // act
        await uut.giveEggs(
            workspaceId,
            userId,
            testCase.eggCount,
            testCase.giveToIds
        );

        // TODO: FIGURE OUT WHY THIS HAS TO BE INVOKED???
        eggRepo.giveToUser(Arg.all());

        // assert
        try {
            eggRepo
                .received(testCase.giveToIds.length * testCase.eggCount + 1)
                .giveToUser(Arg.any(), Arg.any());
        } catch (e) {
            throw e;
        }
    }

    @TestMethod()
    public async should_messageGiver_when_eggsGivenToThemselves(): Promise<
        void
    > {
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
        user.team = { oauthToken: '🗝' } as SlackTeam;

        // - dependency setup
        userRepo
            .getOrCreateAndSendGuideBook(userId, workspaceId)
            .returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));
        eggRepo
            .getByIds(Arg.any())
            .returns(Promise.resolve(_.cloneDeep(user.eggs)));

        // - unit under test
        const uut = new EggGivingService(
            userRepo,
            eggRepo,
            dailyEggSvc,
            slackApi,
            messageBuilder
        );

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        slackApi.received().sendDirectMessage(
            user.team.oauthToken,
            userId,
            Arg.is(m => m instanceof SlackMessageYouCantGiveEggsToYourself)
        );
    }

    @TestMethod()
    public async should_messageGiver_when_eggsGivenToEggParty(): Promise<void> {
        // arrange
        // - dependencies
        const userRepo = Substitute.for<SlackUserRepo>();
        const slackApi = Substitute.for<SlackApiService>();
        const messageBuilder = Substitute.for<SlackMessageBuilderService>();
        const dailyEggSvc = Substitute.for<DailyEggsService>();
        const eggRepo = Substitute.for<EggRepo>();

        // - test data
        const userId = 'U1234';
        const botUserId = 'BEEPBOOP';
        const giveToIds = [botUserId];
        const workspaceId = 'W222';
        const eggCount = 2;

        const user = new SlackUser();
        const egg = new Egg();
        user.slackUserId = userId;
        user.eggs = [egg, egg];
        user.team = { oauthToken: '🗝', botUserId } as SlackTeam;

        // - dependency setup
        userRepo
            .getOrCreateAndSendGuideBook(userId, workspaceId)
            .returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));
        eggRepo
            .getByIds(Arg.any())
            .returns(Promise.resolve(_.cloneDeep(user.eggs)));

        // - unit under test
        const uut = new EggGivingService(
            userRepo,
            eggRepo,
            dailyEggSvc,
            slackApi,
            messageBuilder
        );

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        slackApi.received().sendDirectMessage(
            user.team.oauthToken,
            userId,
            Arg.is(m => m instanceof SlackMessageYouCantGiveEggsToEggParty)
        );
    }

    @TestMethod()
    public async should_messageGiver_when_eggsGiven(): Promise<void> {
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
        user.team = { oauthToken: '🗝' } as SlackTeam;

        const egg = new Egg();
        user.eggs = [egg, egg];

        // - dependency setup
        userRepo
            .getOrCreateAndSendGuideBook(userId, workspaceId)
            .returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));
        eggRepo
            .getByIds(Arg.any())
            .returns(Promise.resolve(_.cloneDeep(user.eggs)));

        // - unit under test
        const uut = new EggGivingService(
            userRepo,
            eggRepo,
            dailyEggSvc,
            slackApi,
            messageBuilder
        );

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        slackApi.received().sendDirectMessage(
            user.team.oauthToken,
            userId,
            Arg.is(m => m instanceof SlackMessageYouGaveEggs)
        );

        // TODO: FIGURE OUT WHY THIS HAS TO BE INVOKED???
        eggRepo.giveToUser(Arg.all());

        eggRepo.received().giveToUser(egg, Arg.any());
    }

    @TestMethod()
    public async should_messageGiver_when_giveEggsInvokedAndUserCannotGiveThatMany(): Promise<
        void
    > {
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
        const eggCount = 6;

        const user = new SlackUser();
        const egg = new Egg();
        user.slackUserId = userId;
        user.eggs = [egg];

        // - dependency setup
        const sendMessageFake = fake();
        slackApi.sendDirectMessage(Arg.all()).mimicks(sendMessageFake);
        userRepo
            .getOrCreateAndSendGuideBook(Arg.all())
            .returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));
        eggRepo
            .getByIds(Arg.any())
            .returns(Promise.resolve(_.cloneDeep(user.eggs)));

        // - unit under test
        const uut = new EggGivingService(
            userRepo,
            eggRepo,
            dailyEggSvc,
            slackApi,
            messageBuilder
        );

        // act
        await uut.giveEggs(workspaceId, userId, eggCount, giveToIds);

        // assert
        messageBuilder.received().triedToGiveTooManyEggs();
        sendMessageFake.calledWith(
            userId,
            messageBuilder.triedToGiveTooManyEggs()
        );
    }

    @TestMethod()
    public async should_messageGiver_when_giveEggsInvokedAndUserOutOfEggs(): Promise<
        void
    > {
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
        const eggCount = 1;

        const user = new SlackUser();
        user.slackUserId = userId;

        // - dependency setup
        const sendMessageFake = fake();
        slackApi.sendDirectMessage(Arg.all()).mimicks(sendMessageFake);
        userRepo
            .getOrCreateAndSendGuideBook(Arg.all())
            .returns(Promise.resolve(user));
        userRepo.getById(user.id).returns(Promise.resolve(user));
        eggRepo.getByIds(Arg.all()).returns(Promise.resolve([]));

        // - unit under test
        const uut = new EggGivingService(
            userRepo,
            eggRepo,
            dailyEggSvc,
            slackApi,
            messageBuilder
        );

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
