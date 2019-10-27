import { Injectable } from '@nestjs/common';

import { RepoBase } from './repo.base';

import { Chicken, EntityName, SlackUser } from '../entities';

@Injectable()
export class ChickenRepo extends RepoBase<Chicken>
{
    protected entityName = EntityName.Chicken;

    public async createNewUserChickens(user: SlackUser): Promise<Chicken[]>
    {
        const chickens = [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
        ];

        chickens.forEach((c) =>
        {
            c.ownedByUser = user;
        });

        return await this.save(chickens);
    }
}