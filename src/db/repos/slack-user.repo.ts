import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { RepoBase } from './repo.base';

import { ChickenGender } from '../../shared/enums';
import { Egg, EntityName, SlackUser } from '../entities';
import { ChickenRepo } from './chicken.repo';
import { EggRepo } from './egg.repo';

@Injectable()
export class SlackUserRepo extends RepoBase<SlackUser>
{
    public entityName = EntityName.SlackUser;

    constructor(protected db: Connection, private chickenRepo: ChickenRepo, private eggRepo: EggRepo)
    {
        super(db);
    }

    public async getOrCreateBySlackId(slackUserId: string, slackWorkspaceId: string): Promise<SlackUser | undefined>
    {
        const repo = await this.getRepo();
        let user = await repo.findOne({ where: { SlackUserId: slackUserId } }) || new SlackUser();

        if (user.id === 0)
        {
            user.slackUserId = slackUserId;
            user.slackWorkspaceId = slackWorkspaceId;

            user = await this.save(user);
        }

        const chickens = await this.chickenRepo.createNewUserChickens(user);
        const hens = chickens.filter((c) => c.gender === ChickenGender.Hen);

        const eggs = Array.from(Array(5)).map(() => new Egg());
        eggs.forEach((egg, i) =>
        {
            egg.ownedByUser = user;
            egg.laidByChicken = hens[i];
        });

        const savedEggs = await this.eggRepo.save(eggs);

        user.chickens = chickens;
        user.eggs = savedEggs;

        return this.save(user);
    }
}
