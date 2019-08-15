import { Inject } from '@nestjs/common';
import { Connection, Repository as TypeOrmRepository } from 'typeorm';

import { EntityBase, EntityName } from '../entities';

export abstract class RepoBase<TEntity extends EntityBase>
{
    protected abstract entityName: EntityName;

    constructor(@Inject(Connection) protected db: Connection) { }

    public async getAll(): Promise<TEntity[]>
    {
        const repo = await this.getRepo();
        return await repo.find();
    }

    public async getById(id: string | number): Promise<TEntity | undefined>
    {
        const repo = await this.getRepo();
        return await repo.findOne(id);
    }

    public async save(entities: TEntity[]): Promise<TEntity[]>;
    public async save(entity: TEntity): Promise<TEntity>;
    public async save(entity: TEntity | TEntity[]): Promise<TEntity | TEntity[]>
    {
        const repo = await this.getRepo();

        // TODO: remove `as any` when TypeOrm.DeepPartial supports generics better
        return await repo.save(entity as any);
    }

    public async delete(entity: TEntity): Promise<void>
    {
        const repo = await this.getRepo();
        entity.isActive = false;
        await this.save(entity);
    }

    protected async getRepo(): Promise<TypeOrmRepository<TEntity>>
    {
        return await this.db.getRepository<TEntity>(this.entityName);
    }
}
