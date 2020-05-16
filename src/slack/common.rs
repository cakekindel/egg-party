use serde::Deserialize;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "snake_case")]
pub enum ChatType {
    Channel,
    Group,
    Im,
    Mpim,
}

/// Helper type, use this when you need to refer to a user within the context
/// of a certain Slack team.
pub struct UserContext {
    pub user_id: String,
    pub team_id: String,
}

impl UserContext {
    pub fn new(user_id: String, team_id: String) -> Self {
        UserContext { user_id, team_id }
    }
}

