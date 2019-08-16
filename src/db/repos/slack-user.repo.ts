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

    public async getBySlackId(slackUserId: string, slackWorkspaceId: string): Promise<SlackUser | undefined>
    {
        const repo = await this.getRepo();
        const relations: Array<keyof SlackUser> = ['chickens', 'eggs', 'eggsGiven'];
        return await repo.findOne({ where: { slackUserId, slackWorkspaceId }, relations });
    }

    public async create(slackUserId: string, slackWorkspaceId: string): Promise<SlackUser | undefined>
    {
        const user = new SlackUser();
        user.slackUserId = slackUserId;
        user.slackWorkspaceId = slackWorkspaceId;

        const savedUser = await this.save(user);

        const chickens = await this.chickenRepo.createNewUserChickens(savedUser);
        const hens = chickens.filter((c) => c.gender === ChickenGender.Hen);

        const eggs = Array.from(Array(5)).map(() => new Egg());
        eggs.forEach((egg, i) =>
        {
            egg.ownedByUser = savedUser;
            egg.laidByChicken = hens[i];
        });

        await this.eggRepo.save(eggs);

        return await this.getBySlackId(slackUserId, slackWorkspaceId);
    }
}
