import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Egg, SlackUser } from '../../db/entities';
import { EggRepo, SlackUserRepo } from '../../db/repos';

@Injectable()
export class DailyEggsService {
    constructor(private eggRepo: EggRepo, private userRepo: SlackUserRepo) {}

    public async ensureDailyEggsFresh(user: SlackUser): Promise<SlackUser> {
        const midnightLastNight = moment()
            .hour(0)
            .minute(0)
            .second(0);

        const lastRefreshed = user.dailyEggsLastRefreshedDate;
        const refreshedToday =
            (user.dailyEggsLastRefreshedDate ?? false) &&
            moment(lastRefreshed).isAfter(midnightLastNight);

        const eggIds = user.eggs?.map(e => e.id) ?? [];
        const eggs = await this.eggRepo.getByIds(eggIds);
        const eggsLeftOver = eggs.filter(egg => !egg.givenByUser);
        const maxDailyEggs = user.chickens?.length ?? 5;
        const numberOfDailyEggsToMake = maxDailyEggs - eggsLeftOver.length;

        if (!refreshedToday && numberOfDailyEggsToMake > 0) {
            await this.createDailyEggs(user, numberOfDailyEggsToMake);
            user.dailyEggsLastRefreshedDate = new Date();

            await this.userRepo.save(user);
        }

        return user;
    }

    private async createDailyEggs(
        user: SlackUser,
        numberOfDailyEggsToMake: number
    ): Promise<void> {
        for (let i = 0; i < numberOfDailyEggsToMake; i++) {
            const chicken = user.chickens?.[i]; // this is safe because of the check in ensureDailyEggsFresh
            const egg = new Egg();
            egg.ownedByUser = user;
            egg.laidByChicken = chicken;
            user.eggs?.push(egg);
        }

        this.eggRepo.save(user.eggs ?? []);
    }
}
