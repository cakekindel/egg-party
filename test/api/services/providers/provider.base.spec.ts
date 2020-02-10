import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { ProviderBase } from '../../../../src/business/providers';
import { ResourceMapperBase } from '../../../../src/business/providers/resource-mappers';
import { RepoBase } from '../../../../src/db/repos';
import { TestClass, TestMethod } from '../../../test-utilities/directives';

class MockVm {
    public id: number;
    public createdDate: Date;
}
class MockEntity {
    public id: number;
    public createdDate: Date;
    public isActive: boolean;
}

class MockProvider extends ProviderBase<MockVm, MockEntity> {
    public mapper = Substitute.for<ResourceMapperBase<MockVm, MockEntity>>();
    public repo = Substitute.for<RepoBase<MockEntity>>();
}

@TestClass()
export class ProviderBaseSpec {
    @TestMethod()
    public async getById_should_getFromRepoAndMap(): Promise<void> {
        // arrange
        const testId = 2;
        const provider = new MockProvider();

        const entity: MockEntity = {
            id: testId,
            createdDate: new Date(),
            isActive: true,
        };

        provider.repo.getById(testId).returns(Promise.resolve(entity));
        provider.mapper.mapToViewModel(Arg.any()).returns(entity as MockVm);

        // act
        const actual = await provider.getById(testId).run();

        // assert
        actual
            .ifLeft(() => expect.fail('getById returned Error'))
            .unsafeCoerce()
            .ifNothing(() => expect.fail('getById returned Nothing'))
            .ifJust(val => expect(val).to.deep.equal(entity));
    }

    @TestMethod()
    public async getById_should_notThrow_when_entityNull(): Promise<void> {
        // arrange
        const id = 2;
        const provider = new MockProvider();

        provider.repo.getById(id).returns(Promise.resolve(null));

        // act
        await provider.getById(id).run();

        // assert
    }

    @TestMethod()
    public async getAll_should_callThroughRepo(): Promise<void> {
        // arrange
        const provider = new MockProvider();
        provider.repo.getAll().returns(Promise.resolve([]));
        provider.mapper.mapArrayToViewModels(Arg.any()).returns([]);

        // act
        await provider.getAll();

        // assert
        provider.repo.received().getAll();
    }

    @TestMethod()
    public async delete_should_callThroughRepo(): Promise<void> {
        // arrange
        const provider = new MockProvider();
        provider.mapper.mapToEntity(Arg.any()).returns({} as MockEntity);

        // act
        await provider.delete({} as MockVm);

        // assert
        provider.repo.received().delete(Arg.any());
    }

    @TestMethod()
    public async saveOne_should_callThroughRepo(): Promise<void> {
        // arrange
        const provider = new MockProvider();
        const mockVm = { id: 2 } as MockVm;
        provider.mapper.mapToEntity(Arg.any()).returns(mockVm as MockEntity);
        provider.repo
            .saveOne(Arg.any())
            .returns(Promise.resolve(mockVm as MockEntity));

        // act
        const actual = await provider.saveOne(mockVm);

        // assert
        expect(actual).to.equal(mockVm.id);
        provider.repo.received().saveOne(mockVm as MockEntity);
    }

    @TestMethod()
    public async saveMany_should_callThroughRepo(): Promise<void> {
        // arrange
        const provider = new MockProvider();
        const mockVms = [{ id: 2 } as MockVm, { id: 3 } as MockVm];
        provider.mapper
            .mapArrayToEntities(Arg.any())
            .returns(mockVms as MockEntity[]);
        provider.repo
            .saveMany(Arg.any())
            .returns(Promise.resolve(mockVms as MockEntity[]));

        // act
        const actual = await provider.saveMany(mockVms);

        // assert
        expect(actual).to.deep.equal(mockVms.map(v => v.id));
        provider.repo.received().saveMany(mockVms as MockEntity[]);
    }
}
