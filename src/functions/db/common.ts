import {TaggedTemplateLiteralInvocationType} from 'slonik';
import { UtcDateString } from '../../types/egg-party/brands';

export type SqlQuery<T = unknown> = T extends null | undefined | unknown
    ? TaggedTemplateLiteralInvocationType
    : TaggedTemplateLiteralInvocationType<T>;

export type SchemaBase = {
    id: number;
    createdDate: UtcDateString;
};

export enum DbTable {
    SlackTeam = 'slack_team',
}
