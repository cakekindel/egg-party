import { Chicken } from './chicken.entity';
import { Egg } from './egg.entity';
import { SlackUser } from './slack-user.entity';

export * from './chicken.entity';
export * from './egg.entity';
export * from './entity-name.enum';
export * from './entity.base';
export * from './slack-user.entity';

export const Entities = [
    Chicken,
    Egg,
    SlackUser,
];
