import { Inject, Type } from '@nestjs/common';
import {
    Connection,
    Repository as TypeOrmRepository,
    DeepPartial,
} from 'typeorm';

import { EntityBase } from '../entities';
import { Nullable } from '../../shared/types/nullable.type';

type OneOrMany<T> = T | T[];

export abstract class RepoBase<
    TEntity extends EntityBase & TEntityWithoutRelations,
    TEntityWithoutRelations = TEntity
> {
    protected abstract entityType: Type<TEntity>;
    protected abstract defaultRelations: Array<keyof TEntity> = [];

    constructor(@Inject(Connection) protected db: Connection) {}

    public async getAll(): Promise<TEntity[]> {
        const repo = this.getRepo();
        return repo.find({
            where: { isActive: true },
            relations: this.defaultRelations as string[],
        });
    }

    public async getByIds(ids: string[] | number[]): Promise<TEntity[]> {
        const repo = this.getRepo();
        const entities = repo.findByIds(ids, {
            relations: this.defaultRelations as string[],
        });

        return entities ?? [];
    }

    public async getById(id: string | number): Promise<Nullable<TEntity>> {
        const repo = this.getRepo();
        return repo.findOne(id, {
            relations: this.defaultRelations as string[],
        });
    }

    public async saveOne(entity: TEntity): Promise<TEntityWithoutRelations> {
        return this.save(entity);
    }

    public async saveMany(
        entities: TEntity[]
    ): Promise<TEntityWithoutRelations[]> {
        return this.save(entities);
    }

    public async save(entities: TEntity[]): Promise<TEntityWithoutRelations[]>;
    public async save(entity: TEntity): Promise<TEntityWithoutRelations>;
    public async save(
        entity: OneOrMany<TEntity>
    ): Promise<OneOrMany<TEntityWithoutRelations>> {
        const repo = this.getRepo();
        const saved = repo.save(entity as TEntity);

        return saved;
    }

    public async delete(entity: TEntity): Promise<void> {
        entity.isActive = false;
        await this.save(entity);
    }

    protected getRepo(): TypeOrmRepository<TEntity> {
        return this.db.getRepository<TEntity>(this.entityType);
    }
}
