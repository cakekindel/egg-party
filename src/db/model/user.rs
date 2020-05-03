pub enum UserType {
    Slack,
    Discord,
}

pub struct User {
    pub id: u64,
    pub created_at: String,
    pub org_id: u64,
    pub kind: UserType,
}

pub struct SlackUserInfo {
    pub id: u64,
    pub created_at: u64,
}
