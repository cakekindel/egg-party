use std::fmt;

use crate::slack;
use super::org;

pub enum UserType {
    Slack,
    Discord,
}

pub struct User {
    pub id: u64,
    pub created_at: String,
    pub kind: String,
}

pub struct UserOrgMembership {
    pub id: u64,
    pub created_at: String,
    pub user_id: u64,
    pub org_id: u64,
}

pub struct SlackUser {
    pub id: u64,
    pub created_at: String,
    pub user_id: u64,
    pub slack_id: String,
}

impl User {
    pub fn create(kind: UserType) -> User {
        let _sql = format!(
            r#"
                INSERT INTO [user]  (kind)
                VALUES              ("{}")
            "#,
            kind
        );

        todo!()
    }
}

impl SlackUser {
    pub fn get(user_ctx: &slack::UserContext) -> Option<SlackUser> {
        let _sql = format!(
            r#"
                SELECT  user.*
                FROM    [slack_user]            user
                JOIN    [user_org_membership]   user_org    ON user_org.user_id = user.user_id
                JOIN    [slack_team]            team        ON team.org_id = user_org.org_id
                WHERE   user.slack_id = "{}"
            "#,
            user_ctx.user_id
        );

        todo!()
    }

    pub fn get_or_create(user_ctx: &slack::UserContext) -> SlackUser {
        let slack_team = org::SlackTeam::get(&user_ctx.team_id);

        let user = User::create(UserType::Slack);
        UserOrgMembership::create(user.id, slack_team.org_id);

        let _sql = format!(
            r#"
                INSERT INTO [slack_user] (user_id, slack_id)
                VALUES                   ("{}",    "{}")
            "#,
            user.id,
            user_ctx.user_id,
        );

        todo!()
    }
}

impl UserOrgMembership {
    pub fn create(user_id: u64, org_id: u64) -> UserOrgMembership {
        let _sql = format!(
            r#"
                INSERT INTO [user_org_membership] (user_id, org_id)
                VALUES                            ("{}",    "{}")
            "#,
            user_id,
            org_id,
        );

        todo!()
    }
}

impl fmt::Display for UserType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", match self {
            UserType::Slack => "slack",
            UserType::Discord => "discord",
        })
    }
}

