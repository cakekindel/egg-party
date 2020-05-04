use crate::db::func::common::query_first_async;
use crate::db::model::user::User;

pub async fn get_user(id: u64) -> Option<User> {
    let query = format!(
        r#"
    SELECT  *
    FROM    egg_party_user
    WHERE   id = {}
    "#,
        id
    );

    query_first_async::<User>(query.as_str()).await
}
