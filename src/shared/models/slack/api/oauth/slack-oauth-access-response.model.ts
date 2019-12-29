import { Expose, Type, Transform, deserialize } from 'class-transformer';
import { SlackNamedIdentifier } from '../slack-named-identifier.trait';
import { ISlackResponse } from '../slack-response.model';
import { SlackOauthScope } from './slack-oauth-scope.enum';

export class SlackOauthAccessResponse implements ISlackResponse {
    public ok!: boolean;
    public error?: string;

    @Expose({ name: 'access_token' })
    public accessToken!: string;

    @Expose({ name: 'token_type' })
    public tokenType!: 'bot';

    @Expose({ name: 'scope' })
    @Type(() => String)
    @Transform((val: string) => val.split(','))
    public scopes: SlackOauthScope[] = [];

    @Expose({ name: 'bot_user_id' })
    public botUserId!: string;

    @Expose({ name: 'app_id' })
    public appId!: string;

    @Type(() => SlackNamedIdentifier)
    public team!: SlackNamedIdentifier;

    @Type(() => SlackNamedIdentifier)
    public enterprise?: SlackNamedIdentifier;

    public static fromRaw(rawResponse: object): SlackOauthAccessResponse {
        return deserialize(
            SlackOauthAccessResponse,
            JSON.stringify(rawResponse)
        );
    }
}
