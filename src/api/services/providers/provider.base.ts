import { Right, EitherAsync, Maybe } from 'purify-ts';
import { IViewModel } from '../../../business/view-models';
import { EntityBase } from '../../../db/entities';
import { RepoBase } from '../../../db/repos';
import { Immutable } from '../../../shared/types/immutable';
import { ResourceMapperBase } from './resource-mappers/resource-mapper.base';

export abstract class ProviderBase<
    TViewModel extends IViewModel,
    TEntity extends EntityBase
> {
    protected abstract readonly mapper: ResourceMapperBase<TViewModel, TEntity>;
    protected abstract readonly repo: RepoBase<TEntity, EntityBase>;

    /**
     * experimenting with EitherAsync pattern
     */
    public getById(id: number): EitherAsync<unknown, Maybe<TViewModel>> {
        const getEntity = (): Promise<TEntity | null | undefined> =>
            this.repo.getById(id);
        const toViewmodel = (e: TEntity): TViewModel =>
            this.mapper.mapToViewModel(e);

        return EitherAsync(getEntity)
            .map(Maybe.fromNullable)
            .map(maybe => maybe.map(toViewmodel));
    }

    public async getAll(): Promise<TViewModel[]> {
        const getFromRepo = this.repo.getAll;
        const mapToViewModels = this.mapper.mapArrayToViewModels;

        return getFromRepo().then(mapToViewModels);
    }

    public async saveOne(viewModel: Immutable<TViewModel>): Promise<number> {
        const toEntity = (vm: TViewModel) => this.mapper.mapToEntity(vm);
        const save = (e: TEntity): Promise<EntityBase> => this.repo.saveOne(e);
        const pickId = (p: Promise<EntityBase>) => p.then(e => e.id);

        return Right<TViewModel>(viewModel as TViewModel)
            .map(toEntity)
            .map(save)
            .map(pickId)
            .orDefault(Promise.reject()); // TODO: Remove when this method returns an Either
    }

    public async saveMany(
        viewModels: Immutable<TViewModel[]>
    ): Promise<number[]> {
        const toEntities = (vms: TViewModel[]): TEntity[] =>
            this.mapper.mapArrayToEntities(vms);
        const save = (entities: TEntity[]): Promise<EntityBase[]> =>
            this.repo.saveMany(entities);
        const pickIds = (p: Promise<EntityBase[]>): Promise<number[]> =>
            p.then(es => es.map(e => e.id));

        return Right([...viewModels] as TViewModel[])
            .map(toEntities)
            .map(save)
            .map(pickIds)
            .orDefault(Promise.reject()); // TODO: Remove when this method returns an Either
    }

    public async delete(viewModel: Immutable<TViewModel>): Promise<void> {
        const toEntity = (vm: TViewModel): TEntity =>
            this.mapper.mapToEntity(vm);
        const deleteAsync = (e: TEntity): Promise<void> => this.repo.delete(e);

        return Right(viewModel as TViewModel)
            .map(toEntity)
            .map(deleteAsync)
            .orDefault(Promise.reject()); // TODO: Remove when this method returns an Either
    }
}
