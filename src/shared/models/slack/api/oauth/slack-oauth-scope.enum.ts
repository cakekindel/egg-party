export enum SlackOauthScope {
    SendMessages = 'chat:write',
    StartDirectMessages = 'im:write',
    ReadChannelMessages = 'channels:history',
    ReadDmMessages = 'im:history',
    ReadReactions = 'reactions:read',
}
