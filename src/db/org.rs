pub enum OrgType {
    SlackTeam,
    DiscordServer,
}

pub struct Org {
    pub id: u64,
    pub created_at: String,
    pub kind: OrgType,
}

pub struct SlackTeam {
    pub id: u64,
    pub created_at: u64,
    pub org_id: u64,
    pub slack_id: String,
    pub slack_bot_user_id: String,
    pub oauth_token: String,
}

impl SlackTeam {
    pub fn get(slack_id: &str) -> Self {
        let _sql = format!(
            r#"
                SELECT  *
                FROM    [slack_team]
                WHERE   slack_id = "{}"
            "#,
            slack_id
        );

        todo!()
    }
}

