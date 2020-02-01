import { Maybe } from 'purify-ts/Maybe';

export abstract class ResourceMapperBase<TVm, TEntity> {
    public abstract mapToEntity(vm: TVm): TEntity;
    public abstract mapToViewModel(entity: TEntity): TVm;

    public mapMaybeToEntity(vm: Maybe<TVm>): Maybe<TEntity> {
        const vmMaybe = Maybe.fromNullable(vm).join();

        return vmMaybe.map(this.mapToEntity);
    }

    public mapMaybeToViewModel(entity: Maybe<TEntity>): Maybe<TVm> {
        const entityMaybe = Maybe.fromNullable(entity).join();

        return entityMaybe.map(this.mapToViewModel);
    }

    public mapArrayToEntities(vms: TVm[]): TEntity[] {
        return vms.map(this.mapToEntity);
    }

    public mapArrayToViewModels(entities: TEntity[]): TVm[] {
        return entities.map(this.mapToViewModel);
    }
}
