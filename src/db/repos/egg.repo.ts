import { Injectable } from '@nestjs/common';

import { RepoBase } from './repo.base';

import { Egg } from '../entities';

@Injectable()
export class EggRepo extends RepoBase<Egg>
{
    protected entityType = Egg;
}
