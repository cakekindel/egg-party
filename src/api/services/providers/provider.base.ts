import { map, pipe, prop, then, defaultTo, tap, __ } from 'ramda';
import { IViewModel } from '../../../business/view-models';
import { EntityBase } from '../../../db/entities';
import { RepoBase } from '../../../db/repos';
import { Immutable } from '../../../shared/types/immutable';
import { ResourceMapperBase } from './resource-mappers/resource-mapper.base';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { MaybeAsync, MaybeAsyncHelpers } from 'purify-ts/MaybeAsync';
import { CreateMaybeAsync } from '../../../purify/create-maybe-async.fns';
import { closureOf } from '../../../shared/functions';

export abstract class ProviderBase<
    TViewModel extends IViewModel,
    TEntity extends EntityBase
> {
    protected abstract readonly mapper: ResourceMapperBase<TViewModel, TEntity>;
    protected abstract readonly repo: RepoBase<TEntity, EntityBase>;

    public getById(id: number): MaybeAsync<TViewModel> {
        const getById$ = this.repo.getById(id);
        const getByIdMaybe = CreateMaybeAsync.fromPromiseOfNullable(getById$);
        const toViewModel = this.mapper.mapToViewModel;

        return getByIdMaybe.map(toViewModel);
    }

    public async getAll(): Promise<TViewModel[]> {
        const getFromRepo = this.repo.getAll;
        const mapToViewModels = this.mapper.mapArrayToViewModels;

        return getFromRepo().then(mapToViewModels);
    }

    public async saveOne(viewModel: Immutable<TViewModel>): Promise<number> {
        const mapToEntity = closureOf(this.mapper.mapToEntity);
        const saveEntity = (e: TEntity): MaybeAsync<EntityBase> =>
            CreateMaybeAsync.fromPromiseOfNullable(this.repo.saveOne(e));

        return Just(viewModel as TViewModel)
            .map(mapToEntity)
            .map(saveEntity)
            .orDefault(CreateMaybeAsync.ofNothing())
            .run()
            .then(entity => entity.map(e => e.id).orDefault(0));
    }

    public async saveMany(
        viewModels: Immutable<TViewModel[]>
    ): Promise<number[]> {
        const mapToEntities = closureOf(this.mapper.mapArrayToEntities);
        const mapToIds = (entities: EntityBase[]): number[] =>
            entities.map(e => e.id);
        const saveEntities = (e: TEntity[]): MaybeAsync<EntityBase[]> =>
            CreateMaybeAsync.fromPromiseOfNullable(this.repo.saveMany(e));

        return Just([...viewModels] as TViewModel[])
            .map(mapToEntities)
            .map(saveEntities)
            .orDefault(CreateMaybeAsync.ofNothing())
            .run()
            .then(savedEntities => savedEntities.orDefault([]))
            .then(mapToIds);
    }

    public async delete(viewModel: Immutable<TViewModel>): Promise<void> {
        const mapToEntity = closureOf(this.mapper.mapToEntity);
        const deleteFromRepo = closureOf(this.repo.delete);

        return Just(viewModel as TViewModel)
            .map(mapToEntity)
            .map(deleteFromRepo)
            .extract();
    }
}
