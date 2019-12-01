import { Injectable } from '@nestjs/common';

import { RepoBase } from './repo.base';

import { Egg, SlackUser } from '../entities';

@Injectable()
export class EggRepo extends RepoBase<Egg>
{
    protected entityType = Egg;
    protected defaultRelations: Array<keyof Egg> = ['laidByChicken', 'givenByUser', 'ownedByUser'];

    public async giveToUser(egg: Egg, toUser: SlackUser): Promise<void>
    {
        egg.givenByUser = egg.ownedByUser;
        egg.givenOnDate = new Date();
        egg.ownedByUser = toUser;

        await this.save(egg);
    }
}
