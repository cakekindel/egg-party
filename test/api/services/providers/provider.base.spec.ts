import Substitute, { Arg } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import { ResourceMapperBase } from '../../../../src/api/services/providers/resource-mappers';
import { ProviderBase } from '../../../../src/api/services/providers';
import { RepoBase } from '../../../../src/db/repos';
import { TestClass, TestMethod } from '../../../test-utilities/directives';
import { Maybe } from 'purify-ts/Maybe';
import { Argument } from '@fluffy-spoon/substitute/dist/src/Arguments';

class VM {
    public id: number;
    public createdDate: Date;
}
class Entity {
    public id: number;
    public createdDate: Date;
    public isActive: boolean;
}

class MockProvider extends ProviderBase<VM, Entity> {
    // TODO: figure out if theres a better solution for this than hiding the substitute with an object instance
    // expl: Ramda's .pipe(...fn) throws when passed a Symbol (what SubstituteJS uses)
    public mapper = {
        mapToEntity: vm => this.mapperSub.mapToEntity(vm),
        mapToViewModel: e => this.mapperSub.mapToViewModel(e),
        mapMaybeToEntity: vm => this.mapperSub.mapMaybeToEntity(vm),
        mapMaybeToViewModel: e => this.mapperSub.mapMaybeToViewModel(e),
        mapArrayToEntities: vms => this.mapperSub.mapArrayToEntities(vms),
        mapArrayToViewModels: es => this.mapperSub.mapArrayToViewModels(es),
    } as ResourceMapperBase<VM, Entity>;
    public mapperSub = Substitute.for<ResourceMapperBase<VM, Entity>>();

    public repo = ({
        getById: (id: number) => this.repoSub.getById(id),
        getAll: () => this.repoSub.getAll(),
        getByIds: (ids: number[]) => this.repoSub.getByIds(ids),
        delete: (e: Entity) => this.repoSub.delete(e),
        save: (e: Entity) => this.repoSub.save(e),
        saveOne: (e: Entity) => this.repoSub.saveOne(e),
        saveMany: (es: Entity[]) => this.repoSub.saveMany(es),
    } as unknown) as RepoBase<Entity>;
    public repoSub = Substitute.for<RepoBase<Entity>>();
}

function maybeArg<T>(value: T | undefined): Maybe<T> & Argument<Maybe<T>> {
    return Arg.is((m: Maybe<T>) => m.extract() === value);
}

@TestClass()
export class ProviderBaseSpec {
    @TestMethod()
    public async getById_should_getFromRepoAndMap(): Promise<void> {
        // arrange
        const testId = 2;
        const provider = new MockProvider();

        const entity: Entity = {
            id: 2,
            createdDate: new Date(),
            isActive: true,
        };

        provider.repoSub.getById(testId).returns(Promise.resolve(entity));

        provider.mapperSub
            .mapMaybeToViewModel(Arg.any())
            .returns(Maybe.of(entity));

        // act
        const actual = await provider.getById(testId).run();

        // assert
        provider.repoSub.received().getById(testId);

        provider.mapperSub.received().mapMaybeToViewModel(maybeArg(entity));
        expect(actual.extract()).to.deep.equal(entity);
    }

    @TestMethod()
    public async getById_should_notThrow_when_entityNull(): Promise<void> {
        // arrange
        const id = 2;
        const provider = new MockProvider();

        provider.repoSub.getById(id).returns(Promise.resolve(null));

        // act
        await provider.getById(id).run();

        // assert
    }

    @TestMethod()
    public async getAll_should_callThroughRepo(): Promise<void> {
        // arrange
        const provider = new MockProvider();
        provider.repoSub.getAll().returns(Promise.resolve([]));
        provider.mapperSub.mapArrayToViewModels(Arg.any()).returns([]);

        // act
        await provider.getAll();

        // assert
        provider.repoSub.received().getAll();
    }

    @TestMethod()
    public async delete_should_callThroughRepo(): Promise<void> {
        // arrange
        const provider = new MockProvider();
        provider.mapperSub.mapToEntity(Arg.any()).returns({} as Entity);

        // act
        await provider.delete({} as VM);

        // assert
        provider.repoSub.received().delete(Arg.any());
    }

    @TestMethod()
    public async saveOne_should_callThroughRepo(): Promise<void> {
        // arrange
        const provider = new MockProvider();
        const mockVm = { id: 2 } as VM;
        provider.mapperSub.mapToEntity(Arg.any()).returns(mockVm as Entity);
        provider.repoSub
            .saveOne(Arg.any())
            .returns(Promise.resolve(mockVm as Entity));

        // act
        const actual = await provider.saveOne(mockVm);

        // assert
        expect(actual).to.equal(mockVm.id);
        provider.repoSub.received().saveOne(mockVm as Entity);
    }

    @TestMethod()
    public async saveMany_should_callThroughRepo(): Promise<void> {
        // arrange
        const provider = new MockProvider();
        const mockVms = [{ id: 2 } as VM, { id: 3 } as VM];
        provider.mapperSub
            .mapArrayToEntities(Arg.any())
            .returns(mockVms as Entity[]);
        provider.repoSub
            .saveMany(Arg.any())
            .returns(Promise.resolve(mockVms as Entity[]));

        // act
        const actual = await provider.saveMany(mockVms);

        // assert
        expect(actual).to.deep.equal(mockVms.map(v => v.id));
        provider.repoSub.received().saveMany(mockVms as Entity[]);
    }
}
