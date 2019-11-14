import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { RepoBase } from './repo.base';

import { Egg, EntityName, SlackUser } from '../entities';
import { ChickenRepo } from './chicken.repo';
import { EggRepo } from './egg.repo';

@Injectable()
export class SlackUserRepo extends RepoBase<SlackUser>
{
    protected entityType = SlackUser;

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

    public async create(slackUserId: string, slackWorkspaceId: string): Promise<SlackUser>
    {
        const user = new SlackUser();
        user.slackUserId = slackUserId;
        user.slackWorkspaceId = slackWorkspaceId;

        const savedUser = await this.save(user);

        const chickens = await this.chickenRepo.createNewUserChickens(savedUser);

        const eggs = Array.from(Array(5)).map(() => new Egg());
        eggs.forEach((egg, i) =>
        {
            egg.ownedByUser = savedUser;
            egg.laidByChicken = chickens[i];
        });

        await this.eggRepo.save(eggs);

        return await this.getBySlackId(slackUserId, slackWorkspaceId) as SlackUser;
    }

    public async getOrCreate(slackUserId: string, slackWorkspaceId: string): Promise<{ wasCreated: boolean, user: SlackUser }>
    {
        let wasCreated = false;
        let user = await this.getBySlackId(slackUserId, slackWorkspaceId);

        if (user === undefined)
        {
            wasCreated = true;
            user = await this.create(slackUserId, slackWorkspaceId);
        }

        return { wasCreated, user };
    }
}
