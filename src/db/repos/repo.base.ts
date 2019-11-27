import { Inject, Type } from '@nestjs/common';
import { Connection, Repository as TypeOrmRepository } from 'typeorm';

import { EntityBase } from '../entities';

export abstract class RepoBase<TEntity extends EntityBase>
{
    protected abstract entityType: Type<TEntity>;
    protected abstract defaultRelations: Array<keyof TEntity> = [];

    constructor(@Inject(Connection) protected db: Connection) { }

    public async getAll(): Promise<TEntity[]>
    {
        const repo = this.getRepo();
        return await repo.find({ where: { isActive: true, }, relations: this.defaultRelations as string[] });
    }

    public async getById(id: string | number): Promise<TEntity | undefined>
    {
        const repo = this.getRepo();
        return await repo.findOne(id, { relations: this.defaultRelations as string[] });
    }

    public async save(entities: TEntity[]): Promise<TEntity[]>;
    public async save(entity: TEntity): Promise<TEntity>;
    public async save(entity: TEntity | TEntity[]): Promise<TEntity | TEntity[]>
    {
        const repo = this.getRepo();

        // TODO: remove `as any` when TypeOrm.DeepPartial supports generics better
        return await repo.save(entity as any);
    }

    public async delete(entity: TEntity): Promise<void>
    {
        entity.isActive = false;
        await this.save(entity);
    }

    protected getRepo(): TypeOrmRepository<TEntity>
    {
        return this.db.getRepository<TEntity>(this.entityType);
    }
}
