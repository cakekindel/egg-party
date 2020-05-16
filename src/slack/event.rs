use serde::Deserialize;
use simple_error::SimpleResult;

use super::api;
use super::{ChatType, UserContext};

#[derive(Deserialize, Debug)]
#[serde(tag = "type")]
pub enum Event {
    #[serde(rename = "event_callback")]
    Envelope { event: InnerEvent, team_id: String },

    #[serde(rename = "url_verification")]
    Challenge { challenge: String },
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type")]
pub enum InnerEvent {
    #[serde(rename = "message")]
    Message {
        user: String,
        text: String,
        channel_type: ChatType,
    },

    #[serde(rename = "reaction_added")]
    Reaction {
        user: String,
        reaction: String,
        item_user: String,
    },
}

// TODO: Move egg-party specific event handling to other mod, that way Slack types are separate
use crate::db;
use crate::msg::Message;

pub fn act_on_event(event: Event) -> SimpleResult<String> {
    match event {
        Event::Challenge { challenge } => Ok(challenge),
        Event::Envelope { team_id, event: e } => match e {
            InnerEvent::Message {
                user,
                text,
                channel_type,
            } => handle_message(channel_type, text, UserContext::new(user, team_id)),
            InnerEvent::Reaction {
                user: _,
                reaction: _,
                item_user: _,
            } => handle_reaction(),
        },
    }
}

fn handle_message(
    chat_type: ChatType,
    _message: String,
    user_ctx: UserContext,
) -> SimpleResult<String> {
    // TODO:
    //   channel => give egg
    //   dm      => command / rename

    let _user = db::SlackUser::get(&user_ctx).unwrap_or_else(|| {
        api::send_dm(&user_ctx, Message::Welcome.into());
        db::SlackUser::get_or_create(&user_ctx)
    });

    match chat_type {
        ChatType::Channel => unimplemented!(),
        ChatType::Im => unimplemented!(),
        _ => unimplemented!(),
    }
}

fn handle_reaction() -> SimpleResult<String> {
    // TODO:
    //   :egg: => give egg

    unimplemented!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slack_event_should_parse_challenge() {
        // arrange
        let json = r#"
        {
            "type": "url_verification",
            "challenge": "foo"
        }
        "#;

        // act
        let parsed: Event = serde_json::from_str(json).expect("Failed to deserialize Event");

        // assert
        match parsed {
            Event::Challenge { .. } => {}
            _ => panic!("expected Event::Challenge, got other"),
        };
    }
}
