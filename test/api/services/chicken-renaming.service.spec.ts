// tslint:disable: max-classes-per-file
import { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import * as _ from 'lodash';
import { EitherAsync, Just, Right } from 'purify-ts';
import { ChickenRenamingService } from '../../../src/api/services';
import { SlackTeamProvider } from '../../../src/business/providers';
import { SlackTeam } from '../../../src/business/view-models';
import { Chicken, SlackUser } from '../../../src/db/entities';
import { ChickenRepo, SlackUserRepo } from '../../../src/db/repos';
import { CreateEitherAsync } from '../../../src/purify/create-either-async.fns';
import { UnitTestSetup } from '../../test-utilities';
import { TestClass, TestMethod } from '../../test-utilities/directives';

@TestClass()
export class ChickenRenamingServiceSpec {
    @TestMethod()
    public async should_returnUndefined_when_getWaitingForUserInvokedAndNoChickensWaiting(): Promise<
        void
    > {
        // arrange
        const unitTestSetup = this.getUnitTestSetup();
        const user = this.createTestUser([new Chicken()]);

        unitTestSetup.dependencies
            .get(SlackUserRepo)
            .getBySlackId(user.slackUserId, user.slackWorkspaceId)
            .returns(Promise.resolve(user));

        // act
        const actual = await unitTestSetup.unitUnderTest.getChickenAwaitingRenameForUser(
            user.slackUserId,
            user.slackWorkspaceId
        );

        // assert
        expect(actual).to.be.undefined;
    }

    @TestMethod()
    public async should_returnChicken_when_getWaitingForUserInvokedAndOneChickenWaiting(): Promise<
        void
    > {
        // arrange
        // - test data
        const chicken = new Chicken();
        chicken.awaitingRename = true;

        const user = this.createTestUser([chicken]);

        const unitTestSetup = this.getUnitTestSetup();

        unitTestSetup.dependencies
            .get(SlackUserRepo)
            .getBySlackId(user.slackUserId, user.slackWorkspaceId)
            .returns(Promise.resolve(user));

        // act
        const actual = await unitTestSetup.unitUnderTest.getChickenAwaitingRenameForUser(
            user.slackUserId,
            user.slackWorkspaceId
        );

        // assert
        expect(actual).to.equal(chicken);
    }

    @TestMethod()
    public async should_cancelAllRenames_when_multipleChickensWaiting(): Promise<
        void
    > {
        // arrange
        const unitTestSetup = this.getUnitTestSetup();

        // - test data
        const chickensWaiting = [new Chicken(), new Chicken()];
        chickensWaiting.forEach(c => (c.awaitingRename = true));

        const user = this.createTestUser([...chickensWaiting, new Chicken()]);

        // - dependency setup
        unitTestSetup.dependencies
            .get(SlackUserRepo)
            .getBySlackId(user.slackUserId, user.slackWorkspaceId)
            .returns(Promise.resolve(user));

        // act
        const actual = await unitTestSetup.unitUnderTest.getChickenAwaitingRenameForUser(
            user.slackUserId,
            user.slackWorkspaceId
        );

        // assert
        expect(actual).to.be.undefined;
        expect(chickensWaiting.every(c => c.awaitingRename === false)).to.be
            .true;

        unitTestSetup.dependencies
            .get(ChickenRepo)
            .received()
            .save(Arg.is(chickens => _.isEqual(chickens, chickensWaiting)));
    }

    @TestMethod()
    public async should_markChickenWaitingForRename_when_markChickenForRenameInvoked(): Promise<
        void
    > {
        // arrange
        const unitTestSetup = this.getUnitTestSetup();

        // - test data
        const chicken = new Chicken();
        chicken.ownedByUser = new SlackUser();

        unitTestSetup.dependencies
            .get(SlackUserRepo)
            .getBySlackId(Arg.all())
            .returns(Promise.resolve(chicken.ownedByUser));

        // act
        await unitTestSetup.unitUnderTest.markChickenForRename(chicken);

        // assert
        expect(chicken.awaitingRename).to.be.true;
        unitTestSetup.dependencies
            .get(ChickenRepo)
            .received()
            .save(chicken);
    }

    @TestMethod()
    public async should_cancelPreviousRename_when_markChickenForRenameInvoked(): Promise<
        void
    > {
        // arrange
        // - test data
        const firstChicken = new Chicken();
        const secondChicken = new Chicken();

        const user = this.createTestUser([firstChicken, secondChicken]);

        firstChicken.ownedByUser = user;
        secondChicken.ownedByUser = user;

        const unitTestSetup = this.getUnitTestSetup();

        unitTestSetup.dependencies
            .get(SlackUserRepo)
            .getBySlackId(user.slackUserId, user.slackWorkspaceId)
            .returns(Promise.resolve(user));

        // act
        await unitTestSetup.unitUnderTest.markChickenForRename(firstChicken);
        await unitTestSetup.unitUnderTest.markChickenForRename(secondChicken);

        // assert
        expect(firstChicken.awaitingRename).to.be.false;
        expect(secondChicken.awaitingRename).to.be.true;

        unitTestSetup.dependencies
            .get(ChickenRepo)
            .received(2)
            .save(firstChicken);

        unitTestSetup.dependencies
            .get(ChickenRepo)
            .received(1)
            .save(secondChicken);
    }

    @TestMethod()
    public async should_throw_when_markChickenForRenameInvokedWithChickenWithoutUser(): Promise<
        void
    > {
        // arrange
        // - test data
        const chickenWithoutUser = new Chicken();
        chickenWithoutUser.ownedByUser = undefined;

        const unitTestSetup = this.getUnitTestSetup();

        // act
        let err: Error;
        try {
            await unitTestSetup.unitUnderTest.markChickenForRename(
                chickenWithoutUser
            );
        } catch (e) {
            err = e;
        }

        // assert
        expect(err).to.not.be.undefined;
    }

    @TestMethod()
    public async should_updateChickenNameAndMarkNotAwaitingRename_when_handleRenameInvoked(): Promise<
        void
    > {
        // arrange
        // - test data
        const oldName = 'Cluck Kent';
        const newName = 'Superhen';

        const teamId = 'team!';
        const userId = 'meat!';

        const chicken = new Chicken();
        chicken.name = oldName;
        chicken.awaitingRename = true;

        const test = this.getUnitTestSetup();

        test.dependencies
            .get(SlackTeamProvider)
            .getBySlackId(teamId)
            .returns(
                CreateEitherAsync.wrapRight(
                    Just({ oauthToken: '🔑' } as SlackTeam)
                )
            );

        // act
        await test.unitUnderTest.renameChicken(
            userId,
            teamId,
            chicken,
            newName
        );

        // assert
        expect(chicken.awaitingRename).to.be.false;
        expect(chicken.name).to.equal(newName);

        test.dependencies
            .get(ChickenRepo)
            .received()
            .save(chicken);
    }

    private getUnitTestSetup(): UnitTestSetup<ChickenRenamingService> {
        return new UnitTestSetup(ChickenRenamingService);
    }

    private createTestUser(chickens?: Chicken[]): SlackUser {
        const user = new SlackUser();
        user.slackUserId = 'U1234';
        user.slackWorkspaceId = '123';
        user.chickens = chickens;

        return user;
    }
}
