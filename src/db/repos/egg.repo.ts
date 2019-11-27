import { Injectable } from '@nestjs/common';

import { RepoBase } from './repo.base';

import moment = require('moment');
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

    public shouldCreateDailyEggs(user: SlackUser): boolean
    {
        const midnightLastNight = moment().hour(0).minute(0).second(0);

        const giveableEggs = user.eggs?.filter(egg => !egg.givenByUser) ?? [];
        const givenEggs = user.eggsGiven ?? [];
        const allEggs = giveableEggs.concat(givenEggs);

        const todaysDailyEggs = allEggs.filter(egg => moment(egg.createdDate).isAfter(midnightLastNight));

        return todaysDailyEggs.length > 0;
    }

    public async createDailyEggs(user: SlackUser): Promise<void>
    {
        for (const chicken of user.chickens || [])
        {
            const egg = new Egg();
            egg.ownedByUser = user;
            egg.laidByChicken = chicken;
            user.eggs?.push(egg);
        }

        this.save(user.eggs ?? []);
    }
}
