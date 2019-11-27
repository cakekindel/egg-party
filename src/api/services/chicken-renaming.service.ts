import { Injectable } from '@nestjs/common';
import { Chicken, SlackUser } from '../../db/entities';
import { ChickenRepo, SlackUserRepo } from '../../db/repos';
import { ErrorMissingRelatedData } from '../../shared/errors/missing-related-data.error';

@Injectable()
export class ChickenRenamingService
{
    constructor(private chickenRepo: ChickenRepo, private slackUserRepo: SlackUserRepo) { }

    public async markChickenForRename(chicken: Chicken): Promise<void>
    {
        if (chicken.ownedByUser === undefined)
            throw new ErrorMissingRelatedData(Chicken, 'ownedByUser');

        await this.handleChickensAlreadyWaiting(chicken.ownedByUser);

        await this.setAwaitingRenameAndSave(chicken, true);
    }

    public async renameChicken(chicken: Chicken, name: string): Promise<void>
    {
        chicken.name = name;
        await this.setAwaitingRenameAndSave(chicken, false);
    }

    public async getChickenAwaitingRenameForUser(slackUserId: string, slackWorkspaceId: string): Promise<Chicken | undefined>
    {
        const user = await this.slackUserRepo.getBySlackId(slackUserId, slackWorkspaceId);
        const chickensWaiting = user?.chickens?.filter(c => c.awaitingRename) ?? [];

        if (chickensWaiting.length === 1)
            return chickensWaiting[0];

        if (chickensWaiting.length > 1)
            await this.setAwaitingRenameAndSave(chickensWaiting, false);

        return undefined;
    }

    private async setAwaitingRenameAndSave(chicken: Chicken | Chicken[], awaitingRename: boolean): Promise<void>
    {
        if (chicken instanceof Array)
        {
            chicken.forEach(c => c.awaitingRename = awaitingRename);
            await this.chickenRepo.save(chicken);
        }
        else
        {
            chicken.awaitingRename = awaitingRename;
            await this.chickenRepo.save(chicken);
        }
    }

    private async handleChickensAlreadyWaiting(user: SlackUser): Promise<void>
    {
        const waitingChicken = await this.getChickenAwaitingRenameForUser(user.slackUserId, user.slackWorkspaceId);
        if (waitingChicken)
            await this.setAwaitingRenameAndSave(waitingChicken, false);
    }
}
