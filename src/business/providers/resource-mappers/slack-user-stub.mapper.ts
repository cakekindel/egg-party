import * as Stub from '../../view-models/view-model-stubs';
import * as Entity from '../../../db/entities';

import { ResourceMapperBase } from './resource-mapper.base';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackUserStubMapper extends ResourceMapperBase<
    Stub.ISlackUserStub,
    Entity.ISlackUserIntrinsic
> {
    public mapToEntity(vm: Stub.ISlackUserStub): Entity.ISlackUserIntrinsic {
        return {
            ...vm,
            slackWorkspaceId: vm.teamSlackId,
            slackUserId: vm.slackId,
            isActive: true,
            dailyEggsLastRefreshedDate: vm.eggsLastRefreshedDate ?? undefined,
        };
    }
    public mapToViewModel(
        entity: Entity.ISlackUserIntrinsic
    ): Stub.ISlackUserStub {
        return {
            ...entity,
            teamSlackId: entity.slackWorkspaceId,
            slackId: entity.slackUserId,
            eggsLastRefreshedDate: entity.dailyEggsLastRefreshedDate,
        };
    }
}
