import { Maybe } from 'purify-ts';

export abstract class ResourceMapperBase<TVm, TEntity> {
    public abstract mapToEntity(vm: TVm): TEntity;
    public abstract mapToViewModel(entity: TEntity): TVm;

    public mapMaybeToEntity(vm: Maybe<TVm>): Maybe<TEntity> {
        return vm.map(this.mapToEntity);
    }

    public mapMaybeToViewModel(entity: Maybe<TEntity>): Maybe<TVm> {
        return entity.map(this.mapToViewModel);
    }

    public mapArrayToEntities(vms: TVm[]): TEntity[] {
        return vms.map(this.mapToEntity);
    }

    public mapArrayToViewModels(entities: TEntity[]): TVm[] {
        return entities.map(this.mapToViewModel);
    }
}
