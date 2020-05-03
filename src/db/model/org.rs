pub enum OrgType {
    SlackTeam,
    DiscordServer,
}

pub struct Org {
    pub id: u64,
    pub created_at: String,
    pub kind: OrgType,
}

pub struct SlackTeamInfo {
    pub id: u64,
    pub created_at: u64,
    pub org_id: u64,
    pub slack_id: String,
    pub slack_bot_user_id: String,
    pub oauth_token: String,
}
