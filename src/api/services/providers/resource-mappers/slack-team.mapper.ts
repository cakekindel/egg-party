import { assoc, dissoc, pipe } from 'ramda';
import * as ViewModel from '../../../../business/view-models';
import * as Stub from '../../../../business/view-models/view-model-stubs';
import * as Entity from '../../../../db/entities';
import { ResourceMapperBase } from './resource-mapper.base';

export class SlackTeamMapper extends ResourceMapperBase<
    ViewModel.SlackTeam,
    Entity.SlackTeam
> {
    constructor(
        private userStubMapper: ResourceMapperBase<
            Stub.ISlackUserStub,
            Entity.ISlackUserIntrinsic
        >
    ) {
        super();
    }

    public mapToEntity(team: ViewModel.SlackTeam): Entity.SlackTeam {
        // TODO: make these functions generic on ModelMapperBase, provide
        //   default implementations for mapToEntity and mapToViewModel
        const addMissingProperties = (vm: ViewModel.SlackTeam) => {
            return assoc('isActive', true, vm);
        };

        const mapDifferentProperties = (
            obj: ViewModel.SlackTeam & Record<'isActive', boolean>
        ) => {
            const mapUsers = this.userStubMapper.mapArrayToEntities;
            return assoc('users', mapUsers(obj.users), obj) as Entity.SlackTeam;
        };

        const mapToEntity = pipe(addMissingProperties, mapDifferentProperties);

        return mapToEntity(team);
    }

    public mapToViewModel(team: Entity.SlackTeam): ViewModel.SlackTeam {
        type ExtraKeys = Exclude<
            keyof Entity.SlackTeam,
            keyof ViewModel.SlackTeam
        >;

        const removeExtraProperties = (
            t: Entity.SlackTeam
        ): Omit<Entity.SlackTeam, ExtraKeys> => {
            return dissoc('isActive', t) as Entity.SlackTeam &
                Omit<Entity.SlackTeam, 'isActive'>;
        };

        const mapDifferentProperties = (
            t: Omit<Entity.SlackTeam, ExtraKeys>
        ) => {
            const mapUsers = this.userStubMapper.mapArrayToViewModels;

            return assoc(
                'users',
                mapUsers(t.users ?? []),
                t
            ) as ViewModel.SlackTeam;
        };

        return pipe(removeExtraProperties, mapDifferentProperties)(team);
    }
}
