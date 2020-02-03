import { Injectable } from '@nestjs/common';
import * as ViewModel from '../../../../business/view-models';
import * as Entity from '../../../../db/entities';
import { ResourceMapperBase } from './resource-mapper.base';
import { SlackUserStubMapper } from './slack-user-stub.mapper';

@Injectable()
export class SlackTeamMapper extends ResourceMapperBase<
    ViewModel.SlackTeam,
    Entity.SlackTeam
> {
    constructor(private readonly userStubMapper: SlackUserStubMapper) {
        super();
    }

    public mapToEntity(team: ViewModel.SlackTeam): Entity.SlackTeam {
        return {
            ...team,
            users: this.userStubMapper.mapArrayToEntities(team.users),
            isActive: true,
        };
    }

    public mapToViewModel(team: Entity.SlackTeam): ViewModel.SlackTeam {
        return {
            ...team,
            users: this.userStubMapper.mapArrayToViewModels(team.users ?? []),
        };
    }
}
