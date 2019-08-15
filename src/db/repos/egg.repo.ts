import { Injectable } from '@nestjs/common';

import { RepoBase } from './repo.base';

import { Egg, EntityName } from '../entities';

@Injectable()
export class EggRepo extends RepoBase<Egg>
{
    protected entityName = EntityName.Egg;
}
