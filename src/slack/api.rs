use thiserror::Error;

use super::msg::Message;
use super::{UserContext};

#[derive(Error, Debug)]
pub enum SlackApiError {
    #[error("unknown slack api error")]
    _Unknown,
}

pub fn send_dm(_user_ctx: &UserContext, _msg: Message) -> Result<(), SlackApiError> {
    

    Ok(())
}

