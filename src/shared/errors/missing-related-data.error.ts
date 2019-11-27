import { Type } from '@nestjs/common';

export class ErrorMissingRelatedData<TEntity> extends Error
{
    constructor(entityType: Type<TEntity>, missingPropertyName: keyof TEntity)
    {
        super();
        // tslint:disable-next-line: max-line-length
        this.message = `Missing related data: ${entityType.name}.${missingPropertyName}. Ensure that the relation is included in the entity repository.`;
    }
}
