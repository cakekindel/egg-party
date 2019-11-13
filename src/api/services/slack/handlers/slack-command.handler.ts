import { Injectable } from '@nestjs/common';
import { SlackDmCommand } from '../../../../shared/enums';

@Injectable()
export class SlackCommandHandler
{
    constructor() { }

    public async handleCommand(command: SlackDmCommand): Promise<void>
    {

    }
}
