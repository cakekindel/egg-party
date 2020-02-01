import { map, pipe, prop, then, defaultTo, tap, __ } from 'ramda';
import { IViewModel } from '../../../business/view-models';
import { EntityBase } from '../../../db/entities';
import { RepoBase } from '../../../db/repos';
import { Immutable } from '../../../shared/types/immutable';
import { ResourceMapperBase } from './resource-mappers/resource-mapper.base';
import { Maybe } from 'purify-ts/Maybe';
import { MaybeAsync, MaybeAsyncHelpers } from 'purify-ts/MaybeAsync';

function maybeAsyncFromNullable<T>(
    promise: PromiseLike<T | undefined | null>
): MaybeAsync<T> {
    return MaybeAsync(async ({ liftMaybe }) =>
        liftMaybe(Maybe.fromNullable(await promise))
    );
}

function maybeAsyncFromPromise<T>(
    promise: PromiseLike<Maybe<T>>
): MaybeAsync<T> {
    return MaybeAsync(async ({ fromPromise }) => fromPromise(promise));
}

export abstract class ProviderBase<
    TViewModel extends IViewModel,
    TEntity extends EntityBase
> {
    protected abstract readonly mapper: ResourceMapperBase<TViewModel, TEntity>;
    protected abstract readonly repo: RepoBase<TEntity, EntityBase>;

    public getById(id: number): MaybeAsync<TViewModel> {
        const getAndMap = pipe(
            this.repo.getById,
            then(Maybe.fromNullable),
            then(this.mapper.mapMaybeToViewModel),
            maybeAsyncFromPromise
        );

        return getAndMap(id);
    }

    public async getAll(): Promise<TViewModel[]> {
        const getAndMap = pipe(
            this.repo.getAll,
            then(this.mapper.mapArrayToViewModels)
        );

        return getAndMap();
    }

    public async saveOne(viewModel: Immutable<TViewModel>): Promise<number> {
        // TODO: remove TViewModel cast once RepoBase accepts immutables
        const mapAndSave = pipe(
            this.mapper.mapToEntity,
            this.repo.saveOne,
            then(prop('id'))
        );

        return mapAndSave(viewModel as TViewModel);
    }

    public async saveMany(
        viewModels: Immutable<TViewModel[]>
    ): Promise<number[]> {
        // TODO: remove TViewModel[] cast once RepoBase accepts immutables
        const save = pipe(
            this.mapper.mapArrayToEntities,
            this.repo.saveMany,
            then(map(e => e.id))
        );

        return save([...viewModels] as TViewModel[]);
    }

    public async delete(viewModel: Immutable<TViewModel>): Promise<void> {
        // TODO: remove TViewModel[] cast once RepoBase accepts immutables
        const mapAndDelete = pipe(this.mapper.mapToEntity, this.repo.delete);

        return mapAndDelete(viewModel as TViewModel);
    }
}
