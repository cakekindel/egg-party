import { Just } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { IViewModel } from '../../../business/view-models';
import { EntityBase } from '../../../db/entities';
import { RepoBase } from '../../../db/repos';
import { CreateMaybeAsync } from '../../../purify/create-maybe-async.fns';
import { Immutable } from '../../../shared/types/immutable';
import { ResourceMapperBase } from './resource-mappers/resource-mapper.base';

export abstract class ProviderBase<
    TViewModel extends IViewModel,
    TEntity extends EntityBase
> {
    protected abstract readonly mapper: ResourceMapperBase<TViewModel, TEntity>;
    protected abstract readonly repo: RepoBase<TEntity, EntityBase>;

    public getById(id: number): MaybeAsync<TViewModel> {
        const getById$ = this.repo.getById(id);
        const getByIdMaybe = CreateMaybeAsync.fromPromiseOfNullable(getById$);

        return getByIdMaybe.map(e => this.mapper.mapToViewModel(e));
    }

    public async getAll(): Promise<TViewModel[]> {
        const getFromRepo = this.repo.getAll;
        const mapToViewModels = this.mapper.mapArrayToViewModels;

        return getFromRepo().then(mapToViewModels);
    }

    public async saveOne(viewModel: Immutable<TViewModel>): Promise<number> {
        const mapToEntity = (vm: TViewModel) => this.mapper.mapToEntity(vm);
        const saveEntity = (e: TEntity): Promise<EntityBase> =>
            this.repo.saveOne(e);

        return Just(viewModel as TViewModel)
            .map(mapToEntity)
            .map(saveEntity)
            .map(CreateMaybeAsync.fromPromiseOfNullable)
            .orDefault(CreateMaybeAsync.ofNothing())
            .run()
            .then(entity => entity.map(e => e.id).orDefault(0));
    }

    public async saveMany(
        viewModels: Immutable<TViewModel[]>
    ): Promise<number[]> {
        const mapToEntities = (vms: TViewModel[]) =>
            this.mapper.mapArrayToEntities(vms);
        const mapToIds = (entities: EntityBase[]): number[] =>
            entities.map(e => e.id);
        const saveEntities = (e: TEntity[]): Promise<EntityBase[]> =>
            this.repo.saveMany(e);

        return Just([...viewModels] as TViewModel[])
            .map(mapToEntities)
            .map(saveEntities)
            .map(CreateMaybeAsync.fromPromiseOfNullable)
            .orDefault(CreateMaybeAsync.ofNothing())
            .run()
            .then(savedEntities => savedEntities.orDefault([]))
            .then(mapToIds);
    }

    public async delete(viewModel: Immutable<TViewModel>): Promise<void> {
        return Just(viewModel as TViewModel)
            .map(vm => this.mapper.mapToEntity(vm))
            .map(e => this.repo.delete(e))
            .extract();
    }
}
