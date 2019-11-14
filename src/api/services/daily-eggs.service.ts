import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Egg, SlackUser } from '../../db/entities';
import { EggRepo, SlackUserRepo } from '../../db/repos';

@Injectable()
export class DailyEggsService
{
    constructor(private eggRepo: EggRepo, private userRepo: SlackUserRepo) { }

    public async ensureDailyEggsFresh(user: SlackUser): Promise<SlackUser>
    {
        const midnightLastNight = moment().hour(0).minute(0).second(0);
        const refreshedToday = moment(user.dailyEggsLastRefreshedDate).isAfter(midnightLastNight);
        const noGiveableEggsLeft = !user.eggs?.some(egg => !egg.givenByUser);

        if (!refreshedToday && noGiveableEggsLeft)
        {
            await this.createDailyEggs(user);
            user.dailyEggsLastRefreshedDate = new Date();

            return await this.userRepo.save(user);
        }

        return user;
    }

    private async createDailyEggs(user: SlackUser): Promise<void>
    {
        for (const chicken of user.chickens || [])
        {
            const egg = new Egg();
            egg.ownedByUser = user;
            egg.laidByChicken = chicken;
            user.eggs?.push(egg);
        }

        this.eggRepo.save(user.eggs ?? []);
    }
}
